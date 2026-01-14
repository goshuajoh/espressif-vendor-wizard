import { v4 as uuidv4 } from 'uuid';
import type { VendorFormData, VendorSubmissionData, VendorType } from '../types/vendor';
import { BVI_PRODUCT_LIST } from '../types/vendor';

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

  // Rule 2: Customization Required = Yes → LXX
  if (formData.customizationRequired) {
    return { vendor: 'LXX', reason: 'Customization Required → LXX' };
  }

  // Rule 3: Technical Service only → BVI
  if (formData.espProductSelected === '技术服务 / Technical Service (e.g. 唤醒词定制, Wake up word customization)') {
    return { vendor: 'BVI', reason: 'Only Service selected, currency USD → BVI' };
  }

  // Rule 4: Special SoC check
  // ESP8266EX specifically
  if (formData.productVariant === 'ESP8266EX') {
    return { vendor: 'BVI', reason: 'Special SoC (ESP8266EX) → BVI' };
  }

  // Check if SoC variant contains "SOC" for ESP32-H2, ESP32-C5, ESP32-C61
  const socVariant = formData.productSoCVariant || '';
  if (socVariant.toUpperCase().includes('SOC')) {
    if (formData.espProductSelected === 'ESP32-H2' ||
        formData.espProductSelected === 'ESP32-C5' ||
        formData.espProductSelected === 'ESP32-C61') {
      return { vendor: 'BVI', reason: `Special SoC (${formData.espProductSelected} SOC) → BVI` };
    }
  }

  // Rule 5 & 6: Check MPN against BVI list
  // Priority: SoC variant first, then module variant
  const mpnToCheck = formData.productSoCVariant || formData.productVariant || '';
  
  if (mpnToCheck) {
    const isInBviList = BVI_PRODUCT_LIST.some(bviProduct => 
      mpnToCheck.toUpperCase().includes(bviProduct.toUpperCase()) ||
      bviProduct.toUpperCase().includes(mpnToCheck.toUpperCase())
    );

    if (isInBviList) {
      return { vendor: 'BVI', reason: `MPN (${mpnToCheck}) in BVI list → BVI` };
    } else {
      return { vendor: 'LXX', reason: `MPN (${mpnToCheck}) not in BVI list → LXX` };
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
 * Convert submission data to JSON format for API/download
 * Matches the Excel column structure
 */
export function toJsonFormat(data: VendorSubmissionData): object {
  return {
    // System fields
    vendor_id: data.vendorId,
    submission_date: data.submissionDate,
    assigned_vendor: data.assignedVendor,
    vendor_assignment_reason: data.vendorAssignmentReason,
    
    // Col F - Business Specialist (from URL parameter)
    business_specialist: data.businessSpecialist || null,
    
    // Col G - Company Legal Name
    company_legal_name: data.companyLegalName,
    
    // Col H - Purchasing Contact Name
    purchasing_contact_name: data.purchasingContactName,
    
    // Col I - Contact Email
    contact_email: data.contactEmail,
    
    // Col J - Contact Phone Number
    contact_phone: data.contactPhone,
    
    // Col K - Permanent Contact Number
    permanent_contact_number: data.permanentContactNumber || null,
    
    // Col L - Transaction Currency
    transaction_currency: data.transactionCurrency,
    
    // Col M - Company Legal Address (USD)
    company_legal_address: data.companyLegalAddress || null,
    
    // Col N - Company Tax ID (RMB)
    company_tax_id: data.companyTaxId || null,
    
    // Col O - ESP Product Selected
    esp_product_selected: data.espProductSelected,
    
    // Col P - Technical Service Details
    technical_service_details: data.technicalServiceDetails || null,
    
    // Product Variants
    product_variant: data.productVariant || null,
    product_soc_variant: data.productSoCVariant || null,
    
    // Col AE - Customization Service Required
    customization_required: data.customizationRequired,
    
    // Col AF - Shipping Address
    shipping_address: data.shippingAddress,
    
    // Col AG - Consignee Contact Name
    consignee_contact_name: data.consigneeContactName,
    
    // Col AH - Consignee Phone
    consignee_phone: data.consigneePhone,
    
    // Col AI - PCN Notification Email(s)
    pcn_notification_emails: data.pcnNotificationEmails,
    
    // Col AJ - PCN Special Requirements
    pcn_special_requirements: data.pcnSpecialRequirements,
    
    // Col AK - PCN Special Requirements Details
    pcn_special_requirements_details: data.pcnSpecialRequirementsDetails || null,
    
    // Col AL - Invoice Receiving Email
    invoice_receiving_email: data.invoiceReceivingEmail,
  };
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
