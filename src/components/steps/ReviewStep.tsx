import { useState, useEffect } from 'react';
import { Tag, Typography, Alert, Spin } from '@arco-design/web-react';
import { IconCheck, IconClose } from '@arco-design/web-react/icon';
import type { VendorFormData, Currency, CustomizationOption } from '../../types/vendor';
import { VENDOR_ORG_ID_MAP } from '../../types/vendor';
import { assignVendor, extractCountryFromAddress, getCurrencyName } from '../../utils/vendorUtils';
import { getChineseCountryFromAddress } from '../../services/countryService';
import { useLanguage } from '../../contexts/LanguageContext';

interface ReviewStepProps {
  formData: VendorFormData;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  const { t } = useLanguage();
  const { vendor, reason } = assignVendor(formData);

  // State for async country lookup
  const [detectedCountry, setDetectedCountry] = useState<string>('');
  const [isLoadingCountry, setIsLoadingCountry] = useState(true);

  // Calculate derived values that will be sent to API
  const orgId = VENDOR_ORG_ID_MAP[vendor];
  const addressForCountry = formData.transactionCurrency === 'RMB'
    ? formData.shippingAddress
    : (formData.companyLegalAddress || formData.shippingAddress);
  const currencyName = getCurrencyName(formData.transactionCurrency as Currency);

  // Fetch country name using the  service API
  useEffect(() => {
    let isMounted = true;

    async function fetchCountry() {
      setIsLoadingCountry(true);
      try {
        // Try the API-based country lookup first
        const country = await getChineseCountryFromAddress(addressForCountry);
        if (isMounted) {
          // Fall back to local lookup if API returns empty
          setDetectedCountry(country || extractCountryFromAddress(addressForCountry));
        }
      } catch (error) {
        console.error('Country lookup failed:', error);
        if (isMounted) {
          // Use local fallback on error
          setDetectedCountry(extractCountryFromAddress(addressForCountry));
        }
      } finally {
        if (isMounted) {
          setIsLoadingCountry(false);
        }
      }
    }

    fetchCountry();

    return () => {
      isMounted = false;
    };
  }, [addressForCountry]);

  const ReviewItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="review-item">
      <span className="review-label">{label}</span>
      <span className="review-value">{value || '-'}</span>
    </div>
  );

  const BooleanBadge = ({ value }: { value: boolean }) => (
    <Tag color={value ? 'green' : 'gray'} icon={value ? <IconCheck /> : <IconClose />}>
      {value ? t('common.yes') : t('common.no')}
    </Tag>
  );

  const CustomizationBadge = ({ value }: { value: CustomizationOption | '' }) => {
    const colors: Record<string, string> = {
      'yes': 'green',
      'no': 'gray',
      'not_sure': 'orange',
    };
    const labels: Record<string, string> = {
      'yes': t('customization.optionYes'),
      'no': t('customization.optionNo'),
      'not_sure': t('customization.optionNotSure'),
    };
    return (
      <Tag color={colors[value] || 'gray'}>
        {labels[value] || '-'}
      </Tag>
    );
  };

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('review.title')}</h3>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
          {t('review.description')}
        </Typography.Paragraph>

        <Alert
          type="info"
          title={t('review.vendorAssignment')}
          content={
            <div>
              <strong>{t('review.assignedVendor')}: </strong>
              <Tag color={vendor === 'LX' ? 'blue' : vendor === 'LXX' ? 'green' : 'orange'}>{vendor}</Tag>
              <Tag color="arcoblue" style={{ marginLeft: 8 }}>Org ID: {orgId}</Tag>
              <br />
              <span style={{ color: 'var(--color-text-3)', fontSize: 13 }}>
                {t('review.reason')}: {reason}
              </span>
              <br />
              <span style={{ color: 'var(--color-text-3)', fontSize: 13 }}>
                {t('review.fields.country')}:{' '}
                {isLoadingCountry ? (
                  <Spin size={12} style={{ marginLeft: 4 }} />
                ) : (
                  <Tag size="small">{detectedCountry || t('review.countryNotDetected')}</Tag>
                )}
              </span>
            </div>
          }
          style={{ marginBottom: 24 }}
        />

        <div className="review-section">
          <div className="review-section-title">{t('review.sections.company')}</div>
          <ReviewItem label={t('review.fields.companyName')} value={formData.companyLegalName} />
          {formData.businessSpecialist && (
            <ReviewItem label={t('review.fields.businessSpecialist')} value={formData.businessSpecialist} />
          )}
        </div>

        <div className="review-section">
          <div className="review-section-title">{t('review.sections.contact')}</div>
          <ReviewItem label={t('review.fields.contactName')} value={formData.purchasingContactName} />
          <ReviewItem label={t('review.fields.email')} value={formData.contactEmail} />
          <ReviewItem label={t('review.fields.phone')} value={formData.contactPhone} />
          {formData.permanentContactNumber && (
            <ReviewItem label={t('review.fields.permanentPhone')} value={formData.permanentContactNumber} />
          )}
        </div>

        <div className="review-section">
          <div className="review-section-title">{t('review.sections.currency')}</div>
          <ReviewItem
            label={t('review.fields.currency')}
            value={
              <>
                <Tag color={formData.transactionCurrency === 'RMB' ? 'red' : 'green'}>{formData.transactionCurrency}</Tag>
                <span style={{ marginLeft: 8, color: 'var(--color-text-3)', fontSize: 13 }}>
                  (API: {currencyName})
                </span>
              </>
            }
          />
          {formData.transactionCurrency === 'RMB' && (
            <ReviewItem label={t('review.fields.taxId')} value={formData.companyTaxId} />
          )}
          {formData.transactionCurrency === 'USD' && (
            <ReviewItem label={t('review.fields.legalAddress')} value={formData.companyLegalAddress} />
          )}
        </div>

        <div className="review-section">
          <div className="review-section-title">{t('review.sections.product')}</div>
          <ReviewItem label={t('product.productLabel')} value={formData.espProductSelected} />
          {formData.technicalServiceDetails && (
            <ReviewItem label={t('review.fields.technicalService')} value={formData.technicalServiceDetails} />
          )}
        </div>

        <div className="review-section">
          <div className="review-section-title">{t('review.sections.customization')}</div>
          <ReviewItem label={t('review.fields.customizationRequired')} value={<CustomizationBadge value={formData.customizationRequired} />} />
        </div>

        <div className="review-section">
          <div className="review-section-title">{t('review.sections.shipping')}</div>
          <ReviewItem label={t('review.fields.shippingAddress')} value={formData.shippingAddress} />
          <ReviewItem label={t('review.fields.consigneeName')} value={formData.consigneeContactName} />
          <ReviewItem label={t('review.fields.consigneePhone')} value={formData.consigneePhone} />
        </div>

        <div className="review-section">
          <div className="review-section-title">{t('review.sections.pcn')}</div>
          <ReviewItem label={t('review.fields.pcnEmail')} value={formData.pcnNotificationEmails} />
          <ReviewItem label={t('review.fields.pcnSpecialRequirements')} value={<BooleanBadge value={formData.pcnSpecialRequirements} />} />
          {formData.pcnSpecialRequirements && formData.pcnSpecialRequirementsDetails && (
            <ReviewItem label={t('review.fields.pcnDetails')} value={formData.pcnSpecialRequirementsDetails} />
          )}
        </div>

        <div className="review-section">
          <div className="review-section-title">{t('review.sections.invoice')}</div>
          <ReviewItem label={t('review.fields.invoiceEmail')} value={formData.invoiceReceivingEmail} />
        </div>
      </div>
    </div>
  );
}
