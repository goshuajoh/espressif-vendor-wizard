import { Form, Select, Input, Typography, Divider } from '@arco-design/web-react';
import type { VendorFormData, ESPProduct } from '../../types/vendor';
import { ESP_PRODUCTS, PRODUCT_VARIANTS, SOC_VARIANTS } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

const { TextArea } = Input;

interface ProductStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function ProductStep({ data, onChange }: ProductStepProps) {
  const { t } = useLanguage();

  const handleProductChange = (value: ESPProduct) => {
    onChange({ 
      espProductSelected: value,
      productVariant: '',
      productSoCVariant: '',
      technicalServiceDetails: '',
    });
  };

  const isTechnicalService = data.espProductSelected === '技术服务 / Technical Service (e.g. 唤醒词定制, Wake up word customization)';
  const moduleVariants = data.espProductSelected && !isTechnicalService ? PRODUCT_VARIANTS[data.espProductSelected] || [] : [];
  const socVariants = data.espProductSelected && !isTechnicalService ? SOC_VARIANTS[data.espProductSelected] || [] : [];

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('product.title')}</h3>
        
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label={t('product.productFamily')} required>
            <Select
              placeholder={t('product.productFamilyPlaceholder')}
              value={data.espProductSelected || undefined}
              onChange={handleProductChange}
              size="large"
              showSearch
            >
              {ESP_PRODUCTS.map(product => (
                <Select.Option key={product} value={product}>{product}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>

      {isTechnicalService && (
        <div className="form-section">
          <h3 className="form-section-title">{t('product.technicalServiceTitle')}</h3>
          <Form layout="vertical" style={{ maxWidth: 600 }}>
            <Form.Item label={t('product.technicalServiceLabel')} required>
              <TextArea
                placeholder={t('product.technicalServicePlaceholder')}
                value={data.technicalServiceDetails}
                onChange={(value) => onChange({ technicalServiceDetails: value })}
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </Form.Item>
          </Form>
        </div>
      )}

      {!isTechnicalService && data.espProductSelected && moduleVariants.length > 0 && (
        <div className="form-section">
          <h3 className="form-section-title">{data.espProductSelected} {t('product.moduleVariant')}</h3>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
            {t('product.moduleVariantHint')}
          </Typography.Paragraph>
          <Form layout="vertical" style={{ maxWidth: 600 }}>
            <Form.Item label={t('product.moduleVariant')}>
              <Select
                placeholder={t('product.moduleVariantPlaceholder')}
                value={data.productVariant || undefined}
                onChange={(value) => onChange({ productVariant: value })}
                size="large"
                allowClear
                showSearch
              >
                {moduleVariants.map(variant => (
                  <Select.Option key={variant} value={variant}>{variant}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      )}

      {!isTechnicalService && data.espProductSelected && socVariants.length > 0 && (
        <div className="form-section">
          <Divider style={{ margin: '8px 0 24px 0' }} />
          <h3 className="form-section-title">{data.espProductSelected} {t('product.socVariant')}</h3>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
            {t('product.socVariantHint')}
          </Typography.Paragraph>
          <Form layout="vertical" style={{ maxWidth: 600 }}>
            <Form.Item label={t('product.socVariant')}>
              <Select
                placeholder={t('product.socVariantPlaceholder')}
                value={data.productSoCVariant || undefined}
                onChange={(value) => onChange({ productSoCVariant: value })}
                size="large"
                allowClear
                showSearch
              >
                {socVariants.map(variant => (
                  <Select.Option key={variant} value={variant}>{variant}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      )}

      {!data.espProductSelected && (
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 32 }}>
          {t('product.selectProductFirst')}
        </Typography.Paragraph>
      )}
    </div>
  );
}
