import os
from flask import Blueprint, request, jsonify, current_app
from utils.file_utils import allowed_file

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload-pdf", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)

    return jsonify({
        "message": "PDF uploaded successfully",
        "filename": file.filename
    }), 200
