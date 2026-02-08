import json
import re
from backend.config.prompts import GAP_ANALYSIS_PROMPT
from backend.llm.mistral_client import call_llm
from backend.services.nist_retrieval import (
    fetch_related_nist_records,
    fetch_similar_nist_records,
    format_nist_chunks_for_prompt
)


def extract_json(text: str):
    """Extract JSON from LLM response."""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return None


def analyze_gap_for_chunk(domain: str, subdomain: str, policy_text: str, use_semantic_search: bool = True):
    """
    Analyze gap between organization policy and NIST requirements for a single chunk.
    
    Args:
        domain: The domain name (e.g., "ISMS")
        subdomain: The subdomain name (e.g., "Information Security Policy")
        policy_text: The organization's policy text
        use_semantic_search: If True, use semantic search; otherwise use exact subdomain match
        
    Returns:
        Dictionary containing gap analysis results
    """
    # Step 1: Retrieve related NIST records
    if use_semantic_search:
        # Use semantic search for better matching
        nist_records = fetch_similar_nist_records(policy_text, subdomain=subdomain, top_k=10)
    else:
        # Use exact subdomain match
        nist_records = fetch_related_nist_records(subdomain=subdomain, top_k=10)
    
    # Step 2: Format NIST chunks for prompt
    formatted_nist_chunks = format_nist_chunks_for_prompt(nist_records)
    
    # Step 3: Build prompt
    prompt = GAP_ANALYSIS_PROMPT.format(
        domain=domain,
        subdomain=subdomain,
        organization_policy=policy_text,
        nist_chunks=formatted_nist_chunks
    )
    
    # Step 4: Call LLM
    response = call_llm(prompt)
    
    # Step 5: Parse JSON response
    gap_analysis = extract_json(response)
    
    if not gap_analysis:
        # Fallback if JSON extraction fails
        return {
            "domain": domain,
            "subdomain": subdomain,
            "error": "Failed to parse LLM response",
            "raw_response": response,
            "nist_records_count": len(nist_records)
        }
    
    # Add metadata
    gap_analysis["nist_records_count"] = len(nist_records)
    gap_analysis["nist_records_retrieved"] = [
        {
            "id": r.get("id"),
            "source": r.get("metadata", {}).get("source_file"),
            "similarity": r.get("similarity")
        }
        for r in nist_records[:5]  # Include top 5 for reference
    ]
    
    return gap_analysis


def analyze_all_chunks(domain_chunks: dict, use_semantic_search: bool = True):
    """
    Analyze gaps for all domain chunks.
    
    Args:
        domain_chunks: Dictionary of domain chunks from pdf_pipeline
        use_semantic_search: Whether to use semantic search or exact match
        
    Returns:
        Dictionary with gap analysis for each domain
    """
    results = {}
    
    for domain, obj in domain_chunks.items():
        text = obj.get("text", "")
        subdomains = obj.get("subdomains", [])
        
        if not text.strip():
            continue
        
        # Analyze each subdomain separately if multiple exist
        if len(subdomains) > 1:
            # Multiple subdomains: analyze for each
            results[domain] = {
                "subdomains_analysis": []
            }
            
            for subdomain in subdomains:
                analysis = analyze_gap_for_chunk(
                    domain=domain,
                    subdomain=subdomain,
                    policy_text=text,
                    use_semantic_search=use_semantic_search
                )
                results[domain]["subdomains_analysis"].append(analysis)
        
        elif len(subdomains) == 1:
            # Single subdomain: direct analysis
            subdomain = subdomains[0]
            analysis = analyze_gap_for_chunk(
                domain=domain,
                subdomain=subdomain,
                policy_text=text,
                use_semantic_search=use_semantic_search
            )
            results[domain] = analysis
        
        else:
            # No subdomain specified: use domain as subdomain
            analysis = analyze_gap_for_chunk(
                domain=domain,
                subdomain=domain,
                policy_text=text,
                use_semantic_search=use_semantic_search
            )
            results[domain] = analysis
    
    return results


def format_gap_analysis_report(gap_analysis_results: dict) -> str:
    """
    Format gap analysis results into a human-readable report.
    
    Args:
        gap_analysis_results: Dictionary of gap analysis results
        
    Returns:
        Formatted text report
    """
    lines = []
    lines.append("=" * 80)
    lines.append("NIST COMPLIANCE GAP ANALYSIS REPORT")
    lines.append("=" * 80)
    lines.append("")
    
    for domain, analysis in gap_analysis_results.items():
        lines.append(f"\n{'=' * 80}")
        lines.append(f"DOMAIN: {domain}")
        lines.append("=" * 80)
        
        # Handle multiple subdomains
        if "subdomains_analysis" in analysis:
            for sub_analysis in analysis["subdomains_analysis"]:
                lines.extend(_format_single_analysis(sub_analysis))
        else:
            lines.extend(_format_single_analysis(analysis))
    
    lines.append("\n" + "=" * 80)
    lines.append("END OF REPORT")
    lines.append("=" * 80)
    
    return "\n".join(lines)


def _format_single_analysis(analysis: dict) -> list:
    """Helper to format a single subdomain analysis."""
    lines = []
    
    subdomain = analysis.get("subdomain", "N/A")
    lines.append(f"\nSubdomain: {subdomain}")
    lines.append("-" * 80)
    
    # Error handling
    if "error" in analysis:
        lines.append(f"ERROR: {analysis['error']}")
        return lines
    
    # Gap Analysis
    gaps = analysis.get("gap_analysis", [])
    if gaps:
        lines.append(f"\nGAP ANALYSIS ({len(gaps)} gaps identified):")
        for gap in gaps:
            lines.append(f"\n  [{gap.get('gap_id', 'N/A')}] {gap.get('description', '')}")
            lines.append(f"  NIST Reference: {gap.get('nist_reference', 'N/A')}")
            lines.append(f"  Severity: {gap.get('severity', 'N/A')}")
            lines.append(f"  Impact: {gap.get('impact', 'N/A')}")
    else:
        lines.append("\nNo gaps identified.")
    
    # Revised Policy
    revised = analysis.get("revised_policy", {})
    if revised:
        lines.append(f"\nREVISED POLICY:")
        lines.append(f"  {revised.get('introduction', '')}")
        statements = revised.get("statements", [])
        if statements:
            lines.append("\n  Policy Statements:")
            for i, stmt in enumerate(statements, 1):
                lines.append(f"    {i}. {stmt}")
    
    # Implementation Roadmap
    roadmap = analysis.get("implementation_roadmap", {})
    if roadmap:
        lines.append(f"\nIMPLEMENTATION ROADMAP:")
        
        for phase, actions in [("SHORT-TERM (0-3 months)", roadmap.get("short_term", [])),
                                ("MID-TERM (3-6 months)", roadmap.get("mid_term", [])),
                                ("LONG-TERM (6-12 months)", roadmap.get("long_term", []))]:
            if actions:
                lines.append(f"\n  {phase}:")
                for action in actions:
                    lines.append(f"    • {action.get('action', '')}")
                    lines.append(f"      Priority: {action.get('priority', 'N/A')} | Timeline: {action.get('timeline', 'N/A')}")
    
    lines.append("")
    return lines
