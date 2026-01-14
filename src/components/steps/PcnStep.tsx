import { Form, Input, Radio, Space, Typography } from '@arco-design/web-react';
import type { VendorFormData } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

const { TextArea } = Input;

interface PcnStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function PcnStep({ data, onChange }: PcnStepProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('pcn.title')}</h3>
        
        <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
          {t('pcn.description')}
        </Typography.Paragraph>
        
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label={t('pcn.email')} required extra={t('pcn.emailHint')}>
            <Input
              placeholder="email1@company.com, email2@company.com"
              value={data.pcnNotificationEmails}
              onChange={(value) => onChange({ pcnNotificationEmails: value })}
              size="large"
            />
          </Form.Item>
          
          <Form.Item label={t('pcn.specialRequirements')}>
            <Radio.Group 
              value={data.pcnSpecialRequirements} 
              onChange={(value) => onChange({ 
                pcnSpecialRequirements: value,
                pcnSpecialRequirementsDetails: value ? data.pcnSpecialRequirementsDetails : '',
              })}
            >
              <Space direction="vertical" size="medium">
                <Radio value={false}>{t('common.no')} - {t('pcn.noSpecialRequirements')}</Radio>
                <Radio value={true}>{t('common.yes')} - {t('pcn.hasSpecialRequirements')}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          
          {data.pcnSpecialRequirements && (
            <Form.Item label={t('pcn.specifyRequirements')} required>
              <TextArea
                placeholder={t('pcn.specifyRequirementsPlaceholder')}
                value={data.pcnSpecialRequirementsDetails}
                onChange={(value) => onChange({ pcnSpecialRequirementsDetails: value })}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}
