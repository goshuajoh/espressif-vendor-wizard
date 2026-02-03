#!/usr/bin/env python3
"""
Langchao inSuite API - Customer Creation Test Script
Based on the provided documentation and demo files.
"""

import json
import time
import hashlib
import hmac
import requests

# =============================================================================
# CONFIGURATION
# =============================================================================

# API Credentials (provided by Langchao)
CLIENT_ID = "uJgCcz2rNYAQPIfRFR6JaMo5doYShnyR"
SECRET_KEY = "RoGUu7QpClCS8p8AwEhvtYoBqPleHXIQ"

# API Endpoint
BASE_URL_INTERNAL = "http://192.168.6.91:32000"
BASE_URL_EXTERNAL = "http://58.33.3.130:32000"
API_ROUTE = "/studio/api_special/insuite/mdm_customer/create1"

# Use external URL for testing
BASE_URL = BASE_URL_EXTERNAL


# =============================================================================
# SIGNATURE GENERATION
# =============================================================================

def get_msg_auth_code(api_route: str, secret_key: str, timestamp: int, json_str: str, method: str) -> str:
    """
    Generate the message authentication code (signature) for the API request.
    
    Algorithm:
    1. Create secret string: ts@{timestamp}|route@{api_route}|sec@{secret_key}|method@{method}
    2. SHA-512 hash the secret string to get a 64-byte MAC key
    3. HMAC-SHA256 the request body (JSON string) with the MAC key
    
    Args:
        api_route: The API endpoint path
        secret_key: The client secret provided by Langchao
        timestamp: Unix timestamp (10 digits)
        json_str: The JSON string to sign (the param array)
        method: HTTP method (lowercase, e.g., 'post')
    
    Returns:
        The hexadecimal signature string
    """
    # Step 1: Build the secret string
    secret = f"ts@{timestamp}|route@{api_route}|sec@{secret_key}|method@{method}"
    print(f"[DEBUG] Secret string: {secret}")
    
    # Step 2: Convert to bytes and generate SHA-512 hash as MAC key
    sec_bytes = secret.encode('utf-8')
    mac_key = hashlib.sha512(sec_bytes).digest()
    print(f"[DEBUG] MAC key (hex): {mac_key.hex()}")
    
    # Step 3: HMAC-SHA256 the JSON body with the MAC key
    body_bytes = json_str.encode('utf-8')
    msg_auth_code = hmac.new(mac_key, body_bytes, hashlib.sha256).hexdigest()
    print(f"[DEBUG] Signature: {msg_auth_code}")
    
    return msg_auth_code


# =============================================================================
# API REQUEST
# =============================================================================

def create_customer(customer_data: list, use_internal: bool = False) -> dict:
    """
    Create a customer record via the Langchao inSuite API.
    
    Args:
        customer_data: List of customer dictionaries to create
        use_internal: Whether to use internal network URL
    
    Returns:
        The API response as a dictionary
    """
    base_url = BASE_URL_INTERNAL if use_internal else BASE_URL_EXTERNAL
    url = f"{base_url}{API_ROUTE}"
    
    # Generate timestamp
    timestamp = int(time.time())
    print(f"\n[INFO] Timestamp: {timestamp}")
    print(f"[INFO] URL: {url}")
    
    # The param array as JSON string (for signing)
    # Note: separators=(',', ':') removes spaces for consistent signing
    param_json = json.dumps(customer_data, separators=(',', ':'), ensure_ascii=False)
    print(f"\n[DEBUG] Param JSON for signing:\n{param_json}")
    
    # Generate signature
    sign = get_msg_auth_code(
        api_route=API_ROUTE,
        secret_key=SECRET_KEY,
        timestamp=timestamp,
        json_str=param_json,
        method='post'
    )
    
    # Build the full request payload
    payload = {
        "params": {
            "timestamp": timestamp,
            "client_id": CLIENT_ID,
            "sign": sign,
            "param": customer_data
        }
    }
    
    print(f"\n[INFO] Full request payload:")
    print(json.dumps(payload, indent=2, ensure_ascii=False))
    
    # Make the request
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"\n[INFO] Sending POST request to {url}...")
    
    try:
        response = requests.post(
            url=url,
            data=json.dumps(payload, ensure_ascii=False),
            headers=headers,
            timeout=30
        )
        
        print(f"[INFO] Response status code: {response.status_code}")
        print(f"[INFO] Response headers: {dict(response.headers)}")
        
        # Try to parse JSON response
        try:
            result = response.json()
            print(f"\n[INFO] Response JSON:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            return result
        except json.JSONDecodeError:
            print(f"\n[WARN] Response is not JSON:")
            print(response.text)
            return {"raw_response": response.text, "status_code": response.status_code}
            
    except requests.exceptions.ConnectionError as e:
        print(f"\n[ERROR] Connection failed: {e}")
        return {"error": "connection_failed", "message": str(e)}
    except requests.exceptions.Timeout as e:
        print(f"\n[ERROR] Request timed out: {e}")
        return {"error": "timeout", "message": str(e)}
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}")
        return {"error": "unknown", "message": str(e)}


# =============================================================================
# TEST DATA
# =============================================================================

def get_test_customer_data() -> list:
    """
    Generate test customer data based on the API documentation.
    
    Required fields (from docs):
    - create_org_number: string (True) - 创建组织编号
    - name: string (True) - 名称
    - cust_group_number: string (True) - 客户分组编号（若值为空则传false）
    - country_name: string (True) - 国家/地区名称（若值为空则传false）
    - currency_name: string (True) - 结算币别名称（若值为空则传false）
    - sale_user_number: string (True) - 销售员编号（若值为空则传false）
    
    Optional fields:
    - number: string (False) - 编号
    - note: string (False) - 备注
    - inv_tax_number: string (False) - 纳税人识别号
    - x_char_* fields: Various contact and address fields
    """
    
    # Generate a unique identifier for testing
    test_id = int(time.time()) % 100000
    
    return [{
        # Required fields
        "create_org_number": "org_1001",
        "name": f"Espressif Test Customer {test_id}",
        "cust_group_number": "C102",
        "country_name": "中国",
        "currency_name": "人民币",
        "sale_user_number": "0005",
        
        # Optional fields
        "number": f"ESP_TEST_{test_id}",
        "note": "Test customer created via API",
        "inv_tax_number": "",
        
        # Contact information (custom fields)
        "x_char_t6itzytspg": "Joshua Test",           # 采购联系人
        "x_char_vitg7ywwao": "+86-21-12345678",       # 采购联系人电话
        "x_char_9eqgn6f0dv": "+86-21-87654321",       # 固定联系电话
        "x_char_0gmeycjxmg": "test@espressif.com",    # 采购联系人邮箱
        "x_char_hjjshmrsdx": "Warehouse Contact",     # 收货联系人
        "x_char_9pex08hr7a": "+86-21-11111111",       # 收货人电话
        "x_char_x7wfy6v7rs": "Shanghai, China",       # 收货地址
        "x_text_muniskyxgu": "Shanghai Test Address", # 法定注册地址
        "x_char_ayuwxr8kn8": "invoice@espressif.com", # 发票接收邮箱
        "x_char_f15xqcasni": "",                      # PCN 特殊要求
        "x_char_xy0fi6varj": "pcn@espressif.com",     # PCN 接收邮箱
    }]


# =============================================================================
# MAIN
# =============================================================================

def generate_curl_command(customer_data: list, use_internal: bool = False) -> str:
    """
    Generate a curl command for manual testing.
    """
    base_url = BASE_URL_INTERNAL if use_internal else BASE_URL_EXTERNAL
    url = f"{base_url}{API_ROUTE}"
    timestamp = int(time.time())
    
    param_json = json.dumps(customer_data, separators=(',', ':'), ensure_ascii=False)
    sign = get_msg_auth_code(API_ROUTE, SECRET_KEY, timestamp, param_json, 'post')
    
    payload = {
        "params": {
            "timestamp": timestamp,
            "client_id": CLIENT_ID,
            "sign": sign,
            "param": customer_data
        }
    }
    
    payload_str = json.dumps(payload, ensure_ascii=False)
    
    curl_cmd = f'''curl -X POST "{url}" \\
  -H "Content-Type: application/json" \\
  -d '{payload_str}' '''
    
    return curl_cmd


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Langchao inSuite API - Customer Creation Test')
    parser.add_argument('--internal', action='store_true', help='Use internal network URL')
    parser.add_argument('--curl-only', action='store_true', help='Only generate curl command, do not send request')
    parser.add_argument('--minimal', action='store_true', help='Use minimal required fields only')
    args = parser.parse_args()
    
    print("=" * 70)
    print("Langchao inSuite API - Customer Creation Test")
    print("=" * 70)
    
    # Get test data
    if args.minimal:
        test_id = int(time.time()) % 100000
        customer_data = [{
            "create_org_number": "org_1001",
            "name": f"Test Customer {test_id}",
            "cust_group_number": "C102",
            "country_name": "中国",
            "currency_name": "人民币",
            "sale_user_number": "0005",
        }]
    else:
        customer_data = get_test_customer_data()
    
    print("\n[INFO] Test customer data:")
    print(json.dumps(customer_data, indent=2, ensure_ascii=False))
    
    if args.curl_only:
        print("\n" + "=" * 70)
        print("CURL COMMAND (copy and run this):")
        print("=" * 70)
        print(generate_curl_command(customer_data, use_internal=args.internal))
    else:
        # Make the API call
        result = create_customer(customer_data, use_internal=args.internal)
    
    print("\n" + "=" * 70)
    print("TEST COMPLETE")
    print("=" * 70)