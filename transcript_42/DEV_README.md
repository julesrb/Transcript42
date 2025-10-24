# Development Setup with Hot Reload

This setup provides Vite-like hot reload functionality for the 42 Academic Transcript Generator.

## Quick Start

1. **Set up the development environment:**
   ```bash
   make dev-setup
   ```

2. **Start the development server with hot reload:**
   ```bash
   make dev
   ```

3. **Open your browser to:**
   ```
   http://localhost:8000
   ```

## What You Get

- **Hot Reload**: Any changes to Python files in the `app/` directory will automatically restart the server
- **Live Logging**: See logs in real-time in the terminal
- **Development Paths**: Files are saved to `./data/` instead of `/app/output/`
- **Easy Configuration**: Uses `dev_config.py` for development settings

## Development Commands

- `make dev-setup` - Set up virtual environment and install dependencies
- `make dev` - Start development server with hot reload
- `make dev-install` - Install/update development dependencies

## Configuration

Edit `dev_config.py` to set your 42 API credentials and other development settings.

## File Structure

```
transcript_42/
├── app/                    # Main application code
├── data/                   # Development output directory
├── dev.py                  # Development server script
├── dev_config.py          # Development configuration
├── requirements-dev.txt   # Development dependencies
└── .venv/                 # Virtual environment (created by dev-setup)
```

## Hot Reload Features

- Automatically detects changes in Python files
- Restarts server on file changes
- Preserves application state where possible
- Fast restart times (typically < 1 second)

The development server uses `uvicorn` with the `--reload` flag and `watchfiles` for efficient file watching.

