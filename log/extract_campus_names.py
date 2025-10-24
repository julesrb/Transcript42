#!/usr/bin/env python3
"""
Script to extract campus names from all JSON files in the log directory.
Returns a JSON with filename as key and list of campus names as value.
"""

import json
import os
import glob
from pathlib import Path

def extract_campus_names_from_file(file_path):
    """Extract campus names from a single JSON file. Returns only the last campus name if multiple exist."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        campus_names = []
        if 'campus' in data and isinstance(data['campus'], list):
            for campus in data['campus']:
                if isinstance(campus, dict) and 'name' in campus:
                    campus_names.append(campus['name'])
        
        # Return only the last campus name if multiple exist
        return [campus_names[-1]] if campus_names else []
    except (json.JSONDecodeError, FileNotFoundError, KeyError) as e:
        print(f"Error processing {file_path}: {e}")
        return []

def main():
    # Get the directory containing this script
    script_dir = Path(__file__).parent
    log_dir = script_dir
    
    # Find all JSON files
    json_files = glob.glob(str(log_dir / "*.json"))
    
    if not json_files:
        print("No JSON files found in the directory")
        return
    
    print(f"Found {len(json_files)} JSON files to process")
    
    # Process each file
    result = {}
    campus_counts = {}
    
    for json_file in sorted(json_files):
        filename = os.path.basename(json_file)
        campus_names = extract_campus_names_from_file(json_file)
        result[filename] = campus_names
        
        # Count campus occurrences for summary
        for campus_name in campus_names:
            campus_counts[campus_name] = campus_counts.get(campus_name, 0) + 1
        
        print(f"Processed {filename}: {campus_names}")
    
    # Write the result to a new JSON file
    output_file = log_dir / "campus_names_by_file.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    # Write the summary to a separate file
    summary_file = log_dir / "campus_summary.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(campus_counts, f, indent=2, ensure_ascii=False)
    
    print(f"\nResults written to {output_file}")
    print(f"Summary written to {summary_file}")
    print(f"Total files processed: {len(result)}")
    
    # Print the result to console
    print("\nFinal JSON output (last campus only):")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    # Print the summary
    print("\nCampus summary (counts):")
    print(json.dumps(campus_counts, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
