#!/bin/bash
set -e

DOMAIN="transcript42.project-cloud.cloud"
GUNICORN_PORT=8000

echo "Updating packages and installing nginx, certbot..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

echo "Creating Nginx config for $DOMAIN..."

sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other requests to HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:$GUNICORN_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo "Enabling Nginx config and creating webroot for certbot..."
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo mkdir -p /var/www/certbot

echo "Testing Nginx configuration..."
sudo nginx -t

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Obtaining SSL certificate with Certbot..."
sudo certbot certonly --webroot -w /var/www/certbot -d $DOMAIN --non-interactive --agree-tos -m your-email@example.com

echo "Reloading Nginx to apply SSL cert..."
sudo systemctl reload nginx

echo "Setup complete."
echo "Make sure your Gunicorn app is running and listening on 127.0.0.1:$GUNICORN_PORT"