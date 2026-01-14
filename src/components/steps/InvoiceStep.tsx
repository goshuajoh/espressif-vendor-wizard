import { Form, Input, Typography } from '@arco-design/web-react';
import type { VendorFormData } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

interface InvoiceStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function InvoiceStep({ data, onChange }: InvoiceStepProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('invoice.title')}</h3>
        
        <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
          {t('invoice.description')}
        </Typography.Paragraph>
        
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label={t('invoice.email')} required extra={t('invoice.emailHint')}>
            <Input
              placeholder="finance@company.com"
              value={data.invoiceReceivingEmail}
              onChange={(value) => onChange({ invoiceReceivingEmail: value })}
              size="large"
              type="email"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
