import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({limit:'2mb'}))

const interpretations = [
  {id:'marriage-2',title:'最高人民法院关于适用《中华人民共和国民法典》婚姻家庭编的解释（二）',documentNo:'法释〔2025〕1号',status:'现行有效',effectiveDate:'2025-02-01',keywords:'婚姻 家庭 夫妻财产',summary:'针对婚姻家庭纠纷审判中的新情况细化裁判规则。正式引用前应核对最高人民法院官网公布的完整文本与后续修改情况。',sourceUrl:'https://www.court.gov.cn/zixun/xiangqing/452771.html'},
  {id:'construction-2',title:'最高人民法院关于审理建设工程施工合同纠纷案件适用法律问题的解释（二）',documentNo:'法释〔2026〕9号',status:'将施行',effectiveDate:'2026-06-30',keywords:'建设工程 施工合同 工程价款',summary:'完善建设工程施工合同纠纷裁判规则。系统会根据问题关键词召回，不应将摘要代替司法解释原文。',sourceUrl:'https://www.court.gov.cn/fabu/xiangqing/504221.html'}
]

function related(article, question='') {
  const text = `${question} ${article?.title||''} ${article?.content||''} ${article?.keywords||''}`
  return interpretations.filter(x => x.keywords.split(' ').some(k => text.includes(k))).slice(0,5)
}

app.post('/api/analyze', async (req,res) => {
  const {question, article} = req.body || {}
  const matches = related(article, question)
  const system = '你是中国民法研究辅助模型。只基于用户提供的法条和司法解释材料分析，不编造法条、案号或发布日期。必须区分法条原文、司法解释规则和你的推断；指出需要核验的现行效力。输出：结论、适用要件、法律后果、风险与待核验事项。'
  const prompt = JSON.stringify({question,article,interpretations:matches},null,2)
  if (!process.env.MODEL_API_KEY || process.env.MODEL_API_KEY === 'replace-me') {
    return res.json({analysis:'后端已收到请求，但尚未配置 MODEL_API_KEY。请在 server/.env 中配置 OpenAI 兼容模型服务后重试。',interpretations:matches})
  }
  try {
    const response = await fetch(`${process.env.MODEL_BASE_URL.replace(/\/$/,'')}/chat/completions`, {method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.MODEL_API_KEY}`},body:JSON.stringify({model:process.env.MODEL_NAME||'gpt-4o-mini',temperature:0.1,messages:[{role:'system',content:system},{role:'user',content:prompt}]})})
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message||`model http ${response.status}`)
    res.json({analysis:data.choices?.[0]?.message?.content||'模型未返回内容',interpretations:matches})
  } catch (error) { res.status(502).json({error:'模型服务调用失败',detail:error.message,interpretations:matches}) }
})

app.get('/api/health', (_req,res) => res.json({ok:true,interpretationsUpdatedAt:'2026-10-12',count:interpretations.length}))
app.listen(process.env.PORT || 8787, process.env.HOST || '127.0.0.1', () => {
  console.log(`civil-law-ai-api listening on ${process.env.PORT || 8787}`)
})
