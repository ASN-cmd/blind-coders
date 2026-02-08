# test_q5.py
from llama_cpp import Llama

model = Llama(
    model_path="../models/Mistral-7B-Instruct-v0.3-Q5_K_M.gguf",
    n_ctx=2048,
    n_threads=4
)

response = model("What is NIST?", max_tokens=50)
print(response['choices'][0]['text'])