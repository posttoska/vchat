import requests
from decouple import config
from elevenlabs.client import ElevenLabs

ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

# eleven labs TTS
def el_tts(msg: str):

    # russian voice
    voice_markos = "ZHIn0jcgR6VIvVAXkwWV"
    model_id = "eleven_multilingual_v2"
    output_format = "mp3_44100_128"

    # configure client
    client = ElevenLabs(
        api_key=ELEVEN_LABS_API_KEY
    )

    # convert text to audio
    audio = client.text_to_speech.convert(
        text=msg,
        voice_id=voice_markos,
        model_id=model_id,
        output_format=output_format,
    )

    return audio