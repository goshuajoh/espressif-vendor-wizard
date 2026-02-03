import { Form, Input, Radio, Space, Alert } from '@arco-design/web-react';
import type { VendorFormData, Currency } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

const { TextArea } = Input;

interface CurrencyStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function CurrencyStep({ data, onChange }: CurrencyStepProps) {
  const { t } = useLanguage();

  const handleCurrencyChange = (value: Currency) => {
    onChange({ 
      transactionCurrency: value,
      companyLegalAddress: value === 'RMB' ? '' : data.companyLegalAddress,
      companyTaxId: value === 'USD' ? '' : data.companyTaxId,
    });
  };

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('currency.title')}</h3>
        
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label={t('currency.selectCurrency')} required>
            <Radio.Group value={data.transactionCurrency} onChange={handleCurrencyChange}>
              <Space direction="vertical" size="medium">
                <Radio value="RMB">
                  <span style={{ fontWeight: 500 }}>{t('currency.rmb')}</span>
                  <span style={{ color: 'var(--color-text-3)', marginLeft: 8 }}>{t('currency.rmbHint')}</span>
                </Radio>
                <Radio value="USD">
                  <span style={{ fontWeight: 500 }}>{t('currency.usd')}</span>
                  <span style={{ color: 'var(--color-text-3)', marginLeft: 8 }}>{t('currency.usdHint')}</span>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>

      {data.transactionCurrency === 'RMB' && (
        <div className="form-section">
          <Alert type="info" content={t('currency.taxIdAlert')} style={{ marginBottom: 16 }} />
          <Form layout="vertical" style={{ maxWidth: 600 }}>
            <Form.Item label={t('currency.taxIdTitle')} required extra={t('currency.taxIdHint')}>
              <Input
                placeholder={t('currency.taxIdPlaceholder')}
                value={data.companyTaxId}
                onChange={(value) => onChange({ companyTaxId: value })}
                size="large"
              />
            </Form.Item>
          </Form>
        </div>
      )}

      {data.transactionCurrency === 'USD' && (
        <div className="form-section">
          <Alert type="info" content={t('currency.addressAlert')} style={{ marginBottom: 16 }} />
          <Form layout="vertical" style={{ maxWidth: 600 }}>
            <Form.Item label={t('currency.addressTitle')} required extra={t('currency.addressHint')}>
              <TextArea
                placeholder={t('currency.addressPlaceholder')}
                value={data.companyLegalAddress}
                onChange={(value) => onChange({ companyLegalAddress: value })}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
