const CustomDarkTheme = {
  token: {
    colorTextBase: '#f1f5f9',
    colorPrimary: '#818cf8',
    colorBgContainer: '#1e293b',
    colorBgElevated: '#0f172a',
    borderRadius: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Menu: {
      itemSelectedColor: '#818cf8',
      itemHoverBg: '#1e293b',
      itemActiveBg: '#334155',
      borderRadius: 8,
    },
    Button: {
      colorPrimary: '#818cf8',
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 16,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    },
    Layout: {
      bodyBg: '#0f172a',
      headerBg: '#1e293b',
      siderBg: '#1e293b',
    },
  },
};

export default CustomDarkTheme;
