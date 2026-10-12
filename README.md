# 法条智检 · LLM 增强版小程序

> 关键词检索的天花板到了，这一版开始引入大模型——但"哪些交给模型、哪些绝不交给模型"，是这个项目真正的产品思考。

**English: The LLM-enhanced iteration — bringing DeepSeek into the loop, with deliberate decisions about what should NEVER be delegated to the model.**

![type](https://img.shields.io/badge/type-WeChat%20MiniProgram%20%2B%20Node%20Backend-blue) ![llm](https://img.shields.io/badge/LLM-DeepSeek%20(OpenAI--compatible)-purple)

---

## 迭代动机

第一代（关键词检索 + 规则引擎）验证了需求，但暴露了天花板：

- 用户问法千变万化，关键词召回永远追不完；
- 司法解释、地方裁判口径等知识，规则库写不过来。

**假设**：LLM 能显著提升自然语言理解与知识覆盖。
**代价**：成本、延迟、幻觉风险。
**因此**：这一版的目标是"可控地引入 LLM"，而不是"把一切都丢给模型"。

## 核心设计决策（PM 视角）

### 1. API Key 绝不进前端
小程序包体可被解包，密钥写在前端等于公开。本项目的 `server/` 后端负责：
- 模型调用（OpenAI 兼容协议，模型可替换）
- 鉴权、限流、日志

```bash
cd server
cp .env.example .env      # 填入 MODEL_BASE_URL / MODEL_API_KEY / MODEL_NAME
npm install && npm start
```

### 2. 司法解释不靠模型"猜"
司法解释的**文号、效力状态、生效日期、官方来源**由结构化司法解释库召回返回，而非让模型自由生成——模型只负责理解与组织，不负责"编造权威性"。

当前示例收录：婚姻家庭编解释（二）、建设工程施工合同解释（二）。生产环境应由管理员定期从最高人民法院官网核验更新。

### 3. 用户数据自主
支持"导入我的 JSON 数据"（粘贴即用），数据写入本地缓存，重启不丢失。兼容多字段别名（`lawName/articleNo/title/content/keywords...`）。

## 后续 Roadmap（写在 README 里，欢迎讨论）

- 服务端分词 / BM25 / 向量检索替换本地关键词匹配
- 条文版本管理：施行日期、废止日期、司法解释关联关系
- 服务端增加法律来源校验与引用链

## 快速开始

1. 微信开发者工具导入本仓库根目录（`app.json` 所在层，AppID 用你自己的）；
2. `server/` 按上述命令启动后端；
3. 将 `app.js` 中 `apiBaseUrl` 指向你的 HTTPS 后端地址。

## 构建方式

AI 辅助编码（vibe coding）：架构分层（前端/后端职责边界）、安全边界、"模型能做什么不能做什么"的产品决策由本人完成。

## 相关项目

- [ai-law-search-web](https://github.com/lemon150637/ai-law-search-web) — 初代：纯静态规则引擎版
- [ai-law-search-miniapp](https://github.com/lemon150637/ai-law-search-miniapp) — 初代小程序版
