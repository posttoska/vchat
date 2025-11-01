# uvicorn main:app
# uvicorn main:app --reload

# main imports

import json
import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
from streamlit import audio_input
from functions.gemini_system_prompt import SYSTEM_PROMPT
from functions.text_to_speech import el_tts
import google.generativeai as genai

# custom function imports
from functions.openai_request import stt_convert

# check json path
json_path = os.path.join(r"stored_data.json")

# get gemini api key
api_key = config("GEMINI_API_KEY")

# configure gemini
genai.configure(api_key=api_key)

# gemini model config
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 65536,
}

# init model
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash-lite-preview-09-2025",
    generation_config=generation_config,
    system_instruction=SYSTEM_PROMPT
)

# init app
app = FastAPI()

# CORS (Cross-Origin Resource Sharing) - resourses we're accepting
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:4174",
    "http://localhost:3000",
    "http://127.0.0.1:8000"
]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# main our-API page
@app.get("/")
async def root():
    return {"message": "welcome to vchat!"}


# our-API check health page
@app.get("/health")
async def check_health():
    return {"message": "healthy"}


# get audio
@app.post("/post-audio")
async def post_audio(file: UploadFile = File(...)):

    # get saved audio (for dev only)
    # audio_input = open("posttoska_test.mp3", "rb")

    # save file from frontend
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())

    # open that frontend saved file
    audio_input = open(file.filename, "rb")

    # decode audio
    message_decoded = stt_convert(audio_input)

    # check for massage decoding
    if not message_decoded:
        raise HTTPException(status_code=400, detail="failed to decode audio to text")

    chat_response = await get_chat_response(message_decoded)

    # check if there is some response
    if not chat_response:
        raise HTTPException(status_code=400, detail="failed to get chat response")

    audio_output = el_tts(chat_response)

    # check if there is some voice response
    if not audio_output:
        raise HTTPException(status_code=400, detail="failed to get elevenlabs audio response")
    
    def iterfile():
        yield audio_output
    
    # get audio file 
    return StreamingResponse(audio_output, media_type="application/octet-stream")


# to get or create json file
def get_last_conversation():

    # create new json, if it is not created 
    if not os.path.exists(json_path):
        with open(json_path, "w") as f:
            json.dump([], f) 

    # read file
    with open(json_path, "r", encoding="utf-8") as json_data:
        data = json.load(json_data)

    return data

# store chat history and context window
chat_history = get_last_conversation()
context_window = 10

@app.post('/chat')
async def get_chat_response(prompt: str) -> str:

    try:

        chat_session = model.start_chat(
            # append chat history
            history = chat_history
        )

        # response from model
        chat_response = chat_session.send_message(prompt)

        # append user and model context 
        chat_history.append({"role": "user", "parts": [prompt]})
        chat_history.append({"role": "model", "parts": [chat_response.text]})

        # forget old elements
        if len(chat_history) > 2*context_window:
            chat_history[:] = chat_history[2:]

        # save last conversation
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(chat_history, f, ensure_ascii=False, indent=2)

        return chat_response.text

    except Exception as e:
        print(e)
        return f"error while chatting {e}"
    
@app.get("/delete_conversations")
def reset_messages():

    # clear chat history variable (globally)
    global chat_history
    chat_history = []

    # overwrite current file with nothing
    json_path = "stored_data.json"

    with open(json_path, "w") as f:
        json.dump([], f) 