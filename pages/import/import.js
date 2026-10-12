Page({
  data:{text:'',message:''},
  onInput(e){this.setData({text:e.detail.value,message:''})},
  importData(){try{const raw=JSON.parse(this.data.text); const list=Array.isArray(raw)?raw:(raw.articles||raw.data); if(!Array.isArray(list)||!list.length) throw new Error('JSON 须为数组，或包含 articles/data 数组'); const normalized=list.map((x,i)=>({id:x.id||`custom-${i}`,lawName:x.lawName||x.law||'未命名法律',articleNo:x.articleNo||x.article||'',title:x.title||x.name||'未命名条文',content:x.content||x.text||'',keywords:Array.isArray(x.keywords)?x.keywords.join(' '):(x.keywords||''),chapter:x.chapter||'',effective:x.effective||'未标注',source:x.source||'自有数据'})); getApp().globalData.articles=normalized; wx.setStorageSync('civil_articles',normalized); this.setData({message:`已导入 ${normalized.length} 条条文，可返回首页检索`})}catch(e){this.setData({message:`导入失败：${e.message}`})}},
  example(){this.setData({text:JSON.stringify([{lawName:'中华人民共和国民法典',articleNo:'第一条',title:'示例标题',content:'条文正文',keywords:['合同','责任'],chapter:'合同编',effective:'现行有效'}],null,2)})}
})
