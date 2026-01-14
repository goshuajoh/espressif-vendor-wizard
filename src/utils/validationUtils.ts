// Validation utilities

export const validators = {
  required: (value: string | undefined | null): boolean => {
    return !!value && value.toString().trim().length > 0;
  },

  email: (value: string): boolean => {
    if (!value) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value.trim());
  },

  multipleEmails: (value: string): boolean => {
    if (!value) return false;
    const emails = value.split(',').map(e => e.trim()).filter(e => e);
    return emails.length > 0 && emails.every(email => validators.email(email));
  },

  phone: (value: string): boolean => {
    if (!value) return false;
    // Allow various phone formats: +86 138xxxx, 138-xxxx-xxxx, (021) xxxx-xxxx, etc.
    const phoneRegex = /^[\d\s\-\+\(\)]{8,20}$/;
    return phoneRegex.test(value.trim());
  },

  taxId: (value: string): boolean => {
    if (!value) return false;
    // Chinese unified social credit code: 18 characters alphanumeric
    const taxIdRegex = /^[A-Z0-9]{15,20}$/i;
    return taxIdRegex.test(value.trim());
  },

  minLength: (value: string, min: number): boolean => {
    return !!value && value.trim().length >= min;
  },
};

export interface FieldError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

// Helper to get invalid emails from a comma-separated string
export function getInvalidEmails(emails: string): string[] {
  if (!emails) return [];
  const emailList = emails.split(',').map(e => e.trim()).filter(e => e);
  return emailList.filter(email => !validators.email(email));
}
