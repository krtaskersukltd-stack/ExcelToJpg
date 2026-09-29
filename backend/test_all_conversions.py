from io import BytesIO
import pandas as pd
from fastapi.testclient import TestClient
from main import app, render_dataframe_to_pil
import json
from openpyxl import Workbook

def test_all():
    client = TestClient(app)
    
    # 1. Test Excel to JPG/PNG/PDF/DOCX/CSV/JSON/TALLY/XLS/XLSX
    wb = BytesIO()
    with pd.ExcelWriter(wb, engine="openpyxl") as writer:
        pd.DataFrame({"ID": [1, 2, 3], "Item": ["Widget", "Gadget", "Device"], "Price": [19.99, 29.99, 49.99]}).to_excel(
            writer, index=False, sheet_name="Inventory"
        )
    excel_bytes = wb.getvalue()
    
    for fmt in ["jpg", "png", "pdf", "docx", "csv", "json", "tally", "xls", "xlsx"]:
        res = client.post(
            "/api/excel_to_img",
            files={"excel_file": ("test.xlsx", excel_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
            data={"image_extension": fmt, "dpi": "300"}
        )
        assert res.status_code == 200, f"Excel to {fmt} failed: {res.text}"
        data = res.json()
        assert data["status"] == "success", f"Excel to {fmt} returned non-success: {data}"
        print(f"✓ Excel to {fmt.upper()} works!")

    # 2. Test Image OCR (PNG/JPG/JPEG to Excel)
    img = render_dataframe_to_pil(pd.DataFrame({"Col1": ["DataA", "DataB"], "Col2": [100, 200]}), dpi=300)
    img_bytes = BytesIO()
    img.save(img_bytes, format="PNG")
    png_data = img_bytes.getvalue()
    
    for kind in ["png", "jpg", "jpeg"]:
        res = client.post(
            "/api/file_to_excel",
            files={"source_file": (f"test.{kind}", png_data, f"image/{kind if kind != 'jpg' else 'jpeg'}")},
            data={"source_kind": kind}
        )
        assert res.status_code == 200, f"{kind.upper()} to Excel failed: {res.text}"
        data = res.json()
        assert data["status"] == "success", f"{kind} to Excel failed: {data}"
        print(f"✓ {kind.upper()} to Excel works!")

    # 3. Test CSV to Excel
    res = client.post(
        "/api/file_to_excel",
        files={"source_file": ("test.csv", b"HeaderA,HeaderB\nVal1,Val2\nVal3,Val4", "text/csv")},
        data={"source_kind": "csv"}
    )
    assert res.status_code == 200 and res.json()["status"] == "success"
    print("✓ CSV to Excel works!")

    # 4. Test TSV to Excel
    res = client.post(
        "/api/file_to_excel",
        files={"source_file": ("test.tsv", b"HeaderA\tHeaderB\nVal1\tVal2", "text/tab-separated-values")},
        data={"source_kind": "tsv"}
    )
    assert res.status_code == 200 and res.json()["status"] == "success"
    print("✓ TSV to Excel works!")

    # 5. Test JSON to Excel
    json_bytes = json.dumps([{"name": "Alice", "score": 95}, {"name": "Bob", "score": 88}]).encode()
    res = client.post(
        "/api/file_to_excel",
        files={"source_file": ("test.json", json_bytes, "application/json")},
        data={"source_kind": "json"}
    )
    assert res.status_code == 200 and res.json()["status"] == "success"
    print("✓ JSON to Excel works!")

    # 6. Test TXT to Excel
    res = client.post(
        "/api/file_to_excel",
        files={"source_file": ("test.txt", b"Line1,Col2\nLine2,Col2", "text/plain")},
        data={"source_kind": "txt"}
    )
    assert res.status_code == 200 and res.json()["status"] == "success"
    print("✓ TXT to Excel works!")

    # 7. Test XML to Excel (Diverse Formats)
    # 7a. Standard element list
    xml_bytes1 = b"<catalog><book id='1'><title>Python</title><price>29.99</price></book><book id='2'><title>JS</title><price>19.99</price></book></catalog>"
    res1 = client.post("/api/file_to_excel", files={"source_file": ("books.xml", xml_bytes1, "text/xml")}, data={"source_kind": "xml"})
    assert res1.status_code == 200 and res1.json()["status"] == "success"

    # 7b. SpreadsheetML table
    xml_bytes2 = b"<Workbook><Worksheet><Table><Row><Cell><Data>ColA</Data></Cell><Cell><Data>ColB</Data></Cell></Row><Row><Cell><Data>Val1</Data></Cell><Cell><Data>Val2</Data></Cell></Row></Table></Worksheet></Workbook>"
    res2 = client.post("/api/file_to_excel", files={"source_file": ("table.xml", xml_bytes2, "text/xml")}, data={"source_kind": "xml"})
    assert res2.status_code == 200 and res2.json()["status"] == "success"

    # 7c. Attribute-based XML
    xml_bytes3 = b"<inventory><item id='101' sku='ABC' qty='50'/><item id='102' sku='XYZ' qty='25'/></inventory>"
    res3 = client.post("/api/file_to_excel", files={"source_file": ("attrs.xml", xml_bytes3, "text/xml")}, data={"source_kind": "xml"})
    assert res3.status_code == 200 and res3.json()["status"] == "success"
    print("✓ XML to Excel works (Elements, SpreadsheetML & Attributes)!")

    # 8. Test VCF to Excel
    vcf_bytes = b"BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+123456789\nEMAIL:john@example.com\nEND:VCARD\n"
    res = client.post(
        "/api/file_to_excel",
        files={"source_file": ("test.vcf", vcf_bytes, "text/vcard")},
        data={"source_kind": "vcf"}
    )
    assert res.status_code == 200 and res.json()["status"] == "success"
    print("✓ VCF to Excel works!")

    print("\n🎉 ALL 22 CONVERSIONS AND REVERSE TOOLS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
