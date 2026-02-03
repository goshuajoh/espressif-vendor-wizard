import { Typography, Alert } from '@arco-design/web-react';
import { IconUser, IconFile, IconApps, IconTool, IconClockCircle, IconUserAdd } from '@arco-design/web-react/icon';
import { useLanguage } from '../../contexts/LanguageContext';

interface WelcomeStepProps {
  businessSupport?: string;
}

export default function WelcomeStep({ businessSupport }: WelcomeStepProps) {
  const { t } = useLanguage();

  return (
    <div className="welcome-container">
      <div className="welcome-icon">
        <IconUserAdd />
      </div>
      
      <Typography.Title heading={3} className="welcome-title">
        {t('welcome.title')}
      </Typography.Title>
      
      {businessSupport && (
        <Alert
          type="info"
          content={<span>{t('welcome.businessSpecialist')}: <strong>{businessSupport}</strong></span>}
          style={{ maxWidth: 500, margin: '0 auto 24px auto' }}
        />
      )}
      
      <Typography.Paragraph className="welcome-description">
        {t('welcome.description')}
      </Typography.Paragraph>

      <div className="welcome-features">
        <div className="welcome-feature">
          <div className="welcome-feature-icon"><IconUser /></div>
          <h4>{t('welcome.features.company.title')}</h4>
          <p>{t('welcome.features.company.desc')}</p>
        </div>
        
        <div className="welcome-feature">
          <div className="welcome-feature-icon"><IconFile /></div>
          <h4>{t('welcome.features.currency.title')}</h4>
          <p>{t('welcome.features.currency.desc')}</p>
        </div>
        
        <div className="welcome-feature">
          <div className="welcome-feature-icon"><IconApps /></div>
          <h4>{t('welcome.features.product.title')}</h4>
          <p>{t('welcome.features.product.desc')}</p>
        </div>
        
        <div className="welcome-feature">
          <div className="welcome-feature-icon"><IconTool /></div>
          <h4>{t('welcome.features.shipping.title')}</h4>
          <p>{t('welcome.features.shipping.desc')}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--color-text-3)' }}>
        <IconClockCircle />
        <span>{t('welcome.estimatedTime')}</span>
      </div>
    </div>
  );
}
