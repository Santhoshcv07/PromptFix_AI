from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

class PromptResponse(BaseModel):
    improved_prompt: str

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

@app.post("/api/improve", response_model=PromptResponse)
async def improve_prompt(request: PromptRequest):
    if not os.environ.get("GROQ_API_KEY"):
        raise HTTPException(status_code=500, detail="GROQ_API_KEY environment variable not set")
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a prompt engineering expert. Your task is to transform ordinary user prompts into powerful, detailed, and optimized AI prompts. Improve clarity, add context, structure it well, and ensure it gets better results from language models. Do not answer the prompt, only improve it. Keep the output as just the improved prompt."
                },
                {
                    "role": "user",
                    "content": request.prompt
                }
            ],
            model="llama-3.1-8b-instant", # Using a supported model
            temperature=0.7,
            max_tokens=1024,
        )
        
        improved = chat_completion.choices[0].message.content.strip()
        return PromptResponse(improved_prompt=improved)
        
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        raise HTTPException(status_code=500, detail="Failed to improve prompt")

@app.get("/")
def read_root():
    return {"message": "PromptFix AI Backend is running"}
