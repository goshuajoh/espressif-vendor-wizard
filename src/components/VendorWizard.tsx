import { useState, useCallback, useEffect } from 'react';
import { Steps, Button, Space } from '@arco-design/web-react';
import { IconLeft, IconRight } from '@arco-design/web-react/icon';
import type { VendorFormData, WizardStep, VendorSubmissionData } from '../types/vendor';
import { WIZARD_STEPS, TECHNICAL_SERVICE_VALUE } from '../types/vendor';
import { generateVendorId, prepareSubmissionData, toJsonFormat, toApiPayload, downloadJson } from '../utils/vendorUtils';
import { createCustomer, isApiConfigured } from '../services/langchaoApi';
import { validators, getInvalidEmails } from '../utils/validationUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './Toast';

import WelcomeStep from './steps/WelcomeStep';
import CompanyStep from './steps/CompanyStep';
import ContactStep from './steps/ContactStep';
import CurrencyStep from './steps/CurrencyStep';
import ProductStep from './steps/ProductStep';
import CustomizationStep from './steps/CustomizationStep';
import ShippingStep from './steps/ShippingStep';
import PcnStep from './steps/PcnStep';
import InvoiceStep from './steps/InvoiceStep';
import ReviewStep from './steps/ReviewStep';
import SuccessStep from './steps/SuccessStep';

interface VendorWizardProps {
  businessSupport?: string;
}

const initialFormData: VendorFormData = {
  businessSpecialist: '',
  companyLegalName: '',
  purchasingContactName: '',
  contactEmail: '',
  contactPhone: '',
  permanentContactNumber: '',
  transactionCurrency: '',
  companyLegalAddress: '',
  companyTaxId: '',
  espProductSelected: '',
  technicalServiceDetails: '',
  productVariant: '',
  productSoCVariant: '',
  customizationRequired: '',
  shippingAddress: '',
  consigneeContactName: '',
  consigneePhone: '',
  pcnNotificationEmails: '',
  pcnSpecialRequirements: false,
  pcnSpecialRequirementsDetails: '',
  invoiceReceivingEmail: '',
};

export default function VendorWizard({ businessSupport }: VendorWizardProps) {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [formData, setFormData] = useState<VendorFormData>({
    ...initialFormData,
    businessSpecialist: businessSupport || '',
  });
  const [submissionData, setSubmissionData] = useState<VendorSubmissionData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync businessSupport prop with formData when it changes (URL params load async)
  useEffect(() => {
    if (businessSupport) {
      setFormData(prev => ({ ...prev, businessSpecialist: businessSupport }));
    }
  }, [businessSupport]);

  const currentStepIndex = WIZARD_STEPS.findIndex(s => s.key === currentStep);

  const updateFormData = useCallback((updates: Partial<VendorFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Show info message for missing mandatory fields
  const showMandatoryFieldsAlert = (missingFields: string[]) => {
    const fieldList = missingFields.join(', ');
    showToast('info', `${t('validation.mandatoryFieldsAlert')}: ${fieldList}`);
  };

  // Show warning message for validation errors (red/warning style)
  const showValidationError = (message: string) => {
    showToast('warning', message);
  };

  const validateCurrentStep = (): boolean => {
    const missingFields: string[] = [];

    switch (currentStep) {
      case 'company':
        if (!validators.required(formData.companyLegalName)) {
          missingFields.push(t('company.companyName'));
        }
        if (missingFields.length > 0) {
          showMandatoryFieldsAlert(missingFields);
          return false;
        }
        return true;

      case 'contact':
        if (!validators.required(formData.purchasingContactName)) {
          missingFields.push(t('contact.contactName'));
        }
        if (!validators.required(formData.contactEmail)) {
          missingFields.push(t('contact.contactEmail'));
        } else if (!validators.email(formData.contactEmail)) {
          showValidationError(t('validation.emailInvalid'));
          return false;
        }
        if (!validators.required(formData.contactPhone)) {
          missingFields.push(t('contact.contactPhone'));
        } else if (!validators.phone(formData.contactPhone)) {
          showValidationError(t('validation.phoneInvalid'));
          return false;
        }
        if (missingFields.length > 0) {
          showMandatoryFieldsAlert(missingFields);
          return false;
        }
        return true;

      case 'currency':
        if (!validators.required(formData.transactionCurrency)) {
          missingFields.push(t('currency.selectCurrency'));
        }
        if (formData.transactionCurrency === 'USD' && !validators.required(formData.companyLegalAddress)) {
          missingFields.push(t('currency.addressTitle'));
        }
        if (formData.transactionCurrency === 'RMB' && !validators.required(formData.companyTaxId)) {
          missingFields.push(t('currency.taxIdTitle'));
        }
        if (missingFields.length > 0) {
          showMandatoryFieldsAlert(missingFields);
          return false;
        }
        return true;

      case 'product':
        if (!validators.required(formData.espProductSelected)) {
          missingFields.push(t('product.productLabel'));
        }
        if (formData.espProductSelected === TECHNICAL_SERVICE_VALUE) {
          if (!validators.required(formData.technicalServiceDetails)) {
            missingFields.push(t('product.technicalServiceLabel'));
          }
        }
        if (missingFields.length > 0) {
          showMandatoryFieldsAlert(missingFields);
          return false;
        }
        return true;

      case 'customization':
        if (!validators.required(formData.customizationRequired)) {
          missingFields.push(t('customization.cardTitle'));
        }
        if (missingFields.length > 0) {
          showMandatoryFieldsAlert(missingFields);
          return false;
        }
        return true;

      case 'shipping':
        if (!validators.required(formData.shippingAddress)) {
          missingFields.push(t('shipping.address'));
        }
        if (!validators.required(formData.consigneeContactName)) {
          missingFields.push(t('shipping.consigneeName'));
        }
        if (!validators.required(formData.consigneePhone)) {
          missingFields.push(t('shipping.consigneePhone'));
        } else if (!validators.phone(formData.consigneePhone)) {
          showValidationError(t('validation.phoneInvalid'));
          return false;
        }
        if (missingFields.length > 0) {
          showMandatoryFieldsAlert(missingFields);
          return false;
        }
        return true;

      case 'pcn':
        if (!validators.required(formData.pcnNotificationEmails)) {
          missingFields.push(t('pcn.email'));
        } else if (!validators.multipleEmails(formData.pcnNotificationEmails)) {
          const invalidEmails = getInvalidEmails(formData.pcnNotificationEmails);
          showValidationError(t('validation.emailInvalid') + (invalidEmails.length > 0 ? ': ' + invalidEmails.join(', ') : ''));
          return false;
        }
        if (formData.pcnSpecialRequirements && !validators.required(formData.pcnSpecialRequirementsDetails)) {
          missingFields.push(t('pcn.specifyRequirements'));
        }
        if (missingFields.length > 0) {
          showMandatoryFieldsAlert(missingFields);
          return false;
        }
        return true;

      case 'invoice':
        if (!validators.required(formData.invoiceReceivingEmail)) {
          missingFields.push(t('invoice.email'));
        } else if (!validators.email(formData.invoiceReceivingEmail)) {
          showValidationError(t('validation.emailInvalid'));
          return false;
        }
        if (missingFields.length > 0) {
          showMandatoryFieldsAlert(missingFields);
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (!validateCurrentStep()) return;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < WIZARD_STEPS.length) {
      setCurrentStep(WIZARD_STEPS[nextIndex].key);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(WIZARD_STEPS[prevIndex].key);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const vendorId = generateVendorId();
      const submission = prepareSubmissionData(formData, vendorId);
      setSubmissionData(submission);

      const jsonData = toJsonFormat(submission);
      console.log('Submission data (full):', jsonData);

      // Check if API is configured
      if (isApiConfigured()) {
        // Call the Langchao API
        const apiPayload = toApiPayload(submission);
        console.log('API payload:', apiPayload);

        const response = await createCustomer(apiPayload);

        if (response.success) {
          console.log('Customer created successfully:', response.data);
          showToast('success', t('validation.submitSuccess'));
          setCurrentStep('success');
        } else {
          console.error('API error:', response.error);
          showToast('error', `${t('validation.submitError')}: ${response.error?.message || 'Unknown error'}`);
          // Still show success step with download option even if API fails
          // User can manually submit the JSON later
          setCurrentStep('success');
        }
      } else {
        // API not configured - just simulate success and allow JSON download
        console.log('API not configured - skipping API call');
        await new Promise(resolve => setTimeout(resolve, 500));
        showToast('success', t('validation.submitSuccess'));
        setCurrentStep('success');
      }
    } catch (error) {
      console.error('Submission error:', error);
      showToast('error', t('validation.submitError'));
      // Still allow user to proceed to success step to download JSON
      setCurrentStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadJson = () => {
    if (submissionData) {
      const jsonData = toJsonFormat(submissionData);
      downloadJson(jsonData, `vendor_setup_${submissionData.vendorId}.json`);
    }
  };

  const handleRestart = () => {
    setFormData({
      ...initialFormData,
      businessSpecialist: businessSupport || '',
    });
    setSubmissionData(null);
    setCurrentStep('welcome');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep businessSupport={businessSupport} />;
      case 'company':
        return <CompanyStep data={formData} onChange={updateFormData} />;
      case 'contact':
        return <ContactStep data={formData} onChange={updateFormData} />;
      case 'currency':
        return <CurrencyStep data={formData} onChange={updateFormData} />;
      case 'product':
        return <ProductStep data={formData} onChange={updateFormData} />;
      case 'customization':
        return <CustomizationStep data={formData} onChange={updateFormData} />;
      case 'shipping':
        return <ShippingStep data={formData} onChange={updateFormData} />;
      case 'pcn':
        return <PcnStep data={formData} onChange={updateFormData} />;
      case 'invoice':
        return <InvoiceStep data={formData} onChange={updateFormData} />;
      case 'review':
        return <ReviewStep formData={formData} />;
      case 'success':
        return (
          <SuccessStep
            submissionData={submissionData!}
            onDownload={handleDownloadJson}
            onRestart={handleRestart}
          />
        );
      default:
        return null;
    }
  };

  const showNavigation = currentStep !== 'welcome' && currentStep !== 'success';
  const showSteps = currentStep !== 'welcome' && currentStep !== 'success';

  const getStepTitle = (step: typeof WIZARD_STEPS[number]) => {
    return language === 'zh' ? step.titleCn : step.title;
  };

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        {showSteps && (
          <div className="wizard-steps">
            <Steps
              current={currentStepIndex - 1}
              size="small"
              style={{ maxWidth: 900, margin: '0 auto' }}
            >
              {WIZARD_STEPS.slice(1, -1).map((step) => (
                <Steps.Step key={step.key} title={getStepTitle(step)} />
              ))}
            </Steps>
          </div>
        )}

        <div className="wizard-content">
          {renderStepContent()}
        </div>

        {showNavigation && (
          <div className="wizard-footer">
            <div className="progress-indicator">
              {t('common.step')} <span className="current">{currentStepIndex}</span> / {WIZARD_STEPS.length - 2}
            </div>

            <Space>
              {currentStepIndex > 1 && (
                <Button icon={<IconLeft />} onClick={goToPreviousStep}>
                  {t('common.back')}
                </Button>
              )}

              {currentStep === 'review' ? (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  status="success"
                >
                  {t('common.submit')}
                </Button>
              ) : (
                <Button type="primary" onClick={goToNextStep}>
                  {t('common.next')} <IconRight />
                </Button>
              )}
            </Space>
          </div>
        )}

        {currentStep === 'welcome' && (
          <div className="wizard-footer" style={{ justifyContent: 'center' }}>
            <Button type="primary" size="large" onClick={goToNextStep}>
              {t('common.getStarted')} <IconRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
