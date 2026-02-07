from ctransformers import AutoModelForCausalLM

llm = AutoModelForCausalLM.from_pretrained(
    "./models",
    model_file="Mistral-7B-Instruct-v0.3-Q5_K_M.gguf",
    model_type="mistral"
)

print(llm("What is NIST?"))
