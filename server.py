#!/usr/bin/env python3
import http.server
import ssl
import socketserver
import os

# Configuration
PORT = 8000
BIND_ADDRESS = '0.0.0.0'

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers if needed
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

# Create server
with socketserver.TCPServer((BIND_ADDRESS, PORT), MyHTTPRequestHandler) as httpd:
    # Create SSL context
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    
    # Load certificate and key
    try:
        context.load_cert_chain('cert.pem', 'key.pem')
    except FileNotFoundError:
        print("❌ Certificate files not found!")
        print("Please run this command first to generate certificates:")
        print("openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes")
        exit(1)
    
    # Wrap socket with SSL
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    
    print(f"🔒 HTTPS Server running on https://{BIND_ADDRESS}:{PORT}")
    print(f"📱 Access from Android: https://YOUR_PC_IP:{PORT}")
    print("⚠️  You'll need to accept the self-signed certificate warning")
    print("Press Ctrl+C to stop")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
        httpd.shutdown()