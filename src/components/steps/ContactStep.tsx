import { Form, Input } from '@arco-design/web-react';
import type { VendorFormData } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContactStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function ContactStep({ data, onChange }: ContactStepProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('contact.title')}</h3>
        
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label={t('contact.contactName')} required>
            <Input
              placeholder={t('contact.contactNamePlaceholder')}
              value={data.purchasingContactName}
              onChange={(value) => onChange({ purchasingContactName: value })}
              size="large"
            />
          </Form.Item>
          
          <Form.Item label={t('contact.contactEmail')} required>
            <Input
              placeholder="example@company.com"
              value={data.contactEmail}
              onChange={(value) => onChange({ contactEmail: value })}
              size="large"
              type="email"
            />
          </Form.Item>
          
          <Form.Item label={t('contact.contactPhone')} required extra={t('contact.contactPhoneHint')}>
            <Input
              placeholder="+86 138xxxxxxxx"
              value={data.contactPhone}
              onChange={(value) => onChange({ contactPhone: value })}
              size="large"
            />
          </Form.Item>
          
          <Form.Item label={t('contact.permanentPhone')} required extra={t('contact.permanentPhoneHint')}>
            <Input
              placeholder="021-xxxxxxxx"
              value={data.permanentContactNumber}
              onChange={(value) => onChange({ permanentContactNumber: value })}
              size="large"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
