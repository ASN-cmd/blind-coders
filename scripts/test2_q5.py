from llama_cpp import Llama

llm = Llama(
    model_path="./models/Mistral-7B-Instruct-v0.3-Q5_K_M.gguf",
    n_ctx=2048,
    n_threads=8,      # adjust to your CPU cores
    n_gpu_layers=0,   # set >0 only if you have CUDA build
    verbose=False
)

response = llm(
    "What is UNESCO?",
    max_tokens=128,
    temperature=0.7,
    stop=["</s>"]
)

print(response["choices"][0]["text"].strip())

