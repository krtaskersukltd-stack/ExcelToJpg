import os
import random
import tempfile
import time
import zipfile
import ipaddress
import socket
import uuid
import re
import base64
import hashlib
import hmac
import json
import secrets
import sqlite3
from contextlib import closing
from pathlib import Path
from urllib.parse import urlparse
import requests
from dotenv import load_dotenv
from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request, Response, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from fpdf import FPDF, XPos, YPos
from pydantic import BaseModel, Field
from conversions import (
    FILE_TO_EXCEL_KINDS,
    normalize_source_kind,
    rows_to_xlsx,
    safe_stem,
    source_kind_to_rows,
    workbook_sheets_to_json,
    workbook_sheets_to_tally,
    workbook_to_xls,
    workbook_to_xlsx,
)

try:
    from rapidocr_onnxruntime import RapidOCR
    OCR_ENGINE = RapidOCR()
except Exception:
    OCR_ENGINE = None

# Try to import imgkit (optional binary dependency)
try:
    import imgkit
    IMGKIT_AVAILABLE = True
except ImportError:
    IMGKIT_AVAILABLE = False

app = FastAPI(title="Excel to Image & Document Converter API", version="1.0.0")

ALLOWED_INPUT_EXTENSIONS = {"xlsx", "xlsm", "xls", "csv", "ods"}
ALLOWED_OUTPUT_EXTENSIONS = {"jpg", "jpeg", "png", "pdf", "docx", "csv", "json", "tally", "xls", "xlsx", "xml"}
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(25 * 1024 * 1024)))

project_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(os.path.dirname(project_dir), ".env.local"))
upload_dir = os.path.join(project_dir, "upload")
input_dir = os.path.join(upload_dir, "input")
output_dir = os.path.join(upload_dir, "output")
auth_db_path = os.path.join(project_dir, "auth.db")
AUTH_SECRET = os.getenv("AUTH_SECRET", "change-this-secret-in-production")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()
GOOGLE_BROWSER_CLIENT_ID = os.getenv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "").strip()
GOOGLE_ISSUERS = {"accounts.google.com", "https://accounts.google.com"}
SESSION_COOKIE = "excel_to_jpg_session"
SESSION_MAX_AGE = 60 * 60 * 24 * 7

os.makedirs(input_dir, exist_ok=True)
os.makedirs(output_dir, exist_ok=True)


def init_auth_db():
    with closing(sqlite3.connect(auth_db_path)) as connection, connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT NOT NULL UNIQUE,
                full_name TEXT NOT NULL,
                username TEXT NOT NULL UNIQUE COLLATE NOCASE,
                email TEXT UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at INTEGER NOT NULL
            )
            """
        )
        columns = {row[1] for row in connection.execute("PRAGMA table_info(users)")}
        if "email" not in columns:
            connection.execute("ALTER TABLE users ADD COLUMN email TEXT")
        if "google_sub" not in columns:
            connection.execute("ALTER TABLE users ADD COLUMN google_sub TEXT")
        if "auth_provider" not in columns:
            connection.execute("ALTER TABLE users ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'password'")
        connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email COLLATE NOCASE)")
        connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_unique ON users(google_sub)")


init_auth_db()


def delete_safe_file(filename: str):
    """Safely removes an uploaded or converted file from input and output directories."""
    safe_filename = os.path.basename(filename)
    if not safe_filename or safe_filename != filename:
        return
    for d in (output_dir, input_dir):
        fp = os.path.join(d, safe_filename)
        if os.path.isfile(fp):
            try:
                os.remove(fp)
            except OSError:
                pass

# Configure CORS settings for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv(
        "FRONTEND_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SignupRequest(BaseModel):
    phone: str = ""
    email: str = ""
    full_name: str
    username: str
    password: str


class LoginRequest(BaseModel):
    identifier: str
    password: str


class GoogleAuthRequest(BaseModel):
    credential: str = Field(min_length=1, max_length=8192)


def password_is_strong(password: str) -> bool:
    return (
        len(password) >= 8
        and re.search(r"[A-Z]", password) is not None
        and re.search(r"[a-z]", password) is not None
        and re.search(r"\d", password) is not None
        and re.search(r"[^A-Za-z0-9]", password) is not None
    )


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    derived = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310_000)
    return f"pbkdf2_sha256$310000${base64.urlsafe_b64encode(salt).decode()}${base64.urlsafe_b64encode(derived).decode()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations, salt_value, digest_value = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        salt = base64.urlsafe_b64decode(salt_value.encode())
        expected = base64.urlsafe_b64decode(digest_value.encode())
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, int(iterations))
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def create_session_token(user_id: int) -> str:
    payload = base64.urlsafe_b64encode(json.dumps({"sub": user_id, "exp": int(time.time()) + SESSION_MAX_AGE}, separators=(",", ":")).encode()).decode().rstrip("=")
    signature = hmac.new(AUTH_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{signature}"


def session_user_id(request: Request) -> int | None:
    token = request.cookies.get(SESSION_COOKIE)
    if not token or "." not in token:
        return None
    payload, signature = token.rsplit(".", 1)
    expected = hmac.new(AUTH_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        return None
    try:
        padded = payload + "=" * (-len(payload) % 4)
        data = json.loads(base64.urlsafe_b64decode(padded).decode())
        if int(data["exp"]) < int(time.time()):
            return None
        return int(data["sub"])
    except (ValueError, KeyError, TypeError, json.JSONDecodeError):
        return None


def public_user(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "phone": row["phone"],
        "full_name": row["full_name"],
        "username": row["username"],
        "email": row["email"],
        "auth_provider": row["auth_provider"],
    }


def set_session_cookie(response: Response, user_id: int):
    response.set_cookie(
        key=SESSION_COOKIE,
        value=create_session_token(user_id),
        max_age=SESSION_MAX_AGE,
        httponly=True,
        secure=os.getenv("COOKIE_SECURE", "false").lower() == "true",
        samesite="lax",
        path="/",
    )


@app.post("/api/auth/signup", status_code=201)
async def signup(payload: SignupRequest, response: Response):
    phone = re.sub(r"[^\d+]", "", payload.phone.strip()) if payload.phone else ""
    email = payload.email.strip().lower() if payload.email else ""
    full_name = " ".join(payload.full_name.split())
    username = payload.username.strip()
    # At least one of phone or email must be provided
    if not phone and not email:
        raise HTTPException(status_code=422, detail="Enter a phone number or email address.")
    if phone and (len(phone) < 8 or len(phone) > 16):
        raise HTTPException(status_code=422, detail="Enter a valid phone number.")
    if email and not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    if len(full_name) < 2 or len(full_name) > 80:
        raise HTTPException(status_code=422, detail="Enter your full name.")
    if not re.fullmatch(r"[A-Za-z0-9_.]{3,24}", username):
        raise HTTPException(status_code=422, detail="Username must be 3-24 letters, numbers, dots, or underscores.")
    if not password_is_strong(payload.password):
        raise HTTPException(status_code=422, detail="Use 8+ characters with uppercase, lowercase, number, and symbol.")
    # Use email as phone placeholder when phone is not provided
    db_phone = phone if phone else f"email:{email}"
    db_email = email if email else None
    try:
        with sqlite3.connect(auth_db_path) as connection:
            cursor = connection.execute(
                "INSERT INTO users (phone, email, full_name, username, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (db_phone, db_email, full_name, username, hash_password(payload.password), int(time.time())),
            )
            user_id = int(cursor.lastrowid)
    except sqlite3.IntegrityError as error:
        message = "That phone number, email, or username is already registered."
        raise HTTPException(status_code=409, detail=message) from error
    set_session_cookie(response, user_id)
    return {"user": {"id": user_id, "phone": phone, "full_name": full_name, "username": username, "email": db_email}}


@app.post("/api/auth/login")
async def login(payload: LoginRequest, response: Response):
    identifier = payload.identifier.strip()
    normalized_phone = re.sub(r"[^\d+]", "", identifier)
    with sqlite3.connect(auth_db_path) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute(
            "SELECT * FROM users WHERE username = ? COLLATE NOCASE OR email = ? COLLATE NOCASE OR phone = ?",
            (identifier, identifier, normalized_phone),
        ).fetchone()
    if row is None or not verify_password(payload.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect username, phone, email, or password.")
    set_session_cookie(response, int(row["id"]))
    return {"user": public_user(row)}


@app.post("/api/auth/google")
async def google_auth(payload: GoogleAuthRequest, response: Response):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google sign-in is not configured on the server.")
    if GOOGLE_BROWSER_CLIENT_ID and GOOGLE_BROWSER_CLIENT_ID != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google sign-in client IDs do not match.")

    try:
        token_data = google_id_token.verify_oauth2_token(
            payload.credential.strip(),
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
        )
    except (ValueError, GoogleAuthError) as error:
        raise HTTPException(status_code=401, detail="Google could not verify this sign-in.") from error

    google_sub = str(token_data.get("sub") or "").strip()
    email = str(token_data.get("email") or "").strip().lower()
    name = " ".join(str(token_data.get("name") or "").split())
    issuer = str(token_data.get("iss") or "")
    audience = token_data.get("aud")
    authorized_party = token_data.get("azp")
    if (
        issuer not in GOOGLE_ISSUERS
        or audience != GOOGLE_CLIENT_ID
        or (authorized_party is not None and authorized_party != GOOGLE_CLIENT_ID)
        or not google_sub
        or not email
        or token_data.get("email_verified") is not True
    ):
        raise HTTPException(status_code=401, detail="Google did not provide a verified account.")

    try:
        with closing(sqlite3.connect(auth_db_path)) as connection, connection:
            connection.row_factory = sqlite3.Row
            row = connection.execute(
                "SELECT * FROM users WHERE google_sub = ?",
                (google_sub,),
            ).fetchone()

            if row is not None:
                user_id = int(row["id"])
                connection.execute(
                    "UPDATE users SET email = ?, full_name = ? WHERE id = ?",
                    (email, name or row["full_name"], user_id),
                )
                row = connection.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
                user_data = public_user(row)
            else:
                # Never attach a Google identity to a local account based only on a
                # matching email. Account linking requires a separately authenticated flow.
                if connection.execute(
                    "SELECT id FROM users WHERE email = ? COLLATE NOCASE",
                    (email,),
                ).fetchone():
                    raise HTTPException(
                        status_code=409,
                        detail="An account already uses this email. Sign in with its existing method.",
                    )

                full_name = name or email.split("@")[0].title()
                base_username = re.sub(r"[^A-Za-z0-9_.]", "", email.split("@")[0])[:20] or "user"
                username = base_username
                idx = 1
                while connection.execute("SELECT id FROM users WHERE username = ? COLLATE NOCASE", (username,)).fetchone():
                    username = f"{base_username[:16]}_{idx}"
                    idx += 1

                random_pwd = secrets.token_urlsafe(18) + "Aa1!"
                cursor = connection.execute(
                    "INSERT INTO users (phone, email, full_name, username, password_hash, created_at, google_sub, auth_provider) VALUES (?, ?, ?, ?, ?, ?, ?, 'google')",
                    (f"google:{google_sub}", email, full_name, username, hash_password(random_pwd), int(time.time()), google_sub),
                )
                user_id = int(cursor.lastrowid)
                row = connection.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
                user_data = public_user(row)
    except sqlite3.IntegrityError as error:
        raise HTTPException(status_code=409, detail="That Google account is already registered.") from error

    set_session_cookie(response, user_id)
    return {"user": user_data}


@app.get("/api/auth/me")
async def current_user(request: Request):
    user_id = session_user_id(request)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    with sqlite3.connect(auth_db_path) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=401, detail="Session user no longer exists.")
    return {"user": public_user(row)}


@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie(SESSION_COOKIE, path="/")
    return {"ok": True}


@app.get("/")
@app.get("/api/health")
async def health_check():
    """Health check endpoint to verify backend status from frontend."""
    return {
        "status": "online",
        "service": "Excel Converter API",
        "version": "1.1.0",
        "supported_outputs": sorted(ALLOWED_OUTPUT_EXTENSIONS),
        "supported_file_to_excel": sorted(FILE_TO_EXCEL_KINDS),
        "supported_inputs": sorted(ALLOWED_INPUT_EXTENSIONS),
        "max_upload_bytes": MAX_UPLOAD_BYTES,
    }


def split_dataframe(df, chunk_size):
    """Splits the DataFrame into chunks of rows."""
    if df.empty:
        return [df]
    return [df.iloc[i:i + chunk_size] for i in range(0, len(df), chunk_size)]


def render_dataframe_to_pil(df_chunk, title="Excel Data Preview", dpi=300):
    """
    High-fidelity pure Pillow fallback table renderer.
    Guarantees crisp, high-resolution rendering without requiring external wkhtmltoimage binaries.
    """
    scale = max(1, min(4, round(dpi / 150)))
    padding_x = 16 * scale
    padding_y = 12 * scale
    header_height = 42 * scale
    row_height = 36 * scale
    title_height = 48 * scale if title else 20 * scale

    # Convert all dataframe values to string
    cols = [str(c) for c in df_chunk.columns]
    data = [[str(val) if pd.notna(val) else "" for val in row] for row in df_chunk.values]

    # Use default font or truetype if available
    try:
        font_title = ImageFont.truetype("arial.ttf", 18 * scale)
        font_header = ImageFont.truetype("arialbd.ttf", 13 * scale)
        font_cell = ImageFont.truetype("arial.ttf", 12 * scale)
    except Exception:
        font_title = ImageFont.load_default()
        font_header = font_title
        font_cell = font_title

    # Compute column widths
    temp_img = Image.new("RGB", (100, 100))
    draw = ImageDraw.Draw(temp_img)

    col_widths = []
    for col_idx, col_name in enumerate(cols):
        # Measure header width
        bbox = draw.textbbox((0, 0), col_name, font=font_header)
        max_w = (bbox[2] - bbox[0]) + padding_x * 2

        # Measure cell contents in this column
        for row in data:
            cell_text = row[col_idx]
            bbox = draw.textbbox((0, 0), cell_text, font=font_cell)
            w = (bbox[2] - bbox[0]) + padding_x * 2
            if w > max_w:
                max_w = w

        # Cap column width between 100*scale and 450*scale
        max_w = max(90 * scale, min(max_w, 420 * scale))
        col_widths.append(max_w)

    total_table_width = sum(col_widths)
    margin = 24 * scale
    img_width = total_table_width + margin * 2
    num_rows = len(data)
    total_table_height = header_height + num_rows * row_height
    img_height = title_height + total_table_height + margin * 2

    # Canvas
    image = Image.new("RGB", (img_width, img_height), color=(250, 251, 253))
    draw = ImageDraw.Draw(image)

    # Draw Title Header Card
    if title:
        draw.rectangle(
            [margin, margin, margin + total_table_width, margin + title_height - 6 * scale],
            fill=(53, 91, 255)
        )
        draw.text(
            (margin + 16 * scale, margin + 12 * scale),
            title,
            fill=(255, 255, 255),
            font=font_title
        )

    # Table start Y
    start_y = margin + title_height
    curr_x = margin

    # Draw Table Header
    draw.rectangle(
        [curr_x, start_y, curr_x + total_table_width, start_y + header_height],
        fill=(238, 243, 254)
    )

    x_offset = curr_x
    for i, col_name in enumerate(cols):
        w = col_widths[i]
        # Column boundary
        draw.line(
            [(x_offset + w, start_y), (x_offset + w, start_y + total_table_height)],
            fill=(226, 232, 240),
            width=1 * scale
        )
        # Header text
        draw.text(
            (x_offset + padding_x, start_y + 12 * scale),
            col_name,
            fill=(30, 41, 59),
            font=font_header
        )
        x_offset += w

    # Draw Rows
    row_y = start_y + header_height
    for r_idx, row in enumerate(data):
        row_bg = (255, 255, 255) if r_idx % 2 == 0 else (248, 250, 252)
        draw.rectangle(
            [curr_x, row_y, curr_x + total_table_width, row_y + row_height],
            fill=row_bg
        )

        x_cell = curr_x
        for c_idx, cell_value in enumerate(row):
            w = col_widths[c_idx]
            draw.text(
                (x_cell + padding_x, row_y + 9 * scale),
                cell_value,
                fill=(51, 65, 85),
                font=font_cell
            )
            x_cell += w

        # Bottom row border
        draw.line(
            [(curr_x, row_y + row_height), (curr_x + total_table_width, row_y + row_height)],
            fill=(241, 245, 249),
            width=1 * scale
        )
        row_y += row_height

    # Outer table border
    draw.rectangle(
        [curr_x, start_y, curr_x + total_table_width, start_y + total_table_height],
        outline=(203, 213, 225),
        width=1 * scale
    )

    return image


def load_workbook_sheets(excel_path):
    """Return every sheet as (name, dataframe), including CSV/ODS as sheets."""
    lower = excel_path.lower()
    if lower.endswith(".csv"):
        return [("CSV Data", pd.read_csv(excel_path))]
    if lower.endswith(".ods"):
        return [("ODS Data", pd.read_excel(excel_path, engine="odf"))]
    with pd.ExcelFile(excel_path) as workbook:
        return [(name, workbook.parse(name)) for name in workbook.sheet_names]


def extract_sheet_data(workbook_sheets, max_rows=500):
    sheet_data = {}
    for sheet_name, df in workbook_sheets:
        clean_cols = [str(c) for c in df.columns]
        clean_rows = [
            [str(val) if pd.notna(val) else "" for val in row]
            for row in df.values.tolist()[:max_rows]
        ]
        sheet_data[sheet_name] = {
            "columns": clean_cols,
            "rows": clean_rows,
            "total_rows": len(df),
        }
    return sheet_data


async def excel_to_image_no_borders(excel_path, image_extension, dpi=300, max_rows_per_image=100):
    job_id = uuid.uuid4().hex[:12]
    workbook_sheets = load_workbook_sheets(excel_path)
    images = []
    outputs = []
    sheet_names = [name for name, _ in workbook_sheets]

    for sheet_name, df in workbook_sheets:
        df_chunks = split_dataframe(df, max_rows_per_image)
        for idx, df_chunk in enumerate(df_chunks):
            output_filename = f"{job_id}_{safe_stem(sheet_name)}_{idx + 1}.{image_extension}"
            output_image_path = os.path.join(output_dir, output_filename)
            converted_via_imgkit = False

            # Attempt imgkit if available.
            if IMGKIT_AVAILABLE:
                try:
                    with tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8") as html_file:
                        custom_css = """
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #fafbfd; padding: 20px; }
                            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                            th { background-color: #355BFF; color: white; text-align: left; padding: 12px 16px; font-weight: 600; }
                            td { text-align: left; padding: 10px 16px; border-bottom: 1px solid #e2e8f0; color: #334155; }
                            tr:nth-child(even) { background-color: #f8fafc; }
                        </style>
                        """
                        table_html = df_chunk.to_html(border=0, index=False)
                        html_content = f"<!DOCTYPE html><html><head><meta charset='utf-8'>{custom_css}</head><body>{table_html}</body></html>"
                        html_file.write(html_content)
                        html_file_path = html_file.name

                    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_img:
                        temp_img_path = temp_img.name

                    imgkit.from_file(html_file_path, temp_img_path)
                    img = Image.open(temp_img_path)
                    if image_extension.lower() in ["jpg", "jpeg"]:
                        img = img.convert("RGB")
                    img.save(output_image_path, quality=95)
                    images.append(output_image_path)
                    converted_via_imgkit = True

                    if os.path.exists(temp_img_path):
                        os.remove(temp_img_path)
                    if os.path.exists(html_file_path):
                        os.remove(html_file_path)
                except Exception as e:
                    print(f"[imgkit fallback to PIL renderer]: {e}")
                    converted_via_imgkit = False

            # Fallback to high-res PIL renderer.
            if not converted_via_imgkit:
                img = render_dataframe_to_pil(
                    df_chunk,
                    title=f"{sheet_name} — Part {idx + 1}",
                    dpi=dpi,
                )
                if image_extension.lower() in ["jpg", "jpeg"]:
                    img = img.convert("RGB")
                img.save(output_image_path, quality=95)
                images.append(output_image_path)
            outputs.append({"filename": output_filename, "sheet": sheet_name, "part": idx + 1})

    zip_filename = f"conversion_{job_id}.zip"
    zip_file_path = os.path.join(output_dir, zip_filename)

    with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for image_path in images:
            zipf.write(image_path, arcname=os.path.basename(image_path))

    sheet_data = extract_sheet_data(workbook_sheets)

    # Return the basename cleanly for both Windows and Unix
    return {
        "zip_file_name": zip_filename,
        "first_image": os.path.basename(images[0]) if images else None,
        "total_parts": len(images),
        "sheets": sheet_names,
        "outputs": outputs,
        "sheet_data": sheet_data,
    }


async def save_file_url(url: str):
    parsed_url = urlparse(url)
    if parsed_url.scheme not in {"http", "https"} or not parsed_url.hostname:
        raise HTTPException(status_code=400, detail="Only public HTTP(S) spreadsheet links are supported")
    try:
        for address in socket.getaddrinfo(parsed_url.hostname, None):
            ip = ipaddress.ip_address(address[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                raise HTTPException(status_code=400, detail="Private or local network URLs are not allowed")
    except socket.gaierror:
        raise HTTPException(status_code=400, detail="The link hostname could not be resolved")
    url_clean = url.split("?")[0].strip()
    file_extension = url_clean.split(".")[-1].lower() if "." in url_clean else "xlsx"
    valid_extensions = ALLOWED_INPUT_EXTENSIONS

    # Auto convert Google Sheets export URL to XLSX if needed
    if "docs.google.com/spreadsheets" in url:
        if "/export" not in url:
            # Extract doc ID and form export URL
            parts = url.split("/d/")
            if len(parts) > 1:
                doc_id = parts[1].split("/")[0]
                url = f"https://docs.google.com/spreadsheets/d/{doc_id}/export?format=xlsx"
        file_extension = "xlsx"
    elif "dropbox.com" in url and "dl=1" not in url:
        url = url.replace("dl=0", "dl=1")
        if "dl=" not in url:
            url += "?dl=1"

    if file_extension not in valid_extensions:
        file_extension = "xlsx"

    file_name = f"{random.randint(1, 99999)}.{file_extension}"
    file_path = os.path.join(input_dir, file_name)

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, stream=True, timeout=30, allow_redirects=True)
        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=1024 * 1024):
                    downloaded += len(chunk)
                    if downloaded > MAX_UPLOAD_BYTES:
                        raise HTTPException(status_code=413, detail="Remote file exceeds the upload limit")
                    f.write(chunk)
            return file_path
        else:
            raise HTTPException(status_code=400, detail=f"Failed to download file from URL (HTTP {response.status_code})")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error downloading file: {str(e)}")


async def excel_to_docx_func(file_path, image_extension):
    num = random.randint(1, 10000)
    workbook_sheets = load_workbook_sheets(file_path)
    sheet_data = extract_sheet_data(workbook_sheets)
    sheet_name = workbook_sheets[0][0] if workbook_sheets else "Sheet1"

    doc = Document()

    for s_name, df in workbook_sheets:
        doc.add_heading(f'Sheet: {s_name}', level=1)

        if not df.empty:
            table = doc.add_table(rows=1, cols=len(df.columns))
            hdr_cells = table.rows[0].cells
            for idx, col_name in enumerate(df.columns):
                hdr_cells[idx].text = str(col_name)

            for _, row in df.iterrows():
                row_cells = table.add_row().cells
                for idx, value in enumerate(row):
                    row_cells[idx].text = "" if pd.isna(value) else str(value)

    output_filename = f"output_{sheet_name}_{num}.{image_extension}"
    output_f = os.path.join(output_dir, output_filename)
    doc.save(output_f)
    return {"filename": output_filename, "sheet_data": sheet_data}


class PDF(FPDF):
    def header(self):
        self.set_font("Helvetica", 'B', 14)
        self.set_text_color(53, 91, 255)
        self.cell(0, 10, 'Excel to PDF Conversion', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(3)

    def add_table(self, df):
        num_columns = len(df.columns)
        if num_columns == 0:
            return

        page_width = self.w - 2 * self.l_margin
        column_width = page_width / num_columns if num_columns <= 10 else page_width / 10
        font_size = max(6, 10 - (num_columns - 10) // 2) if num_columns > 10 else 9

        # Headers
        self.set_font("Helvetica", 'B', font_size)
        self.set_fill_color(238, 243, 254)
        self.set_text_color(30, 41, 59)

        for col_name in df.columns[:10]:
            self.cell(column_width, 8, str(col_name)[:20], border=1, align='C', fill=True)
        self.ln()

        # Rows
        self.set_font("Helvetica", size=font_size)
        self.set_text_color(51, 65, 85)

        for r_idx, row in df.iterrows():
            fill_row = (r_idx % 2 == 1)
            self.set_fill_color(248, 250, 252) if fill_row else self.set_fill_color(255, 255, 255)

            for value in row[:10]:
                cell_text = "" if pd.isna(value) else str(value)[:22]
                self.cell(column_width, 8, cell_text, border=1, align='C', fill=fill_row)
            self.ln()

            if self.get_y() > self.page_break_trigger:
                self.add_page()
                self.set_font("Helvetica", 'B', font_size)
                self.set_fill_color(238, 243, 254)
                for col_name in df.columns[:10]:
                    self.cell(column_width, 8, str(col_name)[:20], border=1, align='C', fill=True)
                self.ln()
                self.set_font("Helvetica", size=font_size)


async def excel_to_pdf(file_path, image_extension):
    num = random.randint(1, 10000)
    workbook_sheets = load_workbook_sheets(file_path)
    sheet_data = extract_sheet_data(workbook_sheets)
    sheet_name = workbook_sheets[0][0] if workbook_sheets else "Sheet1"

    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    for s_name, df in workbook_sheets:
        pdf.set_font("Helvetica", 'B', 11)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 8, f'Sheet: {s_name}', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
        pdf.ln(2)
        pdf.add_table(df)
        pdf.ln(5)

    output_filename = f"output_{sheet_name}_{num}.{image_extension}"
    output_f = os.path.join(output_dir, output_filename)
    pdf.output(output_f)
    return {"filename": output_filename, "sheet_data": sheet_data}


async def excel_to_csv_func(file_path):
    job_id = uuid.uuid4().hex[:12]
    workbook_sheets = load_workbook_sheets(file_path)
    sheet_data = extract_sheet_data(workbook_sheets)
    csv_files = []
    for sheet_name, dataframe in workbook_sheets:
        csv_name = f"{job_id}_{safe_stem(sheet_name)}.csv"
        csv_path = os.path.join(output_dir, csv_name)
        dataframe.to_csv(csv_path, index=False, encoding="utf-8-sig")
        csv_files.append(csv_path)
    if len(csv_files) == 1:
        return {"filename": os.path.basename(csv_files[0]), "type": "csv", "sheet_data": sheet_data}
    zip_name = f"conversion_{job_id}_csv.zip"
    with zipfile.ZipFile(os.path.join(output_dir, zip_name), "w", zipfile.ZIP_DEFLATED) as archive:
        for csv_path in csv_files:
            archive.write(csv_path, arcname=os.path.basename(csv_path))
    return {"filename": zip_name, "type": "zip", "sheet_data": sheet_data}


async def convert_excel_to_format(file_path: str, img_ext: str, dpi: int = 300):
    """Route an Excel/CSV/ODS workbook to the requested output format."""
    if img_ext == "docx":
        conv_res = await excel_to_docx_func(file_path, img_ext)
        return {
            "conv": conv_res["filename"],
            "filename": conv_res["filename"],
            "status": "success",
            "type": "docx",
            "sheet_data": conv_res.get("sheet_data", {}),
        }
    if img_ext == "pdf":
        conv_res = await excel_to_pdf(file_path, img_ext)
        return {
            "conv": conv_res["filename"],
            "filename": conv_res["filename"],
            "status": "success",
            "type": "pdf",
            "sheet_data": conv_res.get("sheet_data", {}),
        }
    if img_ext == "csv":
        conv_res = await excel_to_csv_func(file_path)
        return {
            "conv": conv_res["filename"],
            "filename": conv_res["filename"],
            "status": "success",
            "type": conv_res["type"],
            "sheet_data": conv_res.get("sheet_data", {}),
        }
    if img_ext == "json":
        conv_res = workbook_sheets_to_json(load_workbook_sheets(file_path), output_dir, extract_sheet_data)
        return {
            "conv": conv_res["filename"],
            "filename": conv_res["filename"],
            "status": "success",
            "type": "json",
            "sheet_data": conv_res.get("sheet_data", {}),
        }
    if img_ext in {"tally", "xml"}:
        conv_res = workbook_sheets_to_tally(load_workbook_sheets(file_path), output_dir, extract_sheet_data)
        return {
            "conv": conv_res["filename"],
            "filename": conv_res["filename"],
            "status": "success",
            "type": "xml",
            "sheet_data": conv_res.get("sheet_data", {}),
        }
    if img_ext == "xls":
        conv_res = workbook_to_xls(load_workbook_sheets(file_path), output_dir, extract_sheet_data)
        return {
            "conv": conv_res["filename"],
            "filename": conv_res["filename"],
            "status": "success",
            "type": "xls",
            "sheet_data": conv_res.get("sheet_data", {}),
        }
    if img_ext == "xlsx":
        conv_res = workbook_to_xlsx(load_workbook_sheets(file_path), output_dir, extract_sheet_data)
        return {
            "conv": conv_res["filename"],
            "filename": conv_res["filename"],
            "status": "success",
            "type": "xlsx",
            "sheet_data": conv_res.get("sheet_data", {}),
        }
    if img_ext in {"jpg", "jpeg", "png"}:
        conv_res = await excel_to_image_no_borders(file_path, img_ext, dpi=dpi)
        return {
            "conv": conv_res["zip_file_name"],
            "filename": conv_res["zip_file_name"],
            "status": "success",
            "type": "zip",
            "first_image": conv_res.get("first_image"),
            "total_parts": conv_res.get("total_parts", 1),
            "sheets": conv_res.get("sheets", []),
            "outputs": conv_res.get("outputs", []),
            "sheet_data": conv_res.get("sheet_data", {}),
        }
    raise HTTPException(status_code=400, detail="Unsupported output format")


def render_dataframe_to_outputs(df: pd.DataFrame, sheet_name: str, image_extension: str, dpi: int = 300, max_rows_per_image: int = 100):
    job_id = uuid.uuid4().hex[:12]
    clean_sheet = safe_stem(sheet_name)
    img_ext = image_extension.lower().replace(".", "").strip()

    if img_ext in ["jpg", "jpeg", "png"]:
        df_chunks = split_dataframe(df, max_rows_per_image)
        images = []
        outputs = []
        for idx, df_chunk in enumerate(df_chunks):
            output_filename = f"{job_id}_{clean_sheet}_{idx + 1}.{img_ext}"
            output_image_path = os.path.join(output_dir, output_filename)

            img = render_dataframe_to_pil(
                df_chunk,
                title=f"{sheet_name} — Part {idx + 1}",
                dpi=dpi,
            )
            if img_ext in ["jpg", "jpeg"]:
                img = img.convert("RGB")
            img.save(output_image_path, quality=95)
            images.append(output_image_path)
            outputs.append({"filename": output_filename, "sheet": sheet_name, "part": idx + 1})

        if len(images) > 1:
            zip_filename = f"conversion_{job_id}.zip"
            zip_file_path = os.path.join(output_dir, zip_filename)
            with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for image_path in images:
                    zipf.write(image_path, arcname=os.path.basename(image_path))
            target_file = zip_filename
            out_type = "zip"
        else:
            target_file = outputs[0]["filename"] if outputs else f"{job_id}.{img_ext}"
            out_type = img_ext

        return {
            "status": "success",
            "conv": target_file,
            "filename": target_file,
            "type": out_type,
            "first_image": outputs[0]["filename"] if outputs else None,
            "total_parts": len(images),
            "sheets": [sheet_name],
            "outputs": outputs,
            "sheet_data": {
                sheet_name: {
                    "columns": [str(c) for c in df.columns],
                    "rows": [[str(val) if pd.notna(val) else "" for val in row] for row in df.values.tolist()[:500]],
                    "total_rows": len(df),
                }
            },
        }

    elif img_ext == "pdf":
        pdf = PDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Helvetica", 'B', 11)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 8, f'Sheet: {sheet_name}', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
        pdf.ln(2)
        pdf.add_table(df)
        pdf.ln(5)
        output_filename = f"output_{clean_sheet}_{job_id}.pdf"
        pdf.output(os.path.join(output_dir, output_filename))
        return {
            "status": "success",
            "conv": output_filename,
            "filename": output_filename,
            "type": "pdf",
            "total_parts": 1,
            "sheets": [sheet_name],
            "outputs": [],
            "sheet_data": {
                sheet_name: {
                    "columns": [str(c) for c in df.columns],
                    "rows": [[str(val) if pd.notna(val) else "" for val in row] for row in df.values.tolist()[:500]],
                    "total_rows": len(df),
                }
            },
        }

    elif img_ext == "docx":
        doc = Document()
        doc.add_heading(f'Sheet: {sheet_name}', level=1)
        if not df.empty:
            table = doc.add_table(rows=1, cols=len(df.columns))
            hdr_cells = table.rows[0].cells
            for idx, col_name in enumerate(df.columns):
                hdr_cells[idx].text = str(col_name)
            for _, row in df.iterrows():
                row_cells = table.add_row().cells
                for idx, value in enumerate(row):
                    row_cells[idx].text = "" if pd.isna(value) else str(value)
        output_filename = f"output_{clean_sheet}_{job_id}.docx"
        doc.save(os.path.join(output_dir, output_filename))
        return {
            "status": "success",
            "conv": output_filename,
            "filename": output_filename,
            "type": "docx",
            "total_parts": 1,
            "sheets": [sheet_name],
            "outputs": [],
            "sheet_data": {
                sheet_name: {
                    "columns": [str(c) for c in df.columns],
                    "rows": [[str(val) if pd.notna(val) else "" for val in row] for row in df.values.tolist()[:500]],
                    "total_rows": len(df),
                }
            },
        }

    elif img_ext == "csv":
        csv_name = f"{job_id}_{clean_sheet}.csv"
        csv_path = os.path.join(output_dir, csv_name)
        df.to_csv(csv_path, index=False, encoding="utf-8-sig")
        return {
            "status": "success",
            "conv": csv_name,
            "filename": csv_name,
            "type": "csv",
            "total_parts": 1,
            "sheets": [sheet_name],
            "outputs": [],
            "sheet_data": {
                sheet_name: {
                    "columns": [str(c) for c in df.columns],
                    "rows": [[str(val) if pd.notna(val) else "" for val in row] for row in df.values.tolist()[:500]],
                    "total_rows": len(df),
                }
            },
        }

    else:
        raise HTTPException(status_code=400, detail="Unsupported output format")


def ocr_rows_from_image(file_path):
    if OCR_ENGINE is None:
        raise HTTPException(status_code=503, detail="OCR engine is not installed on the backend")
    result, _ = OCR_ENGINE(file_path)
    if not result:
        raise HTTPException(status_code=422, detail="No readable table text was found in the image")
    words = []
    for box, text, score in result:
        if score < 0.35 or not str(text).strip():
            continue
        center_x = sum(point[0] for point in box) / len(box)
        center_y = sum(point[1] for point in box) / len(box)
        height = max(point[1] for point in box) - min(point[1] for point in box)
        words.append((center_y, center_x, max(height, 10), str(text).strip()))
    words.sort(key=lambda item: (item[0], item[1]))
    rows = []
    for center_y, center_x, height, text in words:
        if not rows or abs(rows[-1]["y"] - center_y) > max(height, rows[-1]["height"]) * 0.65:
            rows.append({"y": center_y, "height": height, "cells": [(center_x, text)]})
        else:
            rows[-1]["cells"].append((center_x, text))
    return [[text for _, text in sorted(row["cells"])] for row in rows]


@app.post("/api/file_to_excel")
async def file_to_excel(source_file: UploadFile = File(...), source_kind: str = Form(...)):
    kind = normalize_source_kind(source_kind)
    if kind not in FILE_TO_EXCEL_KINDS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported source converter. Supported: {', '.join(sorted(FILE_TO_EXCEL_KINDS))}",
        )
    original_name = source_file.filename or f"upload.{next(iter(FILE_TO_EXCEL_KINDS[kind]))}"
    extension = Path(original_name).suffix.lower().lstrip(".")
    if extension not in FILE_TO_EXCEL_KINDS[kind]:
        raise HTTPException(
            status_code=400,
            detail=f"Please upload a valid {kind.replace('_', ' ').upper()} file ({', '.join(sorted(FILE_TO_EXCEL_KINDS[kind]))})",
        )
    content = await source_file.read()
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded file is empty")
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the upload limit")
    input_path = os.path.join(input_dir, f"{uuid.uuid4().hex}.{extension}")
    try:
        with open(input_path, "wb") as handle:
            handle.write(content)
        rows = source_kind_to_rows(kind, input_path, ocr_rows_from_image)
        output_name = rows_to_xlsx(rows, original_name, output_dir)
        return {"status": "success", "filename": output_name, "conv": output_name, "type": "xlsx", "rows": len(rows)}
    except HTTPException:
        raise
    except Exception as error:
        return JSONResponse(content={"status": "error", "error": str(error)}, status_code=400)
    finally:
        if os.path.isfile(input_path):
            try:
                os.remove(input_path)
            except OSError:
                pass


@app.post("/api/excel_to_img")
async def excel_to_image_func(
    excel_file: UploadFile = File(...),
    image_extension: str = Form("jpg"),
    dpi: int = Form(300),
):
    img_ext = image_extension.lower().replace(".", "").strip()

    if img_ext not in ALLOWED_OUTPUT_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported output format")
    if img_ext in {"jpg", "jpeg", "png"} and dpi not in {150, 300, 600}:
        raise HTTPException(status_code=400, detail="DPI must be 150, 300, or 600")

    file_path = None
    try:
        file_data = await excel_file.read()
        if not file_data:
            raise HTTPException(status_code=400, detail="The uploaded file is empty")
        if len(file_data) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="File exceeds the upload limit")
        filn = excel_file.filename or "upload.xlsx"
        file_extension = filn.split(".")[-1].lower() if "." in filn else "xlsx"
        if file_extension not in ALLOWED_INPUT_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Supported inputs: XLS, XLSX, XLSM, ODS, and CSV")

        file_name = f"{random.randint(1, 99999)}.{file_extension}"
        file_path = os.path.join(input_dir, file_name)

        with open(file_path, "wb") as fil:
            fil.write(file_data)

        return JSONResponse(content=await convert_excel_to_format(file_path, img_ext, dpi=dpi), status_code=200)

    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(
            content={"error": str(e), "status": "error"},
            status_code=400
        )
    finally:
        if file_path and os.path.isfile(file_path):
            try:
                os.remove(file_path)
            except OSError:
                pass


@app.post("/api/excel_url")
async def excel_to_url_func(
    url: str = Form(...),
    image_extension: str = Form("jpg"),
    dpi: int = Form(300),
):
    img_ext = image_extension.lower().replace(".", "").strip()

    if img_ext not in ALLOWED_OUTPUT_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported output format")
    if img_ext in {"jpg", "jpeg", "png"} and dpi not in {150, 300, 600}:
        raise HTTPException(status_code=400, detail="DPI must be 150, 300, or 600")

    file_path = None
    try:
        file_path = await save_file_url(url)
        return JSONResponse(content=await convert_excel_to_format(file_path, img_ext, dpi=dpi), status_code=200)

    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(
            content={"error": str(e), "status": "error"},
            status_code=400
        )
    finally:
        if file_path and os.path.isfile(file_path):
            try:
                os.remove(file_path)
            except OSError:
                pass


class RenderEditedTableRequest(BaseModel):
    sheet_name: str = "Sheet1"
    columns: list[str]
    rows: list[list[str]]
    format: str = "jpg"
    dpi: int = 300


@app.post("/api/render_edited_table")
async def render_edited_table_endpoint(payload: RenderEditedTableRequest):
    img_ext = payload.format.lower().replace(".", "").strip()
    if img_ext not in ALLOWED_OUTPUT_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported output format")
    if payload.dpi not in {150, 300, 600}:
        raise HTTPException(status_code=400, detail="DPI must be 150, 300, or 600")
    if not payload.columns:
        raise HTTPException(status_code=400, detail="Table must contain at least one column")

    try:
        df = pd.DataFrame(data=payload.rows, columns=payload.columns)
        res = render_dataframe_to_outputs(
            df=df,
            sheet_name=payload.sheet_name or "Sheet1",
            image_extension=img_ext,
            dpi=payload.dpi,
        )
        return JSONResponse(content=res, status_code=200)
    except Exception as e:
        return JSONResponse(content={"status": "error", "error": str(e)}, status_code=400)


class CleanupFilesRequest(BaseModel):
    filenames: list[str]


@app.post("/api/cleanup_files")
async def cleanup_files_endpoint(payload: CleanupFilesRequest):
    """Immediately purges user files when page refreshes, closes, or resets."""
    for fn in payload.filenames:
        delete_safe_file(fn)
    return {"status": "success", "cleaned": len(payload.filenames)}


@app.get("/download_file")
async def download_txt(filename: str, background_tasks: BackgroundTasks):
    safe_filename = os.path.basename(filename)
    if safe_filename != filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    file_path = os.path.join(output_dir, safe_filename)

    if not os.path.exists(file_path):
        # Also check input/subfolder in case a single image is requested
        alt_path = os.path.join(input_dir, safe_filename)
        if os.path.exists(alt_path):
            file_path = alt_path
        else:
            return JSONResponse(content={"error": "File not found or already deleted after download.", "status": "error"}, status_code=404)

    ext = safe_filename.split(".")[-1].lower() if "." in safe_filename else ""
    media_types = {
        "zip": "application/zip",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "xls": "application/vnd.ms-excel",
        "csv": "text/csv; charset=utf-8",
        "json": "application/json",
        "xml": "application/xml",
        "doc": "application/msword",
    }
    media_type = media_types.get(ext, "application/octet-stream")

    # The response owns the file until streaming finishes, then removes it immediately.
    # There is deliberately no time-based retention limit: an undownloaded result stays
    # available for the current page session and is removed by the refresh/close beacon.
    background_tasks.add_task(delete_safe_file, safe_filename)

    return FileResponse(
        path=file_path,
        filename=safe_filename,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{safe_filename}"'}
    )


@app.get("/preview_file")
async def preview_file(filename: str):
    safe_filename = os.path.basename(filename)
    if safe_filename != filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    file_path = os.path.join(output_dir, safe_filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Preview not found")
    extension = Path(safe_filename).suffix.lower()
    if extension not in {".jpg", ".jpeg", ".png"}:
        raise HTTPException(status_code=400, detail="Preview is only available for images")
    return FileResponse(file_path, media_type="image/jpeg" if extension in {".jpg", ".jpeg"} else "image/png")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
