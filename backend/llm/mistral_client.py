from ctransformers import AutoModelForCausalLM

# Load once (global)
llm = AutoModelForCausalLM.from_pretrained(
    "models/Mistral-7B-Instruct-v0.3-Q5_K_M.gguf",
    model_type="mistral",
    max_new_tokens=512,
    context_length=2048,
    temperature=0.2
)

def call_llm(prompt: str) -> str:
    response = llm(prompt)
    return response.strip()
