import { Typography, Select, Form } from '@arco-design/web-react';
import type { VendorFormData, CustomizationOption } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

interface CustomizationStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function CustomizationStep({ data, onChange }: CustomizationStepProps) {
  const { t } = useLanguage();

  const options: { value: CustomizationOption; label: string }[] = [
    { value: 'yes', label: t('customization.optionYes') },
    { value: 'no', label: t('customization.optionNo') },
    { value: 'not_sure', label: t('customization.optionNotSure') },
  ];

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('customization.title')}</h3>

        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label={t('customization.cardTitle')} required>
            <Select
              placeholder={t('customization.selectPlaceholder')}
              value={data.customizationRequired || undefined}
              onChange={(value: CustomizationOption) => onChange({ customizationRequired: value })}
              size="large"
            >
              {options.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 16 }}>
          {t('customization.cardDescription')}
        </Typography.Paragraph>

        <ul style={{ margin: '12px 0 0 0', paddingLeft: 20, color: 'var(--color-text-3)', fontSize: 13 }}>
          <li>{t('customization.services.preprogramming')}</li>
          <li>{t('customization.services.preprovisioning')}</li>
          <li>{t('customization.services.matter')}</li>
          <li>{t('customization.services.firmware')}</li>
          <li>{t('customization.services.security')}</li>
        </ul>

        <Typography.Paragraph type="secondary" style={{ marginTop: 16, maxWidth: 600 }}>
          {t('customization.hint')}
        </Typography.Paragraph>
      </div>
    </div>
  );
}
