import { Form, Select, Input, Typography } from '@arco-design/web-react';
import type { VendorFormData } from '../../types/vendor';
import { PRODUCT_CATALOG, TECHNICAL_SERVICE_VALUE } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

const { TextArea } = Input;
const { OptGroup, Option } = Select;

interface ProductStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function ProductStep({ data, onChange }: ProductStepProps) {
  const { t } = useLanguage();

  const handleProductChange = (value: string) => {
    onChange({
      espProductSelected: value as any,
      productVariant: '',
      productSoCVariant: '',
      technicalServiceDetails: '',
    });
  };

  const isTechnicalService = data.espProductSelected === TECHNICAL_SERVICE_VALUE;

  // Build the grouped options for the select
  const renderOptions = () => {
    const options: React.ReactNode[] = [];

    // Add technical service option first
    options.push(
      <Option key="technical-service" value={TECHNICAL_SERVICE_VALUE}>
        {t('product.technicalServiceOption')}
      </Option>
    );

    // Add product families with their groups
    for (const family of PRODUCT_CATALOG) {
      // Add family header as disabled option (visual separator)
      options.push(
        <OptGroup key={`family-${family.family}`} label={family.family}>
          {family.groups.map(group => (
            group.products.map(product => (
              <Option key={product} value={product}>
                {product} <span style={{ color: 'var(--color-text-3)', fontSize: 12 }}>({group.label})</span>
              </Option>
            ))
          )).flat()}
        </OptGroup>
      );
    }

    return options;
  };

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('product.title')}</h3>

        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label={t('product.productLabel')} required>
            <Select
              placeholder={t('product.productPlaceholder')}
              value={data.espProductSelected || undefined}
              onChange={handleProductChange}
              size="large"
              showSearch
              filterOption={(inputValue, option) => {
                // Search by option value (product name)
                const value = (option as any)?.props?.value as string;
                return value?.toLowerCase().includes(inputValue.toLowerCase()) ?? false;
              }}
            >
              {renderOptions()}
            </Select>
          </Form.Item>
        </Form>

        {!data.espProductSelected && (
          <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 32 }}>
            {t('product.selectProductFirst')}
          </Typography.Paragraph>
        )}
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
    </div>
  );
}
