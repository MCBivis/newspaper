const CustomLightTheme = {
  token: {
    colorTextBase: '#1a1a1a',
    colorPrimary: '#8b5cf6',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f8fafc',
    borderRadius: 16,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
  },
  components: {
    Menu: {
      itemSelectedColor: '#8b5cf6',
      itemHoverBg: '#f3f4f6',
      itemActiveBg: '#ede9fe',
      borderRadius: 12,
    },
    Button: {
      colorPrimary: '#8b5cf6',
      borderRadius: 12,
      controlHeight: 42,
      boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)',
    },
    Card: {
      borderRadius: 20,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    Descriptions: {
      padding: 5,
      paddingXS: 4,
    },
    Layout: {
      bodyBg: '#f8fafc',
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
    Table: {
      borderRadius: 16,
      headerBg: '#f8fafc',
      headerColor: '#1a1a1a',
    },
    Modal: {
      borderRadius: 20,
    },
  },
};

export default CustomLightTheme;
