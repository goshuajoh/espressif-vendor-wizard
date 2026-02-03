# 客户建档信息收集 / Customer Information Collection

Espressif Vendor Account Setup Wizard - React frontend for registering customers as vendors in the Langchao work management system.

## Features

- **Bilingual UI**: Full Chinese (中文) and English language support with toggle button
- **URL Parameters**: Business Support name embedded in shareable links  
- **Automatic Vendor Assignment**: LX, LXX, or BVI based on business rules
- **Logo**: Espressif logo in sidebar
- **Dark Mode**: Toggle between light and dark themes
- **JSON Export**: Download submission data for backend integration

## URL Parameters - Business Support Name

Generate shareable links with Business Support name embedded:

```bash
# Chinese name
http://localhost:5173/?bs=王娜娜

# English name  
http://localhost:5173/?businessSupport=Joshua%20Goh

# URL encoded Chinese
http://localhost:5173/?bs=%E7%8E%8B%E5%A8%9C%E5%A8%9C
```

The Business Support name from the URL:
- Displays on the Welcome screen
- Shows in the header next to the avatar
- Is included in the JSON output as `business_specialist`

## Installation & Running

```bash
npm install
npm run dev     # Development server at http://localhost:5173
npm run build   # Production build
```

## Testing URL Parameters Locally

1. Start the dev server: `npm run dev`
2. Open browser to: `http://localhost:5173/?bs=王娜娜`
3. You should see "王娜娜" displayed:
   - In the welcome screen alert
   - In the header (top right corner)
   - In the final JSON output

## Vendor Assignment Rules

| Priority | Condition | Vendor |
|----------|-----------|--------|
| 1 | Currency = RMB | LX |
| 2 | Customization Required = Yes | LXX |
| 3 | Technical Service only | BVI |
| 4 | ESP8266EX or H2/C5/C61 SOC | BVI |
| 5 | MPN in BVI list (SoC variants) | BVI |
| 6 | Default | LXX |

## JSON Output Format

```json
{
  "vendor_id": "A1B2C3D4E5F6",
  "submission_date": "2024-01-15T10:30:00.000Z",
  "assigned_vendor": "LXX",
  "vendor_assignment_reason": "MPN not in BVI list → LXX",
  "business_specialist": "王娜娜",
  "company_legal_name": "深圳市XXX科技有限公司",
  "purchasing_contact_name": "张三",
  "contact_email": "zhang@company.com",
  "contact_phone": "+86 13800138000",
  "transaction_currency": "RMB",
  "company_tax_id": "91440300MA5HAG2F5P",
  "esp_product_selected": "ESP32-S3",
  "product_variant": "ESP32-S3-WROOM-1/1U",
  "customization_required": false,
  "shipping_address": "深圳市南山区...",
  "consignee_contact_name": "李四",
  "consignee_phone": "+86 13900139000",
  "pcn_notification_emails": "pcn@company.com",
  "invoice_receiving_email": "finance@company.com"
}
```

## Language Switching

Click the language button in the header to toggle:
- **中文** ↔ **English**

The entire UI updates including:
- All form labels and placeholders
- Validation messages
- Navigation buttons
- Review summaries

## Project Structure

```
src/
├── components/
│   ├── VendorWizard.tsx      # Main wizard component
│   └── steps/                 # Step components (10 steps)
├── contexts/
│   └── LanguageContext.tsx    # Language state management
├── i18n/
│   └── translations.ts        # All Chinese/English strings
├── types/
│   └── vendor.ts              # TypeScript types & product lists
├── utils/
│   ├── urlParams.ts           # URL parameter parsing
│   └── vendorUtils.ts         # Vendor assignment logic
└── App.tsx                    # Main app with layout
```

## Tech Stack

- React 19 + TypeScript + Vite
- Arco Design (ByteDance UI library)
- UUID for vendor ID generation
