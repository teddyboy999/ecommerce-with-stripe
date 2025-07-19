import os
from groq import Groq
from dotenv import load_dotenv

# Access environment variables
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

client = Groq()
completion = client.chat.completions.create(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    messages=[
      {
        "role": "system",
        "content": "You are a helpful AI Assistant who helps users find information."
      },
      {
        "role": "user",
        "content": "Are you okay?"
      }
    ],
    temperature=1,
    max_completion_tokens=8192,
    top_p=1,
    stream=True,
    stop=None,
)

for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="")
