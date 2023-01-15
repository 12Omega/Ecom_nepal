@echo off
REM VulnShop SSL Certificate Generation Script for Windows
REM Creates intentionally weak SSL certificates for educational purposes

echo 🔐 Generating SSL certificates for VulnShop...

REM Create SSL directory
if not exist "nginx\ssl" mkdir nginx\ssl

REM Check if OpenSSL is available
where openssl >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ OpenSSL not found in PATH
    echo Please install OpenSSL or use the Docker setup instead
    echo Download from: https://slproweb.com/products/Win32OpenSSL.html
    pause
    exit /b 1
)

REM Generate weak private key (vulnerability - small key size)
echo Generating weak private key (1024-bit RSA)...
openssl genrsa -out nginx/ssl/server.key 1024

REM Generate weak DH parameters (vulnerability)
echo Generating weak DH parameters (1024-bit)...
openssl dhparam -out nginx/ssl/dhparam.pem 1024

REM Create certificate signing request configuration
echo Creating certificate configuration...
(
echo [req]
echo distinguished_name = req_distinguished_name
echo req_extensions = v3_req
echo prompt = no
echo.
echo [req_distinguished_name]
echo C = US
echo ST = Vulnerable
echo L = Insecure City
echo O = VulnShop Training
echo OU = Security Department
echo CN = localhost
echo.
echo [v3_req]
echo keyUsage = keyEncipherment, dataEncipherment
echo extendedKeyUsage = serverAuth
echo subjectAltName = @alt_names
echo.
echo [alt_names]
echo DNS.1 = localhost
echo DNS.2 = vulnshop.local
echo DNS.3 = *.vulnshop.local
echo IP.1 = 127.0.0.1
echo IP.2 = 0.0.0.0
) > nginx\ssl\server.conf

REM Generate self-signed certificate with weak settings (vulnerability)
echo Generating self-signed certificate (valid for 10 years - vulnerability)...
openssl req -new -x509 -key nginx/ssl/server.key -out nginx/ssl/server.crt -days 3650 -config nginx/ssl/server.conf -extensions v3_req

echo ✅ SSL certificates generated successfully!
echo.
echo ⚠️  WARNING: These certificates are intentionally insecure:
echo    - 1024-bit RSA key (weak)
echo    - Weak DH parameters
echo    - Self-signed (no CA validation)
echo    - Long validity period
echo.
echo 📁 Certificate files created:
echo    - nginx\ssl\server.key (Private key)
echo    - nginx\ssl\server.crt (Certificate)
echo    - nginx\ssl\dhparam.pem (DH parameters)
echo.
echo 🔧 To use with Docker:
echo    docker-compose up --build
echo.
echo 🌐 Access the application:
echo    HTTP:  http://localhost
echo    HTTPS: https://localhost (ignore certificate warnings)
echo.
pause