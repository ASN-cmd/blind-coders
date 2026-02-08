from ctransformers import AutoModelForCausalLM
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = PROJECT_ROOT / "models" / "Mistral-7B-Instruct-v0.3-Q5_K_M.gguf"

llm = AutoModelForCausalLM.from_pretrained(
    str(MODEL_PATH),
    model_type="mistral",
    max_new_tokens=512,
    context_length=2048,
    temperature=0.2,
    local_files_only=True
)

def call_llm(prompt: str) -> str:
    return llm(prompt).strip()
