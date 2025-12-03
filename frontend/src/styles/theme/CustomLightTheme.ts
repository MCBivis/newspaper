const CustomLightTheme = {
  token: {
    colorTextBase: '#1a1a1a',
    colorPrimary: '#6366f1',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f8fafc',
    borderRadius: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Menu: {
      itemSelectedColor: '#6366f1',
      itemHoverBg: '#f1f5f9',
      itemActiveBg: '#eef2ff',
      borderRadius: 8,
    },
    Button: {
      colorPrimary: '#6366f1',
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 16,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
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
  },
};

export default CustomLightTheme;
