import os
from flask import Blueprint, request, current_app, Response
from backend.utils.file_utils import allowed_file
from backend.services.pdf_pipeline import process_pdf

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload-pdf", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return Response("ERROR: No file part", mimetype="text/plain", status=400)

    file = request.files["file"]

    if file.filename == "":
        return Response("ERROR: No selected file", mimetype="text/plain", status=400)

    if not allowed_file(file.filename):
        return Response("ERROR: Only PDF files are allowed", mimetype="text/plain", status=400)

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)

    try:
        domain_chunks = process_pdf(file_path)
    except Exception as e:
        return Response(
            f"ERROR: PDF processing failed\n{str(e)}",
            mimetype="text/plain",
            status=500
        )

    # 🔹 Build TEXT output (same as print)
    output_lines = []
    output_lines.append(f"TOTAL DOMAIN CHUNKS: {len(domain_chunks)}")

    for domain, obj in domain_chunks.items():
        output_lines.append(f"==== {domain} ====")

        # Optional: show subdomains
        subdomains = obj.get("subdomains", [])
        if subdomains:
            output_lines.append("Subdomains:")
            for sd in subdomains:
                output_lines.append(f"- {sd}")

        output_lines.append("\nText:")
        output_lines.append(obj["text"][:800])  # slice the STRING

    final_text = "\n".join(output_lines)

    return Response(final_text, mimetype="text/plain", status=200)
