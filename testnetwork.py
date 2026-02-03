#!/usr/bin/env python3
"""
Network Diagnostic Script for Langchao API
Run this to check connectivity issues.
"""

import socket
import subprocess
import sys

# Endpoints to test
EXTERNAL_HOST = "58.33.3.130"
EXTERNAL_PORT = 32000
INTERNAL_HOST = "192.168.6.91"
INTERNAL_PORT = 32000

def check_port(host, port, timeout=5):
    """Check if a port is reachable."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except socket.error as e:
        return False

def ping_host(host):
    """Try to ping a host."""
    try:
        # Different ping command for different OS
        param = '-n' if sys.platform.lower() == 'win32' else '-c'
        command = ['ping', param, '3', host]
        result = subprocess.run(command, capture_output=True, text=True, timeout=15)
        return result.returncode == 0, result.stdout
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 60)
    print("Langchao API Network Diagnostic")
    print("=" * 60)
    
    # Test 1: Check external endpoint
    print(f"\n[1] Testing EXTERNAL endpoint: {EXTERNAL_HOST}:{EXTERNAL_PORT}")
    print("-" * 40)
    
    # Ping test
    print(f"    Ping {EXTERNAL_HOST}...", end=" ")
    ping_ok, ping_output = ping_host(EXTERNAL_HOST)
    if ping_ok:
        print("✓ SUCCESS")
    else:
        print("✗ FAILED (host unreachable or ICMP blocked)")
    
    # Port test
    print(f"    TCP connect to port {EXTERNAL_PORT}...", end=" ")
    if check_port(EXTERNAL_HOST, EXTERNAL_PORT):
        print("✓ SUCCESS")
    else:
        print("✗ FAILED (port unreachable)")
    
    # Test 2: Check internal endpoint (if on VPN)
    print(f"\n[2] Testing INTERNAL endpoint: {INTERNAL_HOST}:{INTERNAL_PORT}")
    print("-" * 40)
    
    print(f"    Ping {INTERNAL_HOST}...", end=" ")
    ping_ok, ping_output = ping_host(INTERNAL_HOST)
    if ping_ok:
        print("✓ SUCCESS")
    else:
        print("✗ FAILED (are you on VPN?)")
    
    print(f"    TCP connect to port {INTERNAL_PORT}...", end=" ")
    if check_port(INTERNAL_HOST, INTERNAL_PORT):
        print("✓ SUCCESS")
    else:
        print("✗ FAILED (port unreachable)")
    
    # Summary
    print("\n" + "=" * 60)
    print("DIAGNOSIS")
    print("=" * 60)
    
    ext_ok = check_port(EXTERNAL_HOST, EXTERNAL_PORT)
    int_ok = check_port(INTERNAL_HOST, INTERNAL_PORT)
    
    if ext_ok:
        print("✓ External API is reachable. Use --external flag.")
    elif int_ok:
        print("✓ Internal API is reachable. Use --internal flag.")
        print(f"  Command: python langchaotest.py --internal")
    else:
        print("✗ Neither endpoint is reachable.")
        print("\n  Possible solutions:")
        print("  1. Connect to company VPN (GlobalProtect, etc.)")
        print("  2. Run the test from a machine in Shanghai office")
        print("  3. Ask Langchao IT to whitelist your IP address")
        print("  4. Check if there's a different endpoint URL")
    
    print()

if __name__ == "__main__":
    main()