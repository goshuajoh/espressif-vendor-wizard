import { useEffect, useState } from 'react';
import { Layout, Space, Button, Dropdown, Menu, Avatar, Typography, ConfigProvider } from '@arco-design/web-react';
import { IconMoon, IconSun } from '@arco-design/web-react/icon';
import enUS from '@arco-design/web-react/es/locale/en-US';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import '@arco-design/web-react/dist/css/arco.css';
import './App.css';
import VendorWizard from './components/VendorWizard';
import { getUrlParams } from './utils/urlParams';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ToastProvider } from './components/Toast';
import espressifLogo from '/espressif-logo.svg';

const { Header, Content, Footer } = Layout;

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [businessSupport, setBusinessSupport] = useState<string | undefined>();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const params = getUrlParams();
    setBusinessSupport(params.businessSupport);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
  }, [darkMode]);

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-left">
          <img
            src={espressifLogo}
            alt="Espressif"
            className="header-logo"
          />
        </div>

        <Space size="medium" className="header-right">
          <Button
            type="secondary"
            size="small"
            onClick={toggleLanguage}
            className="language-btn"
          >
            {t('header.language')}
          </Button>

          <Button
            type="text"
            shape="circle"
            icon={darkMode ? <IconSun /> : <IconMoon />}
            onClick={() => setDarkMode(!darkMode)}
          />

          <Dropdown
            droplist={
              <Menu>
                <Menu.Item key="profile">Profile</Menu.Item>
                <Menu.Item key="settings">Settings</Menu.Item>
                <Menu.Item key="logout">Logout</Menu.Item>
              </Menu>
            }
          >
            <Space style={{ cursor: 'pointer' }}>
              <Typography.Text>
                {businessSupport || (language === 'zh' ? '商务支持' : 'Business Support')}
              </Typography.Text>
              <Avatar size={32} style={{ backgroundColor: '#3370ff' }}>
                {(businessSupport || 'BS').charAt(0).toUpperCase()}
              </Avatar>
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <Content className="app-content">
        <VendorWizard businessSupport={businessSupport} />
      </Content>

      <Footer className="app-footer">
        Copyright © {new Date().getFullYear()} Espressif Systems. All rights reserved.
      </Footer>
    </Layout>
  );
}

function AppWithConfig() {
  const { language } = useLanguage();

  return (
    <ConfigProvider locale={language === 'zh' ? zhCN : enUS}>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ConfigProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppWithConfig />
    </LanguageProvider>
  );
}

export default App;
