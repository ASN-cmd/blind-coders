"""
Test script to verify gap analysis functionality without running the Flask server.
This simulates what happens when the /api/upload-pdf endpoint is called.
"""
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.services.pdf_pipeline import process_pdf
from backend.services.gap_analysis import analyze_all_chunks, format_gap_analysis_report


def test_gap_analysis(pdf_path: str):
    """
    Test the complete gap analysis pipeline.
    
    Args:
        pdf_path: Path to the PDF file to analyze
    """
    print("=" * 80)
    print("TESTING GAP ANALYSIS PIPELINE")
    print("=" * 80)
    print(f"\nProcessing: {pdf_path}")
    print("\n" + "-" * 80)
    
    # Step 1: Process PDF (OCR + Domain Chunking)
    print("\n[STEP 1] Processing PDF...")
    try:
        domain_chunks = process_pdf(pdf_path)
        print(f"✅ Found {len(domain_chunks)} domain chunks")
        
        for domain, obj in domain_chunks.items():
            print(f"\n  Domain: {domain}")
            print(f"  Subdomains: {', '.join(obj.get('subdomains', []))}")
            print(f"  Text length: {len(obj.get('text', ''))} characters")
    except Exception as e:
        print(f"❌ PDF processing failed: {e}")
        return
    
    # Step 2: Perform Gap Analysis
    print("\n" + "-" * 80)
    print("\n[STEP 2] Performing Gap Analysis...")
    print("(This may take a few minutes as the LLM processes each chunk...)")
    
    try:
        gap_results = analyze_all_chunks(domain_chunks, use_semantic_search=True)
        print(f"✅ Gap analysis completed for {len(gap_results)} domains")
    except Exception as e:
        print(f"❌ Gap analysis failed: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Step 3: Format Report
    print("\n" + "-" * 80)
    print("\n[STEP 3] Generating Report...")
    
    try:
        report = format_gap_analysis_report(gap_results)
        print("✅ Report generated successfully")
        
        # Save to file
        output_dir = Path(__file__).resolve().parents[1] / "backend" / "output"
        output_dir.mkdir(parents=True, exist_ok=True)
        
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = output_dir / f"gap_analysis_{timestamp}.txt"
        
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(report)
        
        print(f"\n📄 Report saved to: {output_file}")
        
        # Print summary
        print("\n" + "=" * 80)
        print("SUMMARY")
        print("=" * 80)
        
        for domain, analysis in gap_results.items():
            print(f"\n{domain}:")
            
            # Handle multiple subdomains
            if "subdomains_analysis" in analysis:
                for sub_analysis in analysis["subdomains_analysis"]:
                    subdomain = sub_analysis.get("subdomain", "N/A")
                    gaps = sub_analysis.get("gap_analysis", [])
                    nist_count = sub_analysis.get("nist_records_count", 0)
                    print(f"  - {subdomain}: {len(gaps)} gaps, {nist_count} NIST records")
            else:
                subdomain = analysis.get("subdomain", "N/A")
                gaps = analysis.get("gap_analysis", [])
                nist_count = analysis.get("nist_records_count", 0)
                print(f"  - {subdomain}: {len(gaps)} gaps, {nist_count} NIST records")
        
        print("\n" + "=" * 80)
        print("✅ TEST COMPLETED SUCCESSFULLY")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Report generation failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Example: test with a PDF file
    # You can modify this path to test with your own PDF
    
    base_dir = Path(__file__).resolve().parents[1]
    
    # Option 1: Use the PS_1_AS.pdf in the root directory
    test_pdf = base_dir / "policies/policy1.pdf"
    
    # Option 2: Use a PDF from the policies folder
    # test_pdf = base_dir / "policies" / "your-policy.pdf"
    
    if not test_pdf.exists():
        print(f"❌ PDF file not found: {test_pdf}")
        print("\nPlease update the pdf_path in this script to point to a valid PDF file.")
        sys.exit(1)
    
    test_gap_analysis(str(test_pdf))
