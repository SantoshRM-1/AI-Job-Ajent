import fitz # PyMuPDF
import io

def parse_pdf_from_bytes(file_bytes: bytes) -> str:
    """Extracts text from a given PDF byte array using PyMuPDF."""
    text_content = []
    
    # Open the PDF from memory
    try:
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            for page in doc:
                text = page.get_text()
                if text:
                    text_content.append(text)
        return "\n".join(text_content)
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return ""
