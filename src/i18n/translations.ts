export type Language = 'zh' | 'en';

export const translations = {
  // Common
  common: {
    next: { zh: '下一步', en: 'Next' },
    back: { zh: '上一步', en: 'Back' },
    submit: { zh: '提交', en: 'Submit' },
    getStarted: { zh: '开始', en: 'Get Started' },
    step: { zh: '步骤', en: 'Step' },
    yes: { zh: '是', en: 'Yes' },
    no: { zh: '否', en: 'No' },
    required: { zh: '必填', en: 'Required' },
    optional: { zh: '可选', en: 'Optional' },
    download: { zh: '下载', en: 'Download' },
    downloadJson: { zh: '下载JSON', en: 'Download JSON' },
    submitAnother: { zh: '新建提交', en: 'Submit Another' },
  },

  // Header
  header: {
    title: { zh: '客户建档', en: 'Customer Registration' },
    language: { zh: 'English', en: '中文' },
  },

  // Sidebar menu
  menu: {
    dashboard: { zh: '仪表盘', en: 'Dashboard' },
    home: { zh: '首页', en: 'Home' },
    userCenter: { zh: '用户中心', en: 'User Center' },
    userSetting: { zh: '用户设置', en: 'User Setting' },
    account: { zh: '账户', en: 'Account' },
    application: { zh: '应用', en: 'Application' },
    customer: { zh: '客户', en: 'Customer' },
    requirement: { zh: '需求', en: 'Requirement' },
    production: { zh: '生产', en: 'Production' },
    service: { zh: '服务', en: 'Service' },
    waferVersion: { zh: '晶圆版本', en: 'Wafer Version' },
    workOrder: { zh: '工单', en: 'Work Order' },
  },

  // Wizard steps
  steps: {
    welcome: { zh: '欢迎', en: 'Welcome' },
    company: { zh: '公司信息', en: 'Company' },
    contact: { zh: '联系人', en: 'Contact' },
    currency: { zh: '币种', en: 'Currency' },
    product: { zh: '产品', en: 'Product' },
    customization: { zh: '定制服务', en: 'Customization' },
    shipping: { zh: '收货信息', en: 'Shipping' },
    pcn: { zh: 'PCN通知', en: 'PCN' },
    invoice: { zh: '发票', en: 'Invoice' },
    review: { zh: '确认', en: 'Review' },
    complete: { zh: '完成', en: 'Complete' },
  },

  // Welcome step
  welcome: {
    title: { zh: '欢迎使用乐鑫客户建档系统', en: 'Welcome to Espressif Customer Registration' },
    subtitle: { zh: '乐鑫供应商注册', en: 'Espressif Vendor Registration' },
    businessSpecialist: { zh: '您的乐鑫商务对接人', en: 'Your Espressif Business Specialist' },
    description: { zh: '本向导将引导您完成乐鑫供应商账户注册流程。', en: 'This wizard will guide you through the Espressif vendor account registration process.' },
    estimatedTime: { zh: '预计时间：5-10 分钟', en: 'Estimated time: 5-10 minutes' },
    features: {
      company: { title: { zh: '公司信息', en: 'Company Info' }, desc: { zh: '公司名称、联系方式', en: 'Company name, contact details' } },
      currency: { title: { zh: '币种选择', en: 'Currency' }, desc: { zh: '交易币种、税务信息', en: 'Transaction currency, tax info' } },
      product: { title: { zh: '产品选择', en: 'Product Selection' }, desc: { zh: '选择所需的ESP产品', en: 'Select ESP products' } },
      shipping: { title: { zh: '收货与发票', en: 'Shipping & Invoice' }, desc: { zh: '收货地址、发票信息', en: 'Shipping, invoice details' } },
    },
  },

  // Company step
  company: {
    title: { zh: '公司信息', en: 'Company Information' },
    companyName: { zh: '贵公司官方全称', en: 'Your Company Legal Name' },
    companyNamePlaceholder: { zh: '例如：深圳市XXX科技有限公司', en: 'e.g.: ABC Technology Co., Ltd.' },
    companyNameHint: { zh: '请填写公司完整注册名称', en: "Enter your company's full registered name" },
  },

  // Contact step
  contact: {
    title: { zh: '采购联系人信息', en: 'Purchasing Contact Information' },
    contactName: { zh: '采购联系人', en: 'Purchasing Contact Name' },
    contactNamePlaceholder: { zh: '请输入姓名', en: 'Enter name' },
    contactEmail: { zh: '采购联系人邮箱', en: 'Contact Email' },
    contactPhone: { zh: '采购联系人电话', en: 'Contact Phone Number' },
    contactPhoneHint: { zh: '包含国家代码（例如：+86 138xxxx）', en: 'Include country code (e.g., +86 138xxxx)' },
    permanentPhone: { zh: '固定联系电话', en: 'Permanent Contact Number' },
    permanentPhoneHint: { zh: '请确保我们始终可以通过此号码联系到贵公司', en: 'Please make sure we can always reach your company via this number.' },
  },

  // Currency step
  currency: {
    title: { zh: '交易币种', en: 'Transaction Currency' },
    selectCurrency: { zh: '交易币种', en: 'Transaction Currency' },
    rmb: { zh: 'RMB 人民币', en: 'RMB (Chinese Yuan)' },
    rmbHint: { zh: '适用于中国大陆客户', en: 'For Mainland China customers' },
    usd: { zh: 'USD 美元', en: 'USD (US Dollar)' },
    usdHint: { zh: '适用于海外客户', en: 'For overseas customers' },
    taxIdTitle: { zh: '贵公司开票税号', en: 'Your Company Tax ID' },
    taxIdHint: { zh: '统一社会信用代码', en: 'Unified Social Credit Code' },
    taxIdPlaceholder: { zh: '例如：91440300MA5HAG2F5P', en: 'e.g.: 91440300MA5HAG2F5P' },
    taxIdAlert: { zh: '人民币交易需要提供公司税号', en: 'RMB transactions require company tax ID' },
    addressTitle: { zh: '贵公司法定注册地址', en: 'Your Company Legal Address' },
    addressHint: { zh: '完整地址，包括国家', en: 'Full address including country' },
    addressPlaceholder: { zh: '例如：123 Main Street, Suite 100, City, State, Country, ZIP', en: '123 Main Street, Suite 100, City, State, Country, ZIP' },
    addressAlert: { zh: '美元交易需要提供公司法定注册地址', en: 'USD transactions require company legal address' },
  },

  // Product step
  product: {
    title: { zh: '乐鑫产品型号', en: 'ESP Product Selected' },
    productLabel: { zh: '产品型号', en: 'Product' },
    productPlaceholder: { zh: '请选择产品', en: 'Please select a product' },
    productFamily: { zh: '产品系列', en: 'Product Family' },
    productFamilyPlaceholder: { zh: '请选择产品系列', en: 'Select product family' },
    moduleVariant: { zh: '模组型号', en: 'Module Variant' },
    moduleVariantPlaceholder: { zh: '请选择模组型号', en: 'Select module variant' },
    moduleVariantHint: { zh: '选择模组型号（如需要）', en: 'Select module variant (if needed)' },
    socVariant: { zh: '芯片型号', en: 'SoC Variant' },
    socVariantPlaceholder: { zh: '请选择芯片型号', en: 'Select SoC variant' },
    socVariantHint: { zh: '选择芯片型号（如需要）', en: 'Select SoC/chip variant (if needed)' },
    technicalServiceOption: { zh: '技术服务 / Technical Service (e.g. 唤醒词定制, Wake up word customization)', en: 'Technical Service (e.g. Wake up word customization)' },
    technicalServiceTitle: { zh: '技术服务详情', en: 'Technical Service Details' },
    technicalServiceLabel: { zh: '请具体说明所需的技术服务', en: 'Please specify Technical Service required' },
    technicalServicePlaceholder: { zh: '例如：唤醒词定制、语音识别服务等', en: 'e.g.: Wake up word customization, voice recognition service, etc.' },
    selectProductFirst: { zh: '请选择一个产品', en: 'Please select a product' },
  },

  // Customization step
  customization: {
    title: { zh: '是否需要定制服务', en: 'Customization Service Required' },
    cardTitle: { zh: '定制服务', en: 'Customization Service' },
    cardDescription: { zh: '预烧录/预配置/Matter等', en: 'Pre-programming / Pre-provisioning / Matter etc.' },
    selectPlaceholder: { zh: '请选择', en: 'Please select' },
    optionYes: { zh: '是 - 需要定制服务', en: 'Yes - Customization required' },
    optionNo: { zh: '否 - 不需要定制服务', en: 'No - No customization needed' },
    optionNotSure: { zh: '暂不确定', en: 'I am not sure yet' },
    services: {
      preprogramming: { zh: '预烧录服务', en: 'Pre-programming service' },
      preprovisioning: { zh: '预配置服务', en: 'Pre-provisioning service' },
      matter: { zh: 'Matter认证配置', en: 'Matter certification setup' },
      firmware: { zh: '自定义固件', en: 'Custom firmware' },
      security: { zh: '安全证书配置', en: 'Security certificate configuration' },
    },
    hint: { zh: '如果您需要以上定制服务，请选择"是"。如果暂不确定，可以选择"暂不确定"，我们的技术团队将与您联系讨论具体需求。', en: 'If you need any of the above customization services, please select "Yes". If unsure, select "I am not sure yet". Our technical team will contact you to discuss specific requirements.' },
  },

  // Shipping step
  shipping: {
    title: { zh: '收货信息', en: 'Shipping Information' },
    address: { zh: '收货地址', en: 'Shipping Address' },
    addressHint: { zh: '完整地址，包括街道、城市、邮编、国家', en: 'Full address including street, city, postal code, country' },
    addressPlaceholder: { zh: '例如：深圳市南山区科技园XXX大厦X楼', en: 'e.g.: Building X, Tech Park, Nanshan District, Shenzhen' },
    consigneeName: { zh: '收货联系人', en: 'Consignee Contact Name' },
    consigneeNamePlaceholder: { zh: '请输入收货人姓名', en: 'Enter consignee name' },
    consigneePhone: { zh: '收货人电话', en: 'Consignee Phone' },
    consigneePhoneHint: { zh: '快递员联系电话', en: 'Phone for delivery contact' },
  },

  // PCN step
  pcn: {
    title: { zh: 'PCN 通知设置', en: 'PCN Notification Settings' },
    description: { zh: 'PCN (Product Change Notification) 是产品变更通知，用于通知您产品的重要变更信息。', en: 'PCN (Product Change Notification) is used to inform you of important product changes.' },
    email: { zh: 'PCN 通知邮箱', en: 'PCN Notification Email(s)' },
    emailHint: { zh: '可填写多个邮箱，用逗号分隔', en: 'Multiple emails can be separated by commas' },
    specialRequirements: { zh: 'PCN 特殊要求', en: 'PCN Special Requirements' },
    noSpecialRequirements: { zh: '无特殊要求', en: 'No special requirements' },
    hasSpecialRequirements: { zh: '有特殊要求', en: 'Have special requirements' },
    specifyRequirements: { zh: '请具体说明PCN特殊要求', en: 'Please specify PCN Special Requirements' },
    specifyRequirementsPlaceholder: { zh: '请详细说明您的PCN特殊要求', en: 'Please describe your PCN special requirements in detail' },
  },

  // Invoice step
  invoice: {
    title: { zh: '发票信息', en: 'Invoice Information' },
    description: { zh: '发票将发送至以下邮箱地址。', en: 'Invoices will be sent to the following email address.' },
    email: { zh: '发票接收邮箱', en: 'Invoice Receiving Email' },
    emailHint: { zh: '发票和账单将发送至此邮箱', en: 'Invoices and bills will be sent to this email' },
  },

  // Review step
  review: {
    title: { zh: '确认信息', en: 'Review Your Information' },
    description: { zh: '请确认以下信息无误后提交。如需修改，请点击"上一步"。', en: 'Please confirm the information below before submitting. Click "Back" to make changes.' },
    vendorAssignment: { zh: '供应商分配预览', en: 'Vendor Assignment Preview' },
    assignedVendor: { zh: '分配供应商', en: 'Assigned Vendor' },
    reason: { zh: '原因', en: 'Reason' },
    sections: {
      company: { zh: '公司信息', en: 'Company Information' },
      contact: { zh: '联系人信息', en: 'Contact Information' },
      currency: { zh: '币种与税务', en: 'Currency & Tax' },
      product: { zh: '产品选择', en: 'Product Selection' },
      customization: { zh: '定制服务', en: 'Customization' },
      shipping: { zh: '收货信息', en: 'Shipping Information' },
      pcn: { zh: 'PCN 通知', en: 'PCN Notification' },
      invoice: { zh: '发票信息', en: 'Invoice Information' },
    },
    fields: {
      companyName: { zh: '公司名称', en: 'Company Name' },
      businessSpecialist: { zh: '商务对接人', en: 'Business Specialist' },
      contactName: { zh: '采购联系人', en: 'Contact Name' },
      email: { zh: '联系邮箱', en: 'Email' },
      phone: { zh: '联系电话', en: 'Phone' },
      permanentPhone: { zh: '固定电话', en: 'Permanent Phone' },
      currency: { zh: '交易币种', en: 'Currency' },
      taxId: { zh: '公司税号', en: 'Tax ID' },
      legalAddress: { zh: '公司地址', en: 'Legal Address' },
      productFamily: { zh: '产品系列', en: 'Product Family' },
      moduleVariant: { zh: '模组型号', en: 'Module Variant' },
      socVariant: { zh: '芯片型号', en: 'SoC Variant' },
      technicalService: { zh: '技术服务详情', en: 'Technical Service' },
      customizationRequired: { zh: '需要定制服务', en: 'Customization Required' },
      shippingAddress: { zh: '收货地址', en: 'Shipping Address' },
      consigneeName: { zh: '收货联系人', en: 'Consignee Name' },
      consigneePhone: { zh: '收货人电话', en: 'Consignee Phone' },
      pcnEmail: { zh: 'PCN通知邮箱', en: 'PCN Email' },
      pcnSpecialRequirements: { zh: 'PCN特殊要求', en: 'PCN Special Requirements' },
      pcnDetails: { zh: '特殊要求详情', en: 'Details' },
      invoiceEmail: { zh: '发票接收邮箱', en: 'Invoice Email' },
      country: { zh: '国家/地区', en: 'Country/Region' },
      orgId: { zh: '组织ID', en: 'Org ID' },
    },
    countryNotDetected: { zh: '未检测到', en: 'Not detected' },
  },

  // Success step
  success: {
    title: { zh: '提交成功！', en: 'Submission Successful!' },
    description: { zh: '您的供应商账户申请已成功提交。请保存您的供应商ID以备查询。', en: 'Your vendor account application has been submitted. Please save your Vendor ID for reference.' },
    vendorId: { zh: '供应商ID', en: 'Vendor ID' },
    assignedVendor: { zh: '分配供应商', en: 'Assigned Vendor' },
    nextSteps: { zh: '后续步骤', en: 'Next Steps' },
    step1: { zh: '我们的团队将在 2-3个工作日 内审核您的信息', en: 'Our team will review your information within 2-3 business days' },
    step2: { zh: '确认邮件将发送至', en: 'Confirmation will be sent to' },
    step3: { zh: '审核通过后，我们将为您开通供应商账户', en: 'After approval, we will set up your vendor account' },
    customizationFollowup: { zh: '定制服务跟进', en: 'Customization Follow-up' },
    customizationFollowupDesc: { zh: '您选择了定制服务，我们的技术团队将与您联系讨论具体需求。', en: 'You selected customization services. Our technical team will contact you to discuss requirements.' },
    needHelp: { zh: '如需帮助，请联系', en: 'For assistance, contact' },
    referenceId: { zh: '参考ID', en: 'Reference ID' },
  },

  // Validation messages
  validation: {
    companyNameRequired: { zh: '请填写公司名称', en: 'Please enter company name' },
    contactNameRequired: { zh: '请填写采购联系人', en: 'Please enter purchasing contact name' },
    emailRequired: { zh: '请填写邮箱', en: 'Please enter email' },
    emailInvalid: { zh: '邮箱格式不正确', en: 'Invalid email format' },
    phoneRequired: { zh: '请填写联系电话', en: 'Please enter contact phone' },
    phoneInvalid: { zh: '电话号码格式不正确（至少7位数字）', en: 'Invalid phone number format (minimum 7 digits)' },
    mandatoryFieldsAlert: { zh: '请填写所有必填字段后再继续', en: 'Please fill in all mandatory fields before continuing' },
    currencyRequired: { zh: '请选择交易币种', en: 'Please select transaction currency' },
    addressRequired: { zh: '请填写公司法定地址', en: 'Please enter company legal address' },
    taxIdRequired: { zh: '请填写公司税号', en: 'Please enter company tax ID' },
    productRequired: { zh: '请选择产品', en: 'Please select a product' },
    variantRequired: { zh: '请选择产品型号', en: 'Please select a product variant' },
    technicalServiceRequired: { zh: '请说明所需技术服务', en: 'Please describe the technical service required' },
    shippingAddressRequired: { zh: '请填写收货地址', en: 'Please enter shipping address' },
    consigneeNameRequired: { zh: '请填写收货联系人', en: 'Please enter consignee name' },
    consigneePhoneRequired: { zh: '请填写收货人电话', en: 'Please enter consignee phone' },
    pcnEmailRequired: { zh: '请填写有效的PCN通知邮箱', en: 'Please enter valid PCN notification email' },
    pcnDetailsRequired: { zh: '请说明PCN特殊要求', en: 'Please describe PCN special requirements' },
    invoiceEmailRequired: { zh: '请填写有效的发票接收邮箱', en: 'Please enter valid invoice email' },
    submitSuccess: { zh: '提交成功！', en: 'Submission successful!' },
    submitError: { zh: '提交失败，请重试', en: 'Submission failed, please try again' },
  },
};

export function t(key: string, lang: Language): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  if (value && typeof value === 'object' && lang in value) {
    return value[lang];
  }
  
  return key;
}
