import { Tag, Typography, Alert } from '@arco-design/web-react';
import { IconCheck, IconClose } from '@arco-design/web-react/icon';
import type { VendorFormData } from '../../types/vendor';
import { assignVendor } from '../../utils/vendorUtils';
import { useLanguage } from '../../contexts/LanguageContext';

interface ReviewStepProps {
  formData: VendorFormData;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  const { t } = useLanguage();
  const { vendor, reason } = assignVendor(formData);

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
              <br />
              <span style={{ color: 'var(--color-text-3)', fontSize: 13 }}>
                {t('review.reason')}: {reason}
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
            value={<Tag color={formData.transactionCurrency === 'RMB' ? 'red' : 'green'}>{formData.transactionCurrency}</Tag>} 
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
          <ReviewItem label={t('review.fields.productFamily')} value={formData.espProductSelected} />
          {formData.productVariant && (
            <ReviewItem label={t('review.fields.moduleVariant')} value={formData.productVariant} />
          )}
          {formData.productSoCVariant && (
            <ReviewItem label={t('review.fields.socVariant')} value={formData.productSoCVariant} />
          )}
          {formData.technicalServiceDetails && (
            <ReviewItem label={t('review.fields.technicalService')} value={formData.technicalServiceDetails} />
          )}
        </div>

        <div className="review-section">
          <div className="review-section-title">{t('review.sections.customization')}</div>
          <ReviewItem label={t('review.fields.customizationRequired')} value={<BooleanBadge value={formData.customizationRequired} />} />
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
