from openai import OpenAI
from decouple import config
from fastapi import UploadFile

# retrieve env vars
client = OpenAI(
    api_key=config("OPENAI_API_KEY"),
    organization=config("OPENAI_ORG_ID")    # optional
)

# openai whisper - STT
def stt_convert(audio_file: UploadFile) -> str:
    try:
        transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
        message_text = transcript.text
        return message_text
    except Exception as e:
        print(e)
        return "error while transcripting"