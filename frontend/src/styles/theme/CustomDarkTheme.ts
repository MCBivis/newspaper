const CustomDarkTheme = {
  token: {
    colorTextBase: '#f1f5f9',
    colorPrimary: '#a78bfa',
    colorBgContainer: '#1e293b',
    colorBgElevated: '#0f172a',
    borderRadius: 16,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#f87171',
    colorInfo: '#60a5fa',
  },
  components: {
    Menu: {
      itemSelectedColor: '#a78bfa',
      itemHoverBg: '#1e293b',
      itemActiveBg: '#334155',
      borderRadius: 12,
    },
    Button: {
      colorPrimary: '#a78bfa',
      borderRadius: 12,
      controlHeight: 42,
      boxShadow: '0 2px 4px rgba(167, 139, 250, 0.3)',
    },
    Card: {
      borderRadius: 20,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    },
    Layout: {
      bodyBg: '#0f172a',
      headerBg: '#1e293b',
      siderBg: '#1e293b',
    },
    Table: {
      borderRadius: 16,
      headerBg: '#1e293b',
      headerColor: '#f1f5f9',
    },
    Modal: {
      borderRadius: 20,
    },
  },
};

export default CustomDarkTheme;
