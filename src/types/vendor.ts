// Vendor form data types - matching Excel form structure

export type VendorType = 'LX' | 'LXX' | 'BVI';

export type Currency = 'RMB' | 'USD';

export type CustomizationOption = 'yes' | 'no' | 'not_sure';

// Vendor to use_org_id mapping for API
export const VENDOR_ORG_ID_MAP: Record<VendorType, number> = {
  'BVI': 4,   // Espressif Incorporated (BVI)
  'LX': 3,    // LeXin (LX)
  'LXX': 8,   // LexingXing (LXX)
};

// Currency name mapping for API
export const CURRENCY_NAME_MAP: Record<Currency, string> = {
  'RMB': '人民币',
  'USD': 'USD',
};

// Customer group number - default value
export const DEFAULT_CUST_GROUP_NUMBER = 'C103';

// Country name mapping (common countries in Chinese)
export const COUNTRY_NAME_MAP: Record<string, string> = {
  // Asia
  'china': '中国',
  '中国': '中国',
  'singapore': 'Singapore',
  '新加坡': 'Singapore',
  'japan': '日本',
  '日本': '日本',
  'korea': '韩国',
  'south korea': '韩国',
  '韩国': '韩国',
  'taiwan': '台湾',
  '台湾': '台湾',
  'hong kong': '香港',
  '香港': '香港',
  'india': '印度',
  '印度': '印度',
  'malaysia': '马来西亚',
  '马来西亚': '马来西亚',
  'thailand': '泰国',
  '泰国': '泰国',
  'vietnam': '越南',
  '越南': '越南',
  'indonesia': '印度尼西亚',
  '印度尼西亚': '印度尼西亚',
  'philippines': '菲律宾',
  '菲律宾': '菲律宾',

  // Europe
  'germany': '德国',
  '德国': '德国',
  'france': '法国',
  '法国': '法国',
  'uk': '英国',
  'united kingdom': '英国',
  '英国': '英国',
  'italy': '意大利',
  '意大利': '意大利',
  'spain': '西班牙',
  '西班牙': '西班牙',
  'netherlands': '荷兰',
  '荷兰': '荷兰',
  'poland': '波兰',
  '波兰': '波兰',
  'sweden': '瑞典',
  '瑞典': '瑞典',
  'switzerland': '瑞士',
  '瑞士': '瑞士',

  // Americas
  'usa': '美国',
  'united states': '美国',
  'us': '美国',
  '美国': '美国',
  'canada': '加拿大',
  '加拿大': '加拿大',
  'brazil': '巴西',
  '巴西': '巴西',
  'mexico': '墨西哥',
  '墨西哥': '墨西哥',

  // Oceania
  'australia': '澳大利亚',
  '澳大利亚': '澳大利亚',
  'new zealand': '新西兰',
  '新西兰': '新西兰',

  // Middle East
  'israel': '以色列',
  '以色列': '以色列',
  'uae': '阿联酋',
  'united arab emirates': '阿联酋',
  '阿联酋': '阿联酋',
};

// Technical service option value
export const TECHNICAL_SERVICE_VALUE = '技术服务 / Technical Service';

// ESPProduct now accepts any product from the catalog or technical service
export type ESPProduct = string;

// Product variant options for each family - Module variants
export const PRODUCT_VARIANTS: Record<string, string[]> = {
  'ESP32-C6': [
    'ESP32-C6-MINI-1',
    'ESP32-C6-WROOM-1',
    'ESP32-C6-WROOM-1U',
  ],
  'ESP32-C3/ESP8685': [
    'ESP32-C3-MINI-1/1U',
    'ESP32-C3-WROOM-02/02U',
    'ESP8685-WROOM-03',
    'ESP8685-WROOM-04',
  ],
  'ESP32-C2/ESP8684': [
    'ESP8684-MINI-1/1U',
    'ESP8684-WROOM-01C',
    'ESP32-C2/ESP8684 Development Kits',
  ],
  'ESP32-H2': [
    'ESP32-H2-MINI-1/1U',
  ],
  'ESP32': [
    'ESP32-WROOM-32',
    'ESP32-WROOM-32D/32U',
    'ESP32-WROOM-32E/32UE',
    'ESP32-WROVER-E/IE',
    'ESP32-MINI-1/1U',
    'ESP32-PICO-V3',
    'ESP32 Development Kits',
  ],
  'ESP8266': [
    'ESP8266EX',
    'ESP-WROOM-02D/02U',
  ],
  'ESP32-S3': [
    'ESP32-S3-MINI-1/1U',
    'ESP32-S3-WROOM-1/1U',
    'ESP32-S3-WROOM-2',
    'ESP32-S3-PICO-1',
  ],
  'ESP32-S2': [
    'ESP32-S2-MINI-1/1U',
    'ESP32-S2-MINI-2/2U',
    'ESP32-S2-WROOM',
    'ESP32-S2-WROVER',
  ],
  'ESP32-C5': [
    'ESP32-C5-WROOM-1',
  ],
  'ESP32-C61': [
    'ESP32-C61-WROOM-1',
  ],
  'ESP32-P4': [
    'ESP32-P4 (Module)',
  ],
};

// SoC variant options for each family - Chip variants
export const SOC_VARIANTS: Record<string, string[]> = {
  'ESP32-C6': [
    'ESP32-C6 SOC',
  ],
  'ESP32-C3/ESP8685': [
    'ESP32-C3 SOC',
  ],
  'ESP32-C2/ESP8684': [
    'ESP8684 SOC',
  ],
  'ESP32-H2': [
    'ESP32-H2 SOC',
  ],
  'ESP32': [
    'ESP32 SOC',
    'ESP32-D0WD-V3',
    'ESP32-D0WDRH2-V3',
    'ESP32-U4WDH',
  ],
  'ESP8266': [],
  'ESP32-S3': [
    'ESP32-S3 SOC',
    'ESP32-S3R8',
    'ESP32-S3FN8',
  ],
  'ESP32-S2': [
    'ESP32-S2 SOC',
  ],
  'ESP32-C5': [
    'ESP32-C5 SOC',
  ],
  'ESP32-C61': [
    'ESP32-C61 SOC',
  ],
  'ESP32-P4': [
    'ESP32-P4 SOC',
  ],
};

// Product catalog with grouped structure (SoCs, Modules, DevKits per family)
export interface ProductGroup {
  label: string; // 'SoCs', 'Modules', or 'DevKits'
  products: string[];
}

export interface ProductFamily {
  family: string;
  groups: ProductGroup[];
}

export const PRODUCT_CATALOG: ProductFamily[] = [
  {
    family: 'ESP32-P4',
    groups: [
      { label: 'SoCs', products: ['ESP32-P4'] },
    ],
  },
  {
    family: 'ESP32-S3',
    groups: [
      { label: 'SoCs', products: ['ESP32-S3', 'ESP32-S3-PICO-1'] },
      { label: 'Modules', products: ['ESP32-S3-MINI-1/1U', 'ESP32-S3-WROOM-1/1U', 'ESP32-S3-WROOM-2/2U'] },
      { label: 'DevKits', products: ['ESP32-S3-BOX', 'ESP32-S3-DevKitC-1', 'ESP32-S3-DevKitM-1', 'ESP32-S3-EYE', 'ESP32-S3-USB-OTG', 'ESP32-S3-USB-Bridge', 'ESP32-S3-Korvo-1', 'ESP32-S3-Korvo-2', 'ESP32-S3-LCD-EV-Board'] },
    ],
  },
  {
    family: 'ESP32-S2',
    groups: [
      { label: 'SoCs', products: ['ESP32-S2'] },
      { label: 'Modules', products: ['ESP32-S2-MINI-1/1U', 'ESP32-S2-MINI-2/2U', 'ESP32-S2-WROOM (-I)', 'ESP32-S2-WROVER (-I)', 'ESP32-S2-SOLO (-U)', 'ESP32-S2-SOLO-2/2U'] },
      { label: 'DevKits', products: ['ESP32-S2-Saola-1', 'ESP32-S2-DevKitM-1', 'ESP32-S2-DevKitC-1', 'ESP32-S2-Kaluga-1', 'ESP32-S2-HMI-DevKit-1'] },
    ],
  },
  {
    family: 'ESP32-C61',
    groups: [
      { label: 'SoCs', products: ['ESP32-C61'] },
    ],
  },
  {
    family: 'ESP32-C6',
    groups: [
      { label: 'SoCs', products: ['ESP32-C6'] },
      { label: 'Modules', products: ['ESP32-C6-MINI-1', 'ESP32-C6-WROOM-1'] },
      { label: 'DevKits', products: ['ESP32-C6-DevKitC-1', 'ESP32-C6-DevKitM-1'] },
    ],
  },
  {
    family: 'ESP32-C5',
    groups: [
      { label: 'SoCs', products: ['ESP32-C5'] },
    ],
  },
  {
    family: 'ESP32-C3',
    groups: [
      { label: 'SoCs', products: ['ESP32-C3', 'ESP8685'] },
      { label: 'Modules', products: ['ESP32-C3-MINI-1/1U', 'ESP32-C3-WROOM-02/02U', 'ESP8685-WROOM-01', 'ESP8685-WROOM-03', 'ESP8685-WROOM-04', 'ESP8685-WROOM-05', 'ESP8685-WROOM-06', 'ESP8685-WROOM-07'] },
      { label: 'DevKits', products: ['ESP32-C3-DevKitM-1', 'ESP32-C3-DevKitC-02', 'ESP32-C3-LCDkit', 'ESP32-C3-Lyra'] },
    ],
  },
  {
    family: 'ESP32-C2',
    groups: [
      { label: 'SoCs', products: ['ESP8684'] },
      { label: 'Modules', products: ['ESP8684-MINI-1/1U', 'ESP8684-WROOM-01C', 'ESP8684-WROOM-02C/02UC', 'ESP8684-WROOM-03', 'ESP8684-WROOM-04C', 'ESP8684-WROOM-05', 'ESP8684-WROOM-06C', 'ESP8684-WROOM-07'] },
      { label: 'DevKits', products: ['ESP8684-DevKitM-1', 'ESP8684-DevKitC-02'] },
    ],
  },
  {
    family: 'ESP32-H2',
    groups: [
      { label: 'SoCs', products: ['ESP32-H2'] },
      { label: 'Modules', products: ['ESP32-H2-MINI-1/1U', 'ESP32-H2-WROOM-02C', 'ESP32-H2-WROOM-03', 'ESP32-H2-WROOM-07'] },
      { label: 'DevKits', products: ['ESP32-H2-DevKitM-1'] },
    ],
  },
  {
    family: 'ESP32',
    groups: [
      { label: 'SoCs', products: ['ESP32', 'ESP32-PICO-V3', 'ESP32-PICO-V3-02', 'ESP32-PICO-D4'] },
      { label: 'Modules', products: ['ESP32-WROOM-32E/32UE', 'ESP32-WROOM-DA', 'ESP32-WROOM-32SE', 'ESP32-WROVER-E/IE', 'ESP32-MINI-1/1U', 'ESP32-PICO-V3-ZERO (*ACK)', 'ESP32-PICO-MINI-02/02U', 'ESP32-SOLO-1', 'ESP32-DU1906 (-U)', 'ESP32-WROOM-32D/32U', 'ESP32-WROOM-32', 'ESP32-WROVER-B/IB', 'ESP32-WROVER (-I)'] },
      { label: 'DevKits', products: ['ESP32-DevKitC', 'ESP32-DevKitM-1', 'ESP-WROVER-KIT', 'ESP32-PICO-KIT', 'ESP32-PICO-KIT-1', 'ESP32-PICO-DevKitM-2', 'ESP-EYE', 'ESP32 Audio DevKits', 'ESP32-Korvo'] },
    ],
  },
  {
    family: 'ESP8266',
    groups: [
      { label: 'SoCs', products: ['ESP8266'] },
      { label: 'Modules', products: ['ESP-WROOM-02D/02U', 'ESP-WROOM-02'] },
      { label: 'DevKits', products: ['ESP8266-DevKitC'] },
    ],
  },
];

// Helper to get all products as flat list for validation
export function getAllProducts(): string[] {
  const products: string[] = [];
  for (const family of PRODUCT_CATALOG) {
    for (const group of family.groups) {
      products.push(...group.products);
    }
  }
  return products;
}

// Helper to determine if a product is a SoC (for BVI routing)
export function isSoCProduct(productName: string): boolean {
  for (const family of PRODUCT_CATALOG) {
    const socGroup = family.groups.find(g => g.label === 'SoCs');
    if (socGroup && socGroup.products.includes(productName)) {
      return true;
    }
  }
  return false;
}

// Helper to get the family for a product
export function getProductFamily(productName: string): string | null {
  for (const family of PRODUCT_CATALOG) {
    for (const group of family.groups) {
      if (group.products.includes(productName)) {
        return family.family;
      }
    }
  }
  return null;
}

// BVI List - Products handled by BVI vendor (SoC/chip variants)
export const BVI_PRODUCT_LIST: string[] = [
  // All SoC variants go to BVI
  'ESP32-C6 SOC',
  'ESP32-C3 SOC',
  'ESP8684 SOC',
  'ESP32-H2 SOC',
  'ESP32 SOC',
  'ESP32-D0WD-V3',
  'ESP32-D0WDRH2-V3',
  'ESP32-U4WDH',
  'ESP32-S3 SOC',
  'ESP32-S3R8',
  'ESP32-S3FN8',
  'ESP32-S2 SOC',
  'ESP32-C5 SOC',
  'ESP32-C61 SOC',
  'ESP32-P4 SOC',
  'ESP8266EX',
];

// Form data structure matching Excel columns
export interface VendorFormData {
  // Col F - Business Specialist (from URL)
  businessSpecialist?: string;
  
  // Col G - Company Legal Name
  companyLegalName: string;
  
  // Col H - Purchasing Contact Name
  purchasingContactName: string;
  
  // Col I - Contact Email
  contactEmail: string;
  
  // Col J - Contact Phone Number
  contactPhone: string;
  
  // Col K - Permanent Contact Number (optional)
  permanentContactNumber?: string;
  
  // Col L - Transaction Currency
  transactionCurrency: Currency | '';
  
  // Col M - Company Legal Address (shown for USD)
  companyLegalAddress?: string;
  
  // Col N - Company Tax ID (shown for RMB)
  companyTaxId?: string;
  
  // Col O - ESP Product Selected
  espProductSelected: string;
  
  // Col P - Technical Service Details (if service selected)
  technicalServiceDetails?: string;
  
  // Product Variants - Module variant
  productVariant?: string;
  
  // Product Variants - SoC/Chip variant
  productSoCVariant?: string;
  
  // Col AE - Customization Service Required (yes/no/not_sure)
  customizationRequired: CustomizationOption | '';
  
  // Col AF - Shipping Address
  shippingAddress: string;
  
  // Col AG - Consignee Contact Name
  consigneeContactName: string;
  
  // Col AH - Consignee Phone
  consigneePhone: string;
  
  // Col AI - PCN Notification Email(s)
  pcnNotificationEmails: string;
  
  // Col AJ - PCN Special Requirements
  pcnSpecialRequirements: boolean;
  
  // Col AK - PCN Special Requirements Details
  pcnSpecialRequirementsDetails?: string;
  
  // Col AL - Invoice Receiving Email
  invoiceReceivingEmail: string;
}

export interface VendorSubmissionData extends VendorFormData {
  vendorId: string;
  submissionDate: string;
  assignedVendor: VendorType;
  vendorAssignmentReason: string;
}

// Wizard steps
export type WizardStep = 
  | 'welcome'
  | 'company'
  | 'contact'
  | 'currency'
  | 'product'
  | 'customization'
  | 'shipping'
  | 'pcn'
  | 'invoice'
  | 'review'
  | 'success';

export const WIZARD_STEPS: { key: WizardStep; title: string; titleCn: string }[] = [
  { key: 'welcome', title: 'Welcome', titleCn: '欢迎' },
  { key: 'company', title: 'Company Profile', titleCn: '公司' },
  { key: 'contact', title: 'Contact', titleCn: '联系人' },
  { key: 'currency', title: 'Currency', titleCn: '币种' },
  { key: 'product', title: 'Product', titleCn: '产品' },
  { key: 'customization', title: 'Customization', titleCn: '定制' },
  { key: 'shipping', title: 'Shipping', titleCn: '收货' },
  { key: 'pcn', title: 'PCN', titleCn: 'PCN' },
  { key: 'invoice', title: 'Invoice', titleCn: '发票' },
  { key: 'review', title: 'Review', titleCn: '确认' },
  { key: 'success', title: 'Done', titleCn: '完成' },
];
