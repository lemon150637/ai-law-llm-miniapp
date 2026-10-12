const { searchArticles } = require('../../utils/search')
const builtIn = require('../../data/articles.js')
Page({
  data: { query:'', results:[], searched:false, hot:['合同效力','侵权责任','民事法律行为','意思表示'], articleCount: 0 },
  onLoad() { const app = getApp(); const articles = app.globalData.articles.length ? app.globalData.articles : builtIn; this.articles = articles; this.setData({articleCount:articles.length}); this.runSearch('') },
  onInput(e) { this.setData({query:e.detail.value}) },
  onSearch() { this.runSearch(this.data.query) },
  onHot(e) { const q=e.currentTarget.dataset.q; this.setData({query:q}); this.runSearch(q) },
  runSearch(q) { this.setData({results:searchArticles(this.articles,q), searched:!!q}) },
  openDetail(e) { const item=e.currentTarget.dataset.item; wx.setStorageSync('selected_article',item); wx.navigateTo({url:'/pages/detail/detail'}) },
  goImport() { wx.navigateTo({url:'/pages/import/import'}) }
})
