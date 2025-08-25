FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Default command: run Gunicorn with Uvicorn worker
CMD ["gunicorn", "app.main:app", "--workers", "1", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--access-logfile", "-", "--access-logformat", "%(t)s %(h)s %(r)s %(s)s %(b)s %(L)ss %(u)s %(q)s", "--error-logfile", "-"]
