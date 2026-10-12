App({
  globalData: {
    appId: 'wx9fff3f50d0daf429',
    articles: [],
    // 发布前改为你的 HTTPS 后端地址，例如 https://api.example.com
    apiBaseUrl: 'http://183.172.24.186',
    modelProvider: 'openai-compatible'
  },
  onLaunch() {
    const stored = wx.getStorageSync('civil_articles')
    if (Array.isArray(stored) && stored.length) this.globalData.articles = stored
  }
})
