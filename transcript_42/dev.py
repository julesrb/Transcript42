#!/usr/bin/env python3
"""
Development server with hot reload for the 42 Academic Transcript Generator.
This provides Vite-like hot reload functionality for development.
"""

import os
import sys
import uvicorn
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))

if __name__ == "__main__":
    # Set up environment variables for development
    os.environ.setdefault("ENVIRONMENT", "development")
    
    # Create output directory if it doesn't exist
    output_dir = Path("data")
    output_dir.mkdir(exist_ok=True)
    
    # Run the development server with hot reload
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=[str(app_dir)],
        log_level="info",
        access_log=True
    )

