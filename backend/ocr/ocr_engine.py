import pytesseract
from pdf2image import convert_from_path


def ocr_pdf(pdf_path: str) -> str:
    pages = convert_from_path(pdf_path, dpi=300)
    full_text = ""

    for i, page in enumerate(pages):
        text = pytesseract.image_to_string(page)
        full_text += f"\n{text}"

    return full_text
