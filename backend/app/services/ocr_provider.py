from typing import Dict, Any

class OCRProvider:
    """
    Abstract Interface for OCR processing.
    """
    async def extract_text(self, file_path: str) -> Dict[str, Any]:
        """
        Returns extracted text from an image.
        In this development version, OCR is explicitly stubbed to NOT_CONFIGURED.
        """
        return {
            "status": "OCR_PROVIDER_NOT_CONFIGURED",
            "text": ""
        }
