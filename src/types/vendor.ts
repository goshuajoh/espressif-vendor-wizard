// Vendor form data types - matching Excel form structure

export type VendorType = 'LX' | 'LXX' | 'BVI';

export type Currency = 'RMB' | 'USD';

// Product families
export const ESP_PRODUCTS = [
  'ESP32-C6',
  'ESP32-C3/ESP8685', 
  'ESP32-C2/ESP8684',
  'ESP32-H2',
  'ESP32',
  'ESP8266',
  'ESP32-S3',
  'ESP32-S2',
  'ESP32-C5',
  'ESP32-C61',
  'ESP32-P4',
  '技术服务 / Technical Service (e.g. 唤醒词定制, Wake up word customization)',
] as const;

export type ESPProduct = typeof ESP_PRODUCTS[number];

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
  espProductSelected: ESPProduct | '';
  
  // Col P - Technical Service Details (if service selected)
  technicalServiceDetails?: string;
  
  // Product Variants - Module variant
  productVariant?: string;
  
  // Product Variants - SoC/Chip variant
  productSoCVariant?: string;
  
  // Col AE - Customization Service Required
  customizationRequired: boolean;
  
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
