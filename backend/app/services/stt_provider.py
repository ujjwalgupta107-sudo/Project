from typing import Dict, Any

class STTProvider:
    """
    Abstract Interface for Speech-To-Text processing.
    """
    async def transcribe(self, file_path: str) -> Dict[str, Any]:
        """
        Returns transcribed text from an audio file.
        In this development version, STT is explicitly stubbed to NOT_CONFIGURED.
        """
        return {
            "status": "STT_PROVIDER_NOT_CONFIGURED",
            "text": ""
        }
