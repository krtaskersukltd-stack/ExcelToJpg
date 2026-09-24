import os
import random
import shutil
import tempfile
import time
import zipfile
import requests
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from fpdf import FPDF, XPos, YPos

# Try to import imgkit (optional binary dependency)
try:
    import imgkit
    IMGKIT_AVAILABLE = True
except ImportError:
    IMGKIT_AVAILABLE = False

app = FastAPI(title="Excel to Image & Document Converter API", version="1.0.0")

project_dir = os.path.dirname(os.path.abspath(__file__))
upload_dir = os.path.join(project_dir, "upload")
input_dir = os.path.join(upload_dir, "input")
output_dir = os.path.join(upload_dir, "output")

os.makedirs(input_dir, exist_ok=True)
os.makedirs(output_dir, exist_ok=True)

# Configure CORS settings for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.get("/api/health")
async def health_check():
    """Health check endpoint to verify backend status from frontend."""
    return {
        "status": "online",
        "service": "Excel Converter API",
        "version": "1.0.0",
        "supported_formats": ["jpg", "jpeg", "png", "pdf", "docx", "doc"]
    }


def split_dataframe(df, chunk_size):
    """Splits the DataFrame into chunks of rows."""
    if df.empty:
        return [df]
    return [df.iloc[i:i + chunk_size] for i in range(0, len(df), chunk_size)]


def render_dataframe_to_pil(df_chunk, title="Excel Data Preview"):
    """
    High-fidelity pure Pillow fallback table renderer.
    Guarantees crisp, high-resolution rendering without requiring external wkhtmltoimage binaries.
    """
    scale = 2  # High-DPI scaling factor for ultra-sharp text
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


async def excel_to_image_no_borders(excel_path, image_extension, max_rows_per_image=100):
    output_image_prefix = "image"
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    output_folder = os.path.join(input_dir, f"{output_image_prefix}_{timestamp}")
    os.makedirs(output_folder, exist_ok=True)

    # Read the Excel or CSV file
    try:
        if excel_path.endswith('.csv'):
            df = pd.read_csv(excel_path)
        else:
            df = pd.read_excel(excel_path)
    except Exception as e:
        df = pd.read_excel(excel_path, engine='openpyxl')

    df_chunks = split_dataframe(df, max_rows_per_image)

    images = []
    for idx, df_chunk in enumerate(df_chunks):
        output_image_path = os.path.join(
            output_folder,
            f"{output_image_prefix}_part_{idx + 1}.{image_extension}"
        )
        converted_via_imgkit = False

        # Attempt imgkit if available
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

        # Fallback to high-res PIL renderer
        if not converted_via_imgkit:
            img = render_dataframe_to_pil(df_chunk, title=f"Dataset Part {idx + 1}")
            if image_extension.lower() in ["jpg", "jpeg"]:
                img = img.convert("RGB")
            img.save(output_image_path, quality=95)
            images.append(output_image_path)

    # Create a ZIP file of the output folder
    zip_filename = f"output_{timestamp}.zip"
    zip_file_path = os.path.join(output_dir, zip_filename)

    with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(output_folder):
            for file in files:
                zipf.write(os.path.join(root, file), arcname=file)

    # Return the basename cleanly for both Windows and Unix
    return {
        "zip_file_name": zip_filename,
        "first_image": os.path.basename(images[0]) if images else None,
        "total_parts": len(images)
    }


async def save_file_url(url: str):
    url_clean = url.split("?")[0].strip()
    file_extension = url_clean.split(".")[-1].lower() if "." in url_clean else "xlsx"
    valid_extensions = ['xlsx', 'xlsm', 'xls', 'csv']

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
        response = requests.get(url, headers=headers, stream=True, verify=False, timeout=30)
        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                shutil.copyfileobj(response.raw, f)
            return file_path
        else:
            raise HTTPException(status_code=400, detail=f"Failed to download file from URL (HTTP {response.status_code})")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error downloading file: {str(e)}")


async def excel_to_docx_func(file_path, image_extension):
    excel_data = pd.ExcelFile(file_path)
    num = random.randint(1, 10000)
    sheet_name = excel_data.sheet_names[0] if excel_data.sheet_names else "Sheet1"

    doc = Document()

    for s_name in excel_data.sheet_names:
        df = excel_data.parse(s_name)
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
    return output_filename


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
    excel_data = pd.ExcelFile(file_path)
    num = random.randint(1, 10000)
    sheet_name = excel_data.sheet_names[0] if excel_data.sheet_names else "Sheet1"

    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    for s_name in excel_data.sheet_names:
        df = excel_data.parse(s_name)
        pdf.set_font("Helvetica", 'B', 11)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 8, f'Sheet: {s_name}', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
        pdf.ln(2)
        pdf.add_table(df)
        pdf.ln(5)

    output_filename = f"output_{sheet_name}_{num}.{image_extension}"
    output_f = os.path.join(output_dir, output_filename)
    pdf.output(output_f)
    return output_filename


@app.post("/api/excel_to_img")
async def excel_to_image_func(excel_file: UploadFile = File(...), image_extension: str = Form("jpg")):
    img_ext = image_extension.lower().replace(".", "").strip()

    if img_ext not in ["jpg", "jpeg", "png", "pdf", "docx", "doc", "webp"]:
        raise HTTPException(status_code=400, detail="Invalid image extension. Supported: jpg, jpeg, png, pdf, docx, doc, webp")

    try:
        file_data = await excel_file.read()
        filn = excel_file.filename or "upload.xlsx"
        file_extension = filn.split(".")[-1].lower() if "." in filn else "xlsx"

        file_name = f"{random.randint(1, 99999)}.{file_extension}"
        file_path = os.path.join(input_dir, file_name)

        with open(file_path, "wb") as fil:
            fil.write(file_data)

        if img_ext in ["docx", "doc"]:
            conv_res = await excel_to_docx_func(file_path, img_ext)
            return JSONResponse(
                content={
                    "conv": conv_res,
                    "filename": conv_res,
                    "status": "success",
                    "type": "docx"
                },
                status_code=200
            )

        elif img_ext == "pdf":
            conv_res = await excel_to_pdf(file_path, img_ext)
            return JSONResponse(
                content={
                    "conv": conv_res,
                    "filename": conv_res,
                    "status": "success",
                    "type": "pdf"
                },
                status_code=200
            )

        else:
            conv_res = await excel_to_image_no_borders(file_path, img_ext)
            return JSONResponse(
                content={
                    "conv": conv_res["zip_file_name"],
                    "filename": conv_res["zip_file_name"],
                    "status": "success",
                    "type": "zip",
                    "first_image": conv_res.get("first_image"),
                    "total_parts": conv_res.get("total_parts", 1)
                },
                status_code=200
            )

    except Exception as e:
        return JSONResponse(
            content={"error": str(e), "status": "error"},
            status_code=400
        )


@app.post("/api/excel_url")
async def excel_to_url_func(url: str = Form(...), image_extension: str = Form("jpg")):
    img_ext = image_extension.lower().replace(".", "").strip()

    if img_ext not in ["jpg", "jpeg", "png", "pdf", "docx", "doc", "webp"]:
        raise HTTPException(status_code=400, detail="Invalid image extension. Supported: jpg, jpeg, png, pdf, docx, doc, webp")

    try:
        file_path = await save_file_url(url)

        if img_ext in ["docx", "doc"]:
            conv_res = await excel_to_docx_func(file_path, img_ext)
            return JSONResponse(
                content={
                    "conv": conv_res,
                    "filename": conv_res,
                    "status": "success",
                    "type": "docx"
                },
                status_code=200
            )

        elif img_ext == "pdf":
            conv_res = await excel_to_pdf(file_path, img_ext)
            return JSONResponse(
                content={
                    "conv": conv_res,
                    "filename": conv_res,
                    "status": "success",
                    "type": "pdf"
                },
                status_code=200
            )

        else:
            conv_res = await excel_to_image_no_borders(file_path, img_ext)
            return JSONResponse(
                content={
                    "conv": conv_res["zip_file_name"],
                    "filename": conv_res["zip_file_name"],
                    "status": "success",
                    "type": "zip",
                    "first_image": conv_res.get("first_image"),
                    "total_parts": conv_res.get("total_parts", 1)
                },
                status_code=200
            )

    except Exception as e:
        return JSONResponse(
            content={"error": str(e), "status": "error"},
            status_code=400
        )


@app.get("/download_file")
async def download_txt(filename: str):
    file_path = os.path.join(output_dir, filename)

    if not os.path.exists(file_path):
        # Also check input/subfolder in case a single image is requested
        alt_path = os.path.join(input_dir, filename)
        if os.path.exists(alt_path):
            file_path = alt_path
        else:
            return JSONResponse(content={"error": "File not found", "status": "error"}, status_code=404)

    ext = filename.split(".")[-1].lower() if "." in filename else ""
    media_types = {
        "zip": "application/zip",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "doc": "application/msword",
    }
    media_type = media_types.get(ext, "application/octet-stream")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
