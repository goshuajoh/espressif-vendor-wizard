#!/usr/bin/env python3
"""
Langchao inSuite API - Customer Creation Test Script (V2)
Updated with correct field mappings from documentation.
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

# Database name - provided by Langchao
DATABASE_NAME = "shlxkjgfyxgs"  # 上海乐鑫科技有限公司

# API Endpoint
BASE_URL_INTERNAL = "http://192.168.6.91:32000"
BASE_URL_EXTERNAL = "http://58.33.3.130:32000"
API_ROUTE = "/studio/api_special/insuite/mdm_customer/create1"

# Use external URL for testing
BASE_URL = BASE_URL_EXTERNAL


# =============================================================================
# FIELD MAPPING REFERENCE (Chinese -> API Field Name)
# =============================================================================
"""
字段名                  API字段名
--------------------   ------------------------
编号                    number
名称                    name
客户分组                cust_group_id
SAP原客户代码           x_char_cay5jmarrr
所有者                  sale_user_id
外文名称                x_char_gzcp4gjmhi
别名                    x_char_kg0wwz9xv7
创建组织                create_org_id
使用组织                use_org_id
内部组织                internal_org_id
对应供应商              supplier_id
科目余额                x_float_tbtkxzkblx
交货                    x_float_s9iykgnts9
订单                    x_float_vuow9bd5j8
备注                    note
国家/地区               country_id
PCN 特殊要求            x_char_f15xqcasni
PCN 接收邮箱            x_char_xy0fi6varj
是否参与交期计算        x_selection_ykh5dwo6fd
财务邮箱                x_char_5smvg51jqa
指定厂商                x_many2one_eycmxxaldx
发票接收邮箱            x_char_ayuwxr8kn8
纳税人识别号            inv_tax_number
采购邮箱                x_char_0qgsyzxr8t
发货特殊要求            x_char_zroglhprb4
开票特殊要求            x_char_09sjzp5eae
风险提示                x_char_mfgjqyo2ah
不可用备注              x_char_nkasruoowt
采购联系人              x_char_t6itzytspg
采购联系人电话          x_char_vitg7ywwao
固定联系电话            x_char_9eqgn6f0dv
收货联系人              x_char_hjjshmrsdx
收货人电话              x_char_9pex08hr7a
收货地址                x_char_x7wfy6v7rs
法定注册地址            x_text_muniskyxgu
结算币别                currency_id
结算方式                pay_type_id
收款条件                receivable_term_id
结算方                  pay_party_id
收货方                  receive_id
销售部门                sale_dep_id
付款方                  receive_party_id
价目表                  price_list
交货方式                delivery_id
信用额度                x_float_noyptjqjqv
付款日期                x_date_tmclhk5hqx
对账日                  x_date_m5i3bpsrww
对账周期                x_date_meluk6hgra
控制科目                x_many2one_sc4u7xibxo
应收账款                x_float_hkoamhw0em
发票抬头                inv_title
开户银行                inv_bank_name
开户行账号              inv_bank_acct
开票联系电话            inv_telephone
纳税人身份              tax_ident
开票通讯地址            inv_address
"""


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
    """
    base_url = BASE_URL_INTERNAL if use_internal else BASE_URL_EXTERNAL
    url = f"{base_url}{API_ROUTE}"
    
    # Generate timestamp
    timestamp = int(time.time())
    print(f"\n[INFO] Timestamp: {timestamp}")
    print(f"[INFO] URL: {url}")
    
    # The param array as JSON string (for signing)
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
        "Content-Type": "application/json",
        "X-ODOO-DATABASE-NAME": DATABASE_NAME
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
# TEST DATA - Using correct field mappings
# =============================================================================

def get_test_customer_data() -> list:
    """
    Generate test customer data using the correct API field names.
    
    Based on field mapping documentation:
    - Required fields use _id suffix for reference fields (e.g., cust_group_id)
    - Custom fields use x_char_, x_float_, x_text_, x_selection_, x_many2one_, x_date_ prefixes
    """
    
    test_id = int(time.time()) % 100000
    
    return [{
        # === BASIC INFORMATION ===
        "number": "",                                    # 编号 (auto-generated if empty)
        "name": f"小花公司",    # 名称 (required)
        "cust_group_number": "终端客户",                         # 客户分组
        "x_char_cay5jmarrr": "",                         # SAP原客户代码
        "x_char_gzcp4gjmhi": "",        # 外文名称
        "x_char_kg0wwz9xv7": "",               # 别名
        
        # === ORGANIZATION ===
        "create_org_number": "My Company",                   # 创建组织
        "use_org_id": 3,                                 # 使用组织
        "internal_org_id": "",                        # 内部组织
        "sale_user_number": "小明",                # 所有者/销售员
        "sale_dep_id": "",                            # 销售部门
        
        # === LOCATION & CURRENCY ===
        "country_name": "新加坡",                          # 国家/地区
        "currency_id": "美元",                             # 结算币别
        "currency_name": "美元",                           # 结算币别
        
        # === CONTACT INFORMATION ===
        "x_char_t6itzytspg": "Joshua Test Contact",      # 采购联系人
        "x_char_vitg7ywwao": "+65-1234-5678",            # 采购联系人电话
        "x_char_9eqgn6f0dv": "+65-8765-4321",            # 固定联系电话
        "x_char_0qgsyzxr8t": "procurement@test.com",     # 采购邮箱
        "x_char_hjjshmrsdx": "Warehouse Manager",        # 收货联系人
        "x_char_9pex08hr7a": "+65-1111-2222",            # 收货人电话
        "x_char_x7wfy6v7rs": "123 Test Street, Singapore 123456",  # 收货地址
        "x_text_muniskyxgu": "123 Legal Address, Singapore",       # 法定注册地址
        
        # === FINANCIAL INFORMATION ===
        "inv_tax_number": "123456789",                   # 纳税人识别号
        "x_char_5smvg51jqa": "finance@test.com",         # 财务邮箱
        "x_char_ayuwxr8kn8": "invoice@test.com",         # 发票接收邮箱
        "inv_title": "Test Company Pte Ltd",             # 发票抬头
        "inv_bank_name": "DBS Bank",                     # 开户银行
        "inv_bank_acct": "1234567890",                   # 开户行账号
        "inv_telephone": "+65-3333-4444",                # 开票联系电话
        "inv_address": "456 Invoice Address, Singapore", # 开票通讯地址
        "tax_ident": False,                              # 纳税人身份
        
        # === ACCOUNTING ===
        "x_float_tbtkxzkblx": 0.0,                       # 科目余额
        "x_float_s9iykgnts9": 0.0,                       # 交货
        "x_float_vuow9bd5j8": 0.0,                       # 订单
        "x_float_noyptjqjqv": 0.0,                       # 信用额度
        "x_float_hkoamhw0em": 0.0,                       # 应收账款
        
        # === PAYMENT TERMS ===
        "pay_type_id": False,                            # 结算方式
        "receivable_term_id": False,                     # 收款条件
        "pay_party_id": False,                           # 结算方
        "receive_id": False,                             # 收货方
        "receive_party_id": False,                       # 付款方
        "delivery_id": False,                            # 交货方式
        "price_list": False,                             # 价目表
        
        # === DATES ===
        "x_date_tmclhk5hqx": False,                      # 付款日期
        "x_date_m5i3bpsrww": False,                      # 对账日
        "x_date_meluk6hgra": False,                      # 对账周期
        
        # === PCN INFORMATION ===
        "x_char_f15xqcasni": "NIL",                      # PCN 特殊要求
        "x_char_xy0fi6varj": "pcn@test.com",             # PCN 接收邮箱
        
        # === SPECIAL REQUIREMENTS ===
        "x_char_zroglhprb4": "Test",                         # 发货特殊要求
        "x_char_09sjzp5eae": "Test",                         # 开票特殊要求
        "x_char_mfgjqyo2ah": "Test",                         # 风险提示
        "x_char_nkasruoowt": "Test",                         # 不可用备注
        "x_selection_ykh5dwo6fd": False,                 # 是否参与交期计算
        
        # === REFERENCES ===
        "supplier_id": False,                            # 对应供应商
        "x_many2one_eycmxxaldx": False,                  # 指定厂商
        "x_many2one_sc4u7xibxo": False,                  # 控制科目
        
        # === NOTES ===
        "note": "which fields are missing?",
    }]


def get_minimal_customer_data() -> list:
    """
    Generate minimal test customer data with only required fields.
    """
    test_id = int(time.time()) % 100000
    
    return [{
        # Required fields only
        "create_org_id": 1,                              # 创建组织
        "name": f"Minimal Test Customer - {test_id}",   # 名称
        "cust_group_id": "C103",                         # 客户分组
        "country_id": "Singapore",                       # 国家/地区
        "currency_id": "USD",                            # 结算币别
        "sale_user_id": "0005",                          # 所有者/销售员
        "use_org_id": 8,                                 # 使用组织
    }]


# =============================================================================
# CURL COMMAND GENERATOR
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
  -H "X-ODOO-DATABASE-NAME: {DATABASE_NAME}" \\
  -d '{payload_str}' '''
    
    return curl_cmd


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Langchao inSuite API - Customer Creation Test (V2)')
    parser.add_argument('--internal', action='store_true', help='Use internal network URL')
    parser.add_argument('--curl-only', action='store_true', help='Only generate curl command, do not send request')
    parser.add_argument('--minimal', action='store_true', help='Use minimal required fields only')
    parser.add_argument('--full', action='store_true', help='Use full field set (default)')
    parser.add_argument('--db', type=str, default=None, help=f'Database name (default: {DATABASE_NAME})')
    parser.add_argument('--name', type=str, default=None, help='Custom customer name')
    args = parser.parse_args()
    
    # Update database name if provided via command line
    if args.db:
        DATABASE_NAME = args.db
    
    print("=" * 70)
    print("Langchao inSuite API - Customer Creation Test (V2)")
    print("=" * 70)
    print("\nUsing correct field mappings from documentation")
    print(f"Database: {DATABASE_NAME}")
    
    # Get test data
    if args.minimal:
        customer_data = get_minimal_customer_data()
        print("Mode: MINIMAL (required fields only)")
    else:
        customer_data = get_test_customer_data()
        print("Mode: FULL (all fields)")
    
    # Override name if provided
    if args.name:
        customer_data[0]["name"] = args.name
    
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