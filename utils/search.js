function normalize(value) {
  return String(value || '').toLowerCase().replace(/[，。、“”‘’；：！？（）()\s]/g, '')
}

function searchArticles(articles, query, filters) {
  const q = normalize(query)
  const result = (articles || []).map(article => {
    const haystack = normalize([article.title, article.content, article.keywords, article.chapter, article.lawName].join(' '))
    if (!q) return { ...article, score: 0 }
    const tokens = q.match(/.{1,2}/g) || [q]
    const hit = tokens.filter(token => haystack.includes(token)).length
    const exact = haystack.includes(q) ? 30 : 0
    const score = Math.min(99, exact + Math.round((hit / tokens.length) * 70) + (article.keywords && normalize(article.keywords).includes(q) ? 10 : 0))
    return { ...article, score }
  }).filter(article => !q || article.score > 0)
  return result.filter(article => !filters || !filters.lawName || article.lawName === filters.lawName).sort((a, b) => b.score - a.score)
}

module.exports = { searchArticles }
