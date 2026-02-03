import { v4 as uuidv4 } from 'uuid';
import type { VendorFormData, VendorSubmissionData, VendorType, Currency } from '../types/vendor';
import { BVI_PRODUCT_LIST, VENDOR_ORG_ID_MAP, CURRENCY_NAME_MAP, DEFAULT_CUST_GROUP_NUMBER, COUNTRY_NAME_MAP, isSoCProduct, getProductFamily, TECHNICAL_SERVICE_VALUE } from '../types/vendor';

/**
 * Generate a unique vendor ID
 * Format: 12 character alphanumeric uppercase string
 */
export function generateVendorId(): string {
  const uuid = uuidv4();
  return uuid.replace(/-/g, '').substring(0, 12).toUpperCase();
}

/**
 * Vendor Assignment Logic based on Excel formula
 * 
 * Rules in order of priority:
 * 1. Currency = RMB → LX
 * 2. Customization Required = Yes → LXX
 * 3. Product = Technical Service only → BVI
 * 4. Special SoC (ESP8266EX, or SOC variants for H2/C5/C61) → BVI
 * 5. MPN in BVI list → BVI
 * 6. MPN not in BVI list → LXX
 */
export function assignVendor(formData: VendorFormData): { vendor: VendorType; reason: string } {
  // Rule 1: Currency = RMB → LX
  if (formData.transactionCurrency === 'RMB') {
    return { vendor: 'LX', reason: 'Currency is RMB → LX' };
  }

  // Rule 2: Customization Required = Yes OR Not Sure (for USD) → LXX
  if (formData.customizationRequired === 'yes') {
    return { vendor: 'LXX', reason: 'Customization Required → LXX' };
  }
  if (formData.customizationRequired === 'not_sure') {
    return { vendor: 'LXX', reason: 'Customization Uncertain → LXX' };
  }

  // Rule 3: Technical Service only → BVI
  if (formData.espProductSelected === TECHNICAL_SERVICE_VALUE) {
    return { vendor: 'BVI', reason: 'Only Service selected, currency USD → BVI' };
  }

  const selectedProduct = formData.espProductSelected || '';
  const productFamily = getProductFamily(selectedProduct);

  // Rule 4: Special SoC check for specific families
  // SoC products for ESP32-H2, ESP32-C5, ESP32-C61, ESP32-P4 go to BVI
  if (isSoCProduct(selectedProduct)) {
    if (productFamily === 'ESP32-H2' ||
        productFamily === 'ESP32-C5' ||
        productFamily === 'ESP32-C61' ||
        productFamily === 'ESP32-P4') {
      return { vendor: 'BVI', reason: `Special SoC (${selectedProduct}) → BVI` };
    }
  }

  // Rule 5 & 6: Check product against BVI list
  if (selectedProduct) {
    const isInBviList = BVI_PRODUCT_LIST.some(bviProduct =>
      selectedProduct.toUpperCase().includes(bviProduct.toUpperCase()) ||
      bviProduct.toUpperCase().includes(selectedProduct.toUpperCase())
    );

    // Also check if it's a SoC product (all SoCs generally go to BVI)
    if (isInBviList || isSoCProduct(selectedProduct)) {
      return { vendor: 'BVI', reason: `Product (${selectedProduct}) routes to BVI` };
    } else {
      return { vendor: 'LXX', reason: `Product (${selectedProduct}) routes to LXX` };
    }
  }

  // Default: LXX
  return { vendor: 'LXX', reason: 'Default assignment → LXX' };
}

/**
 * Convert form data to submission data format
 */
export function prepareSubmissionData(
  formData: VendorFormData,
  vendorId: string
): VendorSubmissionData {
  const { vendor, reason } = assignVendor(formData);
  
  return {
    ...formData,
    vendorId,
    submissionDate: new Date().toISOString(),
    assignedVendor: vendor,
    vendorAssignmentReason: reason,
  };
}

/**
 * Extract country name from an address string
 * Returns the Chinese name for the country if found
 */
export function extractCountryFromAddress(address: string): string {
  if (!address) return '中国'; // Default to China

  const addressLower = address.toLowerCase();

  // Check each country name mapping
  for (const [key, value] of Object.entries(COUNTRY_NAME_MAP)) {
    if (addressLower.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default based on address patterns
  // If address contains Chinese characters, likely China
  if (/[\u4e00-\u9fa5]/.test(address)) {
    return '中国';
  }

  // If can't determine, return empty to let user correct
  return '';
}

/**
 * Get the organization ID for the assigned vendor
 */
export function getOrgId(vendor: VendorType): number {
  return VENDOR_ORG_ID_MAP[vendor];
}

/**
 * Get the currency name for the API
 */
export function getCurrencyName(currency: Currency | ''): string {
  if (!currency) return '';
  return CURRENCY_NAME_MAP[currency] || currency;
}

/**
 * Convert submission data to JSON format for API/download
 * Matches the Langchao inSuite API structure
 *
 * Full Field mapping based on latest API spec:
 * - number: 编号
 * - name: 名称
 * - cust_group_id: 客户分组
 * - X_char_cay5jmarrr: SAP原客户代码
 * - sale_user_id: 所有者
 * - X_char_gzcp4gjmhi: 外文名称
 * - X_char_kg0wwz9xv7: 别名
 * - create_org_id: 创建组织
 * - use_org_id: 使用组织
 * - nternal_org_id: 内部组织
 * - supplier_id: 对应供应商
 * - X_float_tbtkxzkblx: 科目余额
 * - X_float_s9iykgnts9: 交货
 * - X_float_vuow9bd5j8: 订单
 * - note: 备注
 * - country_id: 国家/地区
 * - X_char_f15xqcasni: PCN 特殊要求
 * - X_char_xy0fi6varj: PCN 接收邮箱
 * - X_selection_ykh5dwo6fd: 是否参与交期计算
 * - X_char_5smvg51jqa: 财务邮箱
 * - X_many2one_eycmxxaldx: 指定厂商
 * - X_char_ayuwxr8kn8: 发票接收邮箱
 * - inv_tax_number: 纳税人识别号
 * - X_char_0qgsyzxr8t: 采购邮箱
 * - X_char_zroglhprb4: 发货特殊要求
 * - X_char_09sjzp5eae: 开票特殊要求
 * - X_char_mfgjqyo2ah: 风险提示
 * - X_char_nkasruoowt: 不可用备注
 * - X_char_t6itzytspg: 采购联系人
 * - X_char_vitg7ywwao: 采购联系人电话
 * - X_char_9eqgn6f0dv: 固定联系电话
 * - X_char_hjjshmrsdx: 收货联系人
 * - X_char_9pex08hr7a: 收货人电话
 * - X_char_x7wfy6v7rs: 收货地址
 * - X_text_muniskyxgu: 法定注册地址
 * - currency_id: 结算币别
 * - pay_type_id: 结算方式
 * - receivable_term_id: 收款条件
 * - pay_party_id: 结算方
 * - receive_id: 收货方
 * - sale_dep_id: 销售部门
 * - receive_party_id: 付款方
 * - price_list: 价目表
 * - delivery_id: 交货方式
 * - X_float_noyptjqjqv: 信用额度
 * - X_date_tmclhk5hqx: 付款日期
 * - X_date_m5i3bpsrww: 对账日
 * - X_date_meluk6hgra: 对账周期
 * - X_many2one_sc4u7xibxo: 控制科目
 * - X_float_hkoamhw0em: 应收账款
 * - inv_title: 发票抬头
 * - inv_bank_name: 开户银行
 * - inv_bank_acct: 开户行账号
 * - inv_telephone: 开票联系电话
 * - tax_ident: 纳税人身份
 * - inv_address: 开票通讯地址
 */
export function toJsonFormat(data: VendorSubmissionData): object {
  // Determine country from address (shipping address for RMB, legal address for USD)
  const addressForCountry = data.transactionCurrency === 'RMB'
    ? data.shippingAddress
    : (data.companyLegalAddress || data.shippingAddress);
  const countryName = extractCountryFromAddress(addressForCountry);

  // Get use_org_id based on assigned vendor
  const useOrgId = getOrgId(data.assignedVendor);

  // Get currency name for API
  const currencyName = getCurrencyName(data.transactionCurrency);

  return {
    // === Core Identification Fields ===
    // number: 编号 - Customer number (vendor ID)
    number: "",

    // name: 名称 - Customer name (company legal name)
    name: data.companyLegalName,

    // cust_group_id: 客户分组 - Customer group ID (use number for lookup)
    cust_group_number: DEFAULT_CUST_GROUP_NUMBER,

    // X_char_cay5jmarrr: SAP原客户代码 - SAP Original Customer Code
    X_char_cay5jmarrr: 'Some Number',

    // sale_user_id: 所有者 - Owner/Sales person (use number for lookup)
    sale_user_number: data.businessSpecialist || false,

    // X_char_gzcp4gjmhi: 外文名称 - Foreign Name
    X_char_gzcp4gjmhi: data.companyLegalName,

    // X_char_kg0wwz9xv7: 别名 - Alias
    X_char_kg0wwz9xv7: 'some Other Name',

    // === Organization Fields ===
    // create_org_id: 创建组织 - Creating Organization
    create_org_number: "My Company",

    // use_org_id: 使用组织 - Using Organization ID based on vendor assignment
    use_org_id: useOrgId,

    // nternal_org_id: 内部组织 - Internal Organization (note: typo in API spec)
    nternal_org_id: false,

    // supplier_id: 对应供应商 - Corresponding Supplier
    supplier_id: false,

    // === Financial Summary Fields (defaults) ===
    // X_float_tbtkxzkblx: 科目余额 - Account Balance
    X_float_tbtkxzkblx: 0,

    // X_float_s9iykgnts9: 交货 - Delivery Amount
    X_float_s9iykgnts9: 0,

    // X_float_vuow9bd5j8: 订单 - Order Amount
    X_float_vuow9bd5j8: 0,

    // note: 备注 - Notes
    note: `Submitted: ${data.submissionDate} | Assigned: ${data.assignedVendor} | Reason: ${data.vendorAssignmentReason}`,

    // === Location & Contact Fields ===
    // country_id: 国家/地区 - Country (use name for lookup)
    country_name: countryName,

    // X_char_f15xqcasni: PCN 特殊要求 - PCN Special Requirements
    X_char_f15xqcasni: data.pcnSpecialRequirements
      ? (data.pcnSpecialRequirementsDetails || '')
      : 'NIL',

    // X_char_xy0fi6varj: PCN 接收邮箱 - PCN Notification Emails
    X_char_xy0fi6varj: data.pcnNotificationEmails,

    // X_selection_ykh5dwo6fd: 是否参与交期计算 - Participate in Delivery Calculation
    X_selection_ykh5dwo6fd: '是',

    // X_char_5smvg51jqa: 财务邮箱 - Finance Email
    X_char_5smvg51jqa: data.invoiceReceivingEmail,

    // X_many2one_eycmxxaldx: 指定厂商 - Designated Manufacturer
    X_many2one_eycmxxaldx: false,

    // X_char_ayuwxr8kn8: 发票接收邮箱 - Invoice Receiving Email
    X_char_ayuwxr8kn8: data.invoiceReceivingEmail,

    // inv_tax_number: 纳税人识别号 - Tax ID (for RMB customers)
    inv_tax_number: data.companyTaxId || '',

    // X_char_0qgsyzxr8t: 采购邮箱 - Purchasing Email
    X_char_0qgsyzxr8t: data.contactEmail,

    // X_char_zroglhprb4: 发货特殊要求 - Shipping Special Requirements
    X_char_zroglhprb4: 'Special Shipping Instructions',

    // X_char_09sjzp5eae: 开票特殊要求 - Invoicing Special Requirements
    X_char_09sjzp5eae: 'Invoice Special Instructions',

    // X_char_mfgjqyo2ah: 风险提示 - Risk Warning
    X_char_mfgjqyo2ah: 'Risk Warning',

    // X_char_nkasruoowt: 不可用备注 - Unavailable Notes
    X_char_nkasruoowt: 'Unavailable Notes',

    // X_char_t6itzytspg: 采购联系人 - Purchasing Contact Name
    X_char_t6itzytspg: data.purchasingContactName,

    // X_char_vitg7ywwao: 采购联系人电话 - Purchasing Contact Phone
    X_char_vitg7ywwao: data.contactPhone,

    // X_char_9eqgn6f0dv: 固定联系电话 - Permanent Contact Number
    X_char_9eqgn6f0dv: data.permanentContactNumber || '',

    // X_char_hjjshmrsdx: 收货联系人 - Consignee Contact Name
    X_char_hjjshmrsdx: data.consigneeContactName,

    // X_char_9pex08hr7a: 收货人电话 - Consignee Phone
    X_char_9pex08hr7a: data.consigneePhone,

    // X_char_x7wfy6v7rs: 收货地址 - Shipping Address
    X_char_x7wfy6v7rs: data.shippingAddress,

    // X_text_muniskyxgu: 法定注册地址 - Company Legal Address
    X_text_muniskyxgu: data.companyLegalAddress || '',

    // === Settlement & Payment Fields ===
    // currency_id: 结算币别 - Settlement Currency (use name for lookup)
    currency_name: currencyName,

    // pay_type_id: 结算方式 - Settlement Method
    pay_type_id: false,

    // receivable_term_id: 收款条件 - Receivable Terms
    receivable_term_id: false,

    // pay_party_id: 结算方 - Settlement Party
    pay_party_id: false,

    // receive_id: 收货方 - Receiving Party
    receive_id: false,

    // sale_dep_id: 销售部门 - Sales Department
    sale_dep_id: false,

    // receive_party_id: 付款方 - Payment Party
    receive_party_id: false,

    // price_list: 价目表 - Price List
    price_list: false,

    // delivery_id: 交货方式 - Delivery Method
    delivery_id: false,

    // X_float_noyptjqjqv: 信用额度 - Credit Limit
    X_float_noyptjqjqv: 0,

    // X_date_tmclhk5hqx: 付款日期 - Payment Date
    X_date_tmclhk5hqx: false,

    // X_date_m5i3bpsrww: 对账日 - Reconciliation Date
    X_date_m5i3bpsrww: false,

    // X_date_meluk6hgra: 对账周期 - Reconciliation Cycle
    X_date_meluk6hgra: false,

    // X_many2one_sc4u7xibxo: 控制科目 - Control Account
    X_many2one_sc4u7xibxo: false,

    // X_float_hkoamhw0em: 应收账款 - Accounts Receivable
    X_float_hkoamhw0em: 0,

    // === Invoice Fields ===
    // inv_title: 发票抬头 - Invoice Title
    inv_title: data.companyLegalName,

    // inv_bank_name: 开户银行 - Bank Name
    inv_bank_name: '',

    // inv_bank_acct: 开户行账号 - Bank Account Number
    inv_bank_acct: '',

    // inv_telephone: 开票联系电话 - Invoice Contact Phone
    inv_telephone: data.contactPhone,

    // tax_ident: 纳税人身份 - Taxpayer Identity
    tax_ident: false,

    // inv_address: 开票通讯地址 - Invoice Mailing Address
    inv_address: data.companyLegalAddress || data.shippingAddress,

    // === Additional metadata (for reference, not sent to API) ===
    _metadata: {
      vendor_id: data.vendorId,
      submission_date: data.submissionDate,
      assigned_vendor: data.assignedVendor,
      vendor_assignment_reason: data.vendorAssignmentReason,
      transaction_currency: data.transactionCurrency,
      esp_product_selected: data.espProductSelected,
      technical_service_details: data.technicalServiceDetails || null,
      product_variant: data.productVariant || null,
      product_soc_variant: data.productSoCVariant || null,
      customization_required: data.customizationRequired,
    },
  };
}

/**
 * Convert submission data to API payload format
 * Returns the exact structure expected by Langchao inSuite API
 */
export function toApiPayload(data: VendorSubmissionData): object[] {
  const jsonData = toJsonFormat(data);
  // Remove _metadata for API call
  const { _metadata, ...apiData } = jsonData as any;
  return [apiData];
}

/**
 * Download data as JSON file
 */
export function downloadJson(data: object, filename: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
