#!/bin/bash

# VulnShop SSL Certificate Generation Script
# Creates intentionally weak SSL certificates for educational purposes

echo "🔐 Generating SSL certificates for VulnShop..."

# Create SSL directory
mkdir -p nginx/ssl

# Generate weak private key (vulnerability - small key size)
echo "Generating weak private key (1024-bit RSA)..."
openssl genrsa -out nginx/ssl/server.key 1024

# Generate weak DH parameters (vulnerability)
echo "Generating weak DH parameters (1024-bit)..."
openssl dhparam -out nginx/ssl/dhparam.pem 1024

# Create certificate signing request with weak configuration
echo "Creating certificate signing request..."
cat > nginx/ssl/server.conf << EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = Vulnerable
L = Insecure City
O = VulnShop Training
OU = Security Department
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = vulnshop.local
DNS.3 = *.vulnshop.local
IP.1 = 127.0.0.1
IP.2 = 0.0.0.0
EOF

# Generate self-signed certificate with weak settings (vulnerability)
echo "Generating self-signed certificate (valid for 10 years - vulnerability)..."
openssl req -new -x509 -key nginx/ssl/server.key -out nginx/ssl/server.crt -days 3650 -config nginx/ssl/server.conf -extensions v3_req

# Set weak permissions (vulnerability)
chmod 644 nginx/ssl/server.key
chmod 644 nginx/ssl/server.crt
chmod 644 nginx/ssl/dhparam.pem

echo "✅ SSL certificates generated successfully!"
echo ""
echo "⚠️  WARNING: These certificates are intentionally insecure:"
echo "   - 1024-bit RSA key (weak)"
echo "   - Weak DH parameters"
echo "   - Self-signed (no CA validation)"
echo "   - Overly permissive file permissions"
echo "   - Long validity period"
echo ""
echo "📁 Certificate files created:"
echo "   - nginx/ssl/server.key (Private key)"
echo "   - nginx/ssl/server.crt (Certificate)"
echo "   - nginx/ssl/dhparam.pem (DH parameters)"
echo ""
echo "🔧 To use with Docker:"
echo "   docker-compose up --build"
echo ""
echo "🌐 Access the application:"
echo "   HTTP:  http://localhost"
echo "   HTTPS: https://localhost (ignore certificate warnings)"