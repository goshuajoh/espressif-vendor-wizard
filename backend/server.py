#!/usr/bin/env python3
"""
Espressif Vendor Wizard - Backend API Server
Receives customer data from the frontend and creates customers in Langchao inSuite.

Field Mapping (字段 -> 字段名):
==================================
编号            -> number
名称            -> name
客户分组        -> cust_group_id
SAP原客户代码   -> X_char_cay5jmarrr
所有者          -> sale_user_id
外文名称        -> X_char_gzcp4gjmhi
别名            -> X_char_kg0wwz9xv7
创建组织        -> create_org_id
使用组织        -> use_org_id
内部组织        -> nternal_org_id
对应供应商      -> supplier_id
科目余额        -> X_float_tbtkxzkblx
交货            -> X_float_s9iykgnts9
订单            -> X_float_vuow9bd5j8
备注            -> note
国家/地区       -> country_id
PCN 特殊要求    -> X_char_f15xqcasni
PCN 接收邮箱    -> X_char_xy0fi6varj
是否参与交期计算 -> X_selection_ykh5dwo6fd
财务邮箱        -> X_char_5smvg51jqa
指定厂商        -> X_many2one_eycmxxaldx
发票接收邮箱    -> X_char_ayuwxr8kn8
纳税人识别号    -> inv_tax_number
采购邮箱        -> X_char_0qgsyzxr8t
发货特殊要求    -> X_char_zroglhprb4
开票特殊要求    -> X_char_09sjzp5eae
风险提示        -> X_char_mfgjqyo2ah
不可用备注      -> X_char_nkasruoowt
采购联系人      -> X_char_t6itzytspg
采购联系人电话  -> X_char_vitg7ywwao
固定联系电话    -> X_char_9eqgn6f0dv
收货联系人      -> X_char_hjjshmrsdx
收货人电话      -> X_char_9pex08hr7a
收货地址        -> X_char_x7wfy6v7rs
法定注册地址    -> X_text_muniskyxgu
结算币别        -> currency_id
结算方式        -> pay_type_id
收款条件        -> receivable_term_id
结算方          -> pay_party_id
收货方          -> receive_id
销售部门        -> sale_dep_id
付款方          -> receive_party_id
价目表          -> price_list
交货方式        -> delivery_id
信用额度        -> X_float_noyptjqjqv
付款日期        -> X_date_tmclhk5hqx
对账日          -> X_date_m5i3bpsrww
对账周期        -> X_date_meluk6hgra
控制科目        -> X_many2one_sc4u7xibxo
应收账款        -> X_float_hkoamhw0em
发票抬头        -> inv_title
开户银行        -> inv_bank_name
开户行账号      -> inv_bank_acct
开票联系电话    -> inv_telephone
纳税人身份      -> tax_ident
开票通讯地址    -> inv_address
"""

import json
import time
import hashlib
import hmac
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# =============================================================================
# CONFIGURATION
# =============================================================================

# API Credentials (provided by Langchao)
CLIENT_ID = "uJgCcz2rNYAQPIfRFR6JaMo5doYShnyR"
SECRET_KEY = "RoGUu7QpClCS8p8AwEhvtYoBqPleHXIQ"

# Database name
DATABASE_NAME = "shlxkjgfyxgs"

# API Endpoints
BASE_URL_INTERNAL = "http://192.168.6.91:32000"
BASE_URL_EXTERNAL = "http://58.33.3.130:32000"
API_ROUTE = "/studio/api_special/insuite/mdm_customer/create1"

# Default to internal URL (change to BASE_URL_EXTERNAL if needed)
BASE_URL = BASE_URL_INTERNAL


# =============================================================================
# SIGNATURE GENERATION
# =============================================================================

def get_msg_auth_code(api_route: str, secret_key: str, timestamp: int, json_str: str, method: str = 'post') -> str:
    """
    Generate the message authentication code (signature) for the API request.

    Algorithm:
    1. Create secret string: ts@{timestamp}|route@{api_route}|sec@{secret_key}|method@{method}
    2. SHA-512 hash the secret string to get a 64-byte MAC key
    3. HMAC-SHA256 the request body (JSON string) with the MAC key
    """
    # Step 1: Build the secret string
    secret = f"ts@{timestamp}|route@{api_route}|sec@{secret_key}|method@{method}"

    # Step 2: SHA-512 hash to get MAC key
    sec_bytes = secret.encode('utf-8')
    mac_key = hashlib.sha512(sec_bytes).digest()

    # Step 3: HMAC-SHA256 the JSON body
    body_bytes = json_str.encode('utf-8')
    msg_auth_code = hmac.new(mac_key, body_bytes, hashlib.sha256).hexdigest()

    return msg_auth_code


# =============================================================================
# LANGCHAO API CLIENT
# =============================================================================

def create_customer_in_langchao(customer_data: list, use_internal: bool = True) -> dict:
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

    # The param array as JSON string (for signing)
    # Note: separators=(',', ':') removes spaces for consistent signing
    param_json = json.dumps(customer_data, separators=(',', ':'), ensure_ascii=False)

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

    print(f"\n[INFO] Creating customer in Langchao...")
    print(f"[INFO] URL: {url}")
    print(f"[INFO] Timestamp: {timestamp}")
    print(f"[DEBUG] Payload: {json.dumps(payload, indent=2, ensure_ascii=False)}")

    # Make the request
    headers = {
        "Content-Type": "application/json",
        "X-ODOO-DATABASE-NAME": DATABASE_NAME
    }

    try:
        response = requests.post(
            url=url,
            data=json.dumps(payload, ensure_ascii=False),
            headers=headers,
            timeout=30
        )

        print(f"[INFO] Response status: {response.status_code}")

        try:
            result = response.json()
            print(f"[INFO] Response: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return {
                "success": response.ok and "result" in result,
                "status_code": response.status_code,
                "data": result
            }
        except json.JSONDecodeError:
            print(f"[WARN] Non-JSON response: {response.text}")
            return {
                "success": False,
                "status_code": response.status_code,
                "error": "Invalid JSON response",
                "raw_response": response.text
            }

    except requests.exceptions.ConnectionError as e:
        print(f"[ERROR] Connection failed: {e}")
        return {"success": False, "error": "connection_failed", "message": str(e)}
    except requests.exceptions.Timeout as e:
        print(f"[ERROR] Timeout: {e}")
        return {"success": False, "error": "timeout", "message": str(e)}
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        return {"success": False, "error": "unknown", "message": str(e)}


# =============================================================================
# API ROUTES
# =============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "service": "Espressif Vendor Wizard Backend",
        "langchao_url": BASE_URL
    })


@app.route('/api/create-customer', methods=['POST'])
def create_customer():
    """
    Create a new customer in Langchao inSuite.

    Expects JSON body with customer data from the frontend wizard.
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400

        print("\n" + "=" * 70)
        print("RECEIVED CUSTOMER DATA FROM FRONTEND")
        print("=" * 70)
        print(json.dumps(data, indent=2, ensure_ascii=False))

        # Check if data is already a list or needs to be wrapped
        customer_data = data if isinstance(data, list) else [data]

        # Remove _metadata if present (not needed for API)
        for customer in customer_data:
            if '_metadata' in customer:
                del customer['_metadata']

        # Determine which URL to use based on request header or default
        use_internal = request.headers.get('X-Use-Internal', 'true').lower() == 'true'

        # Call Langchao API
        result = create_customer_in_langchao(customer_data, use_internal=use_internal)

        if result.get("success"):
            return jsonify({
                "success": True,
                "message": "Customer created successfully",
                "data": result.get("data")
            })
        else:
            return jsonify({
                "success": False,
                "error": result.get("error", "Unknown error"),
                "message": result.get("message", "Failed to create customer"),
                "details": result
            }), 500

    except Exception as e:
        print(f"[ERROR] Exception in create_customer: {e}")
        return jsonify({
            "success": False,
            "error": "server_error",
            "message": str(e)
        }), 500


@app.route('/api/config', methods=['GET'])
def get_config():
    """Get current API configuration (for debugging)."""
    return jsonify({
        "base_url": BASE_URL,
        "api_route": API_ROUTE,
        "client_id": CLIENT_ID[:8] + "..." + CLIENT_ID[-4:],
        "database": DATABASE_NAME
    })


@app.route('/api/test', methods=['POST'])
def test_connection():
    """Test connection to Langchao API with all fields using default values."""
    try:
        test_id = int(time.time()) % 100000
        test_data = [{
            # Core identification
            "number": f"TEST_{test_id}",
            "name": f"API Connection Test {test_id}",
            "cust_group_number": "C103",
            "X_char_cay5jmarrr": "",  # SAP原客户代码
            "sale_user_number": False,
            "X_char_gzcp4gjmhi": f"API Test {test_id}",  # 外文名称
            "X_char_kg0wwz9xv7": "",  # 别名

            # Organization
            "create_org_number": "My Company",
            "use_org_id": 3,  # LX default
            "nternal_org_id": False,  # 内部组织
            "supplier_id": False,  # 对应供应商

            # Financial summary
            "X_float_tbtkxzkblx": 0,  # 科目余额
            "X_float_s9iykgnts9": 0,  # 交货
            "X_float_vuow9bd5j8": 0,  # 订单

            # Notes and location
            "note": "API connection test - can be deleted",
            "country_name": "中国",

            # PCN
            "X_char_f15xqcasni": "NIL",  # PCN 特殊要求
            "X_char_xy0fi6varj": "test@example.com",  # PCN 接收邮箱
            "X_selection_ykh5dwo6fd": "是",  # 是否参与交期计算

            # Contact emails
            "X_char_5smvg51jqa": "test@example.com",  # 财务邮箱
            "X_many2one_eycmxxaldx": False,  # 指定厂商
            "X_char_ayuwxr8kn8": "test@example.com",  # 发票接收邮箱
            "inv_tax_number": "",  # 纳税人识别号
            "X_char_0qgsyzxr8t": "test@example.com",  # 采购邮箱

            # Special requirements
            "X_char_zroglhprb4": "",  # 发货特殊要求
            "X_char_09sjzp5eae": "",  # 开票特殊要求
            "X_char_mfgjqyo2ah": "",  # 风险提示
            "X_char_nkasruoowt": "",  # 不可用备注

            # Contact info
            "X_char_t6itzytspg": "Test Contact",  # 采购联系人
            "X_char_vitg7ywwao": "13800138000",  # 采购联系人电话
            "X_char_9eqgn6f0dv": "",  # 固定联系电话
            "X_char_hjjshmrsdx": "Test Consignee",  # 收货联系人
            "X_char_9pex08hr7a": "13800138000",  # 收货人电话
            "X_char_x7wfy6v7rs": "Test Address",  # 收货地址
            "X_text_muniskyxgu": "",  # 法定注册地址

            # Settlement
            "currency_name": "人民币",
            "pay_type_id": False,  # 结算方式
            "receivable_term_id": False,  # 收款条件
            "pay_party_id": False,  # 结算方
            "receive_id": False,  # 收货方
            "sale_dep_id": False,  # 销售部门
            "receive_party_id": False,  # 付款方
            "price_list": False,  # 价目表
            "delivery_id": False,  # 交货方式

            # Credit and dates
            "X_float_noyptjqjqv": 0,  # 信用额度
            "X_date_tmclhk5hqx": False,  # 付款日期
            "X_date_m5i3bpsrww": False,  # 对账日
            "X_date_meluk6hgra": False,  # 对账周期
            "X_many2one_sc4u7xibxo": False,  # 控制科目
            "X_float_hkoamhw0em": 0,  # 应收账款

            # Invoice
            "inv_title": f"Test Company {test_id}",  # 发票抬头
            "inv_bank_name": "",  # 开户银行
            "inv_bank_acct": "",  # 开户行账号
            "inv_telephone": "13800138000",  # 开票联系电话
            "tax_ident": False,  # 纳税人身份
            "inv_address": "",  # 开票通讯地址
        }]

        use_internal = request.headers.get('X-Use-Internal', 'true').lower() == 'true'
        result = create_customer_in_langchao(test_data, use_internal=use_internal)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =============================================================================
# MAIN
# =============================================================================

if __name__ == '__main__':
    print("=" * 70)
    print("Espressif Vendor Wizard - Backend Server")
    print("=" * 70)
    print(f"Langchao API URL: {BASE_URL}")
    print(f"Database: {DATABASE_NAME}")
    print("=" * 70)
    print("\nStarting server on http://localhost:5001")
    print("Press Ctrl+C to stop\n")

    app.run(host='0.0.0.0', port=5001, debug=True)
