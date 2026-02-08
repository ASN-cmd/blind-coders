import os
import json
from flask import Blueprint, request, current_app, Response
from backend.utils.file_utils import allowed_file
from backend.services.pdf_pipeline import process_pdf
from backend.services.gap_analysis import analyze_all_chunks, format_gap_analysis_report

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload-pdf", methods=["POST"])
def upload_pdf():
    """
    Upload PDF and perform domain chunking + gap analysis.
    
    Query Parameters:
        - gap_analysis: Set to 'true' to enable gap analysis (default: false)
        - format: 'text' or 'json' (default: text)
    """
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

    # Process PDF
    try:
        domain_chunks = process_pdf(file_path)
    except Exception as e:
        return Response(
            f"ERROR: PDF processing failed\n{str(e)}",
            mimetype="text/plain",
            status=500
        )

    # Always perform gap analysis
    output_format = request.args.get("format", "text").lower()

    # Perform gap analysis
    try:
        gap_results = analyze_all_chunks(domain_chunks, use_semantic_search=True)
    except Exception as e:
        return Response(
            f"ERROR: Gap analysis failed\n{str(e)}",
            mimetype="text/plain",
            status=500
        )
    
    # Return results based on format
    if output_format == "json":
        response_data = {
            "domain_chunks": domain_chunks,
            "gap_analysis": gap_results
        }
        return Response(
            json.dumps(response_data, indent=2),
            mimetype="application/json",
            status=200
        )
    else:
        # Text format
        output_lines = []
        
        # Domain chunks summary
        output_lines.append("=" * 80)
        output_lines.append(f"DOMAIN CHUNKING SUMMARY")
        output_lines.append("=" * 80)
        output_lines.append(f"TOTAL DOMAIN CHUNKS: {len(domain_chunks)}")
        output_lines.append("")
        
        for domain, obj in domain_chunks.items():
            output_lines.append(f"==== {domain} ====")
            subdomains = obj.get("subdomains", [])
            if subdomains:
                output_lines.append("Subdomains:")
                for sd in subdomains:
                    output_lines.append(f"- {sd}")
            output_lines.append("\nText Preview:")
            output_lines.append(obj["text"][:500] + "..." if len(obj["text"]) > 500 else obj["text"])
            output_lines.append("")
        
        # Gap analysis report
        output_lines.append("\n\n")
        report = format_gap_analysis_report(gap_results)
        output_lines.append(report)
        
        return Response("\n".join(output_lines), mimetype="text/plain", status=200)
