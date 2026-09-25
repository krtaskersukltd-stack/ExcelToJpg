from io import BytesIO

import pandas as pd
from fastapi.testclient import TestClient

from main import app, render_dataframe_to_pil


def run():
    workbook = BytesIO()
    with pd.ExcelWriter(workbook, engine="openpyxl") as writer:
        pd.DataFrame({"Name": ["Alpha", "Beta"], "Value": [10, 20]}).to_excel(
            writer, index=False, sheet_name="Summary"
        )
        pd.DataFrame({"Region": ["East", "West"], "Sales": [100, 200]}).to_excel(
            writer, index=False, sheet_name="Sales"
        )

    client = TestClient(app)
    results = []
    generated = {}
    for output_format in ("jpg", "png", "pdf", "docx", "csv"):
        response = client.post(
            "/api/excel_to_img",
            files={
                "excel_file": (
                    "smoke.xlsx",
                    workbook.getvalue(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                )
            },
            data={"image_extension": output_format, "dpi": "300"},
        )
        body = response.json()
        assert response.status_code == 200, body
        assert body["status"] == "success", body
        download_response = client.get("/download_file", params={"filename": body["filename"]})
        assert download_response.status_code == 200
        generated[output_format] = download_response.content
        assert client.get("/download_file", params={"filename": body["filename"]}).status_code == 404
        if output_format in {"jpg", "png"}:
            assert len(body["sheets"]) == 2, body
            assert body["total_parts"] == 2, body
            assert client.get("/preview_file", params={"filename": body["first_image"]}).status_code == 200
        results.append((output_format, body["type"], body.get("total_parts", 1)))

    csv_response = client.post(
        "/api/file_to_excel",
        files={"source_file": ("source.csv", b"Name,Value\nAlpha,10\nBeta,20", "text/csv")},
        data={"source_kind": "csv"},
    )
    assert csv_response.status_code == 200, csv_response.json()

    pdf_response = client.post(
        "/api/file_to_excel",
        files={"source_file": ("source.pdf", generated["pdf"], "application/pdf")},
        data={"source_kind": "pdf"},
    )
    assert pdf_response.status_code == 200, pdf_response.json()

    image = render_dataframe_to_pil(pd.DataFrame({"Name": ["Alpha"], "Value": [10]}), dpi=300)
    image_bytes = BytesIO()
    image.save(image_bytes, format="PNG")
    image_response = client.post(
        "/api/file_to_excel",
        files={"source_file": ("source.png", image_bytes.getvalue(), "image/png")},
        data={"source_kind": "png"},
    )
    assert image_response.status_code == 200, image_response.json()
    results.extend([("csv-to-excel", "xlsx", 1), ("pdf-to-excel", "xlsx", 1), ("png-to-excel", "xlsx", 1)])
    print(results)


if __name__ == "__main__":
    run()
