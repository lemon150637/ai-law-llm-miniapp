Page({
  data:{article:{},analysis:'',loading:false,interpretations:[]},
  onLoad(){const article=wx.getStorageSync('selected_article')||{}; article.keywordList=String(article.keywords||'').split(/[ ,，、]+/).filter(Boolean); this.setData({article})},
  analyze(){
    const a=this.data.article; const app=getApp(); this.setData({loading:true,analysis:''})
    if (app.globalData.apiBaseUrl) {
      wx.request({url:app.globalData.apiBaseUrl.replace(/\/$/,'')+'/api/analyze',method:'POST',data:{question:a.content,article:a},success:res=>{const d=res.data||{}; this.setData({loading:false,analysis:d.analysis||'服务端未返回分析结果',interpretations:d.interpretations||[]})},fail:()=>{this.setData({loading:false,analysis:'无法连接分析服务。请检查后端地址、HTTPS 配置和网络权限。'})}})
    } else {
      setTimeout(()=>{this.setData({loading:false,analysis:`本条规范的核心主题是“${a.keywords||'相关民事关系'}”。建议按主体、行为、权利义务和责任后果四个要素核对事实，并结合现行司法解释进行适用性复核。当前尚未配置后端大模型服务。`})},450)
    }
  }
})
