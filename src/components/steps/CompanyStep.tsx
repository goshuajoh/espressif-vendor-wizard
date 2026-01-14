import { Form, Input } from '@arco-design/web-react';
import type { VendorFormData } from '../../types/vendor';
import { useLanguage } from '../../contexts/LanguageContext';

interface CompanyStepProps {
  data: VendorFormData;
  onChange: (updates: Partial<VendorFormData>) => void;
}

export default function CompanyStep({ data, onChange }: CompanyStepProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">{t('company.title')}</h3>
        
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item 
            label={t('company.companyName')}
            required
            extra={t('company.companyNameHint')}
          >
            <Input
              placeholder={t('company.companyNamePlaceholder')}
              value={data.companyLegalName}
              onChange={(value) => onChange({ companyLegalName: value })}
              size="large"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
