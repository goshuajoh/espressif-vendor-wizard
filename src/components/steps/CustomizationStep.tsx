import { Typography, Switch } from '@arco-design/web-react';
import { IconCheck, IconClose } from '@arco-design/web-react/icon';
import type { VendorFormData } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

interface CustomizationStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function CustomizationStep({ data, onChange }: CustomizationStepProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('customization.title')}</h3>
        
        <div 
          className={`service-card ${data.customizationRequired ? 'selected' : ''}`}
          onClick={() => onChange({ customizationRequired: !data.customizationRequired })}
          style={{ maxWidth: 600, cursor: 'pointer' }}
        >
          <div className="service-card-header">
            <span className="service-card-title">{t('customization.cardTitle')}</span>
            <Switch 
              checked={data.customizationRequired}
              checkedIcon={<IconCheck />}
              uncheckedIcon={<IconClose />}
              onChange={(checked, e) => {
                e.stopPropagation();
                onChange({ customizationRequired: checked });
              }}
            />
          </div>
          <p className="service-card-description">{t('customization.cardDescription')}</p>
          <ul style={{ margin: '12px 0 0 0', paddingLeft: 20, color: 'var(--color-text-3)', fontSize: 13 }}>
            <li>{t('customization.services.preprogramming')}</li>
            <li>{t('customization.services.preprovisioning')}</li>
            <li>{t('customization.services.matter')}</li>
            <li>{t('customization.services.firmware')}</li>
            <li>{t('customization.services.security')}</li>
          </ul>
        </div>

        <Typography.Paragraph type="secondary" style={{ marginTop: 16, maxWidth: 600 }}>
          {t('customization.hint')}
        </Typography.Paragraph>
      </div>
    </div>
  );
}
