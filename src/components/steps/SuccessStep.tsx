import { Button, Space, Typography, Divider, Tag } from '@arco-design/web-react';
import { IconCheckCircleFill, IconDownload, IconRefresh, IconEmail } from '@arco-design/web-react/icon';
import type { VendorSubmissionData } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

interface SuccessStepProps {
  submissionData: VendorSubmissionData;
  onDownload: () => void;
  onRestart: () => void;
}

export default function SuccessStep({ submissionData, onDownload, onRestart }: SuccessStepProps) {
  const { t } = useLanguage();

  return (
    <div className="success-container">
      <div className="success-icon">
        <IconCheckCircleFill />
      </div>
      
      <Typography.Title heading={3} className="success-title">
        {t('success.title')}
      </Typography.Title>
      
      <Typography.Paragraph className="success-description">
        {t('success.description')}
      </Typography.Paragraph>

      <div className="vendor-id-card">
        <div className="vendor-id-label">{t('success.vendorId')}</div>
        <div className="vendor-id-value">{submissionData.vendorId}</div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Typography.Text type="secondary">{t('success.assignedVendor')}: </Typography.Text>
        <Tag 
          color={submissionData.assignedVendor === 'LX' ? 'blue' : submissionData.assignedVendor === 'LXX' ? 'green' : 'orange'}
          size="large"
        >
          {submissionData.assignedVendor}
        </Tag>
      </div>

      <Space size="medium" style={{ marginBottom: 32 }}>
        <Button type="primary" icon={<IconDownload />} onClick={onDownload} size="large">
          {t('common.downloadJson')}
        </Button>
        <Button icon={<IconRefresh />} onClick={onRestart} size="large">
          {t('common.submitAnother')}
        </Button>
      </Space>

      <Divider />

      <div className="next-steps">
        <h4>{t('success.nextSteps')}</h4>
        <ol className="next-steps-list">
          <li>
            <span className="step-number">1</span>
            <span>{t('success.step1')}</span>
          </li>
          <li>
            <span className="step-number">2</span>
            <span>{t('success.step2')} <strong>{submissionData.contactEmail}</strong></span>
          </li>
          <li>
            <span className="step-number">3</span>
            <span>{t('success.step3')}</span>
          </li>
        </ol>

        {submissionData.customizationRequired && (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <h4>{t('success.customizationFollowup')}</h4>
            <Typography.Paragraph type="secondary">
              {t('success.customizationFollowupDesc')}
            </Typography.Paragraph>
          </>
        )}
      </div>

      <Divider />

      <div style={{ color: 'var(--color-text-3)', fontSize: 14 }}>
        <p>{t('success.needHelp')}</p>
        <p>
          <IconEmail style={{ marginRight: 8 }} />
          <a href="mailto:sales@espressif.com">sales@espressif.com</a>
        </p>
        <p>
          <strong>{t('success.referenceId')}:</strong> {submissionData.vendorId}
        </p>
      </div>
    </div>
  );
}
