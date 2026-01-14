import { Form, Input } from '@arco-design/web-react';
import type { VendorFormData } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

const { TextArea } = Input;

interface ShippingStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function ShippingStep({ data, onChange }: ShippingStepProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('shipping.title')}</h3>
        
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label={t('shipping.address')} required extra={t('shipping.addressHint')}>
            <TextArea
              placeholder={t('shipping.addressPlaceholder')}
              value={data.shippingAddress}
              onChange={(value) => onChange({ shippingAddress: value })}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          
          <Form.Item label={t('shipping.consigneeName')} required>
            <Input
              placeholder={t('shipping.consigneeNamePlaceholder')}
              value={data.consigneeContactName}
              onChange={(value) => onChange({ consigneeContactName: value })}
              size="large"
            />
          </Form.Item>
          
          <Form.Item label={t('shipping.consigneePhone')} required extra={t('shipping.consigneePhoneHint')}>
            <Input
              placeholder="+86 138xxxxxxxx"
              value={data.consigneePhone}
              onChange={(value) => onChange({ consigneePhone: value })}
              size="large"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
