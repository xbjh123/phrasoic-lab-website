# Phrasoic Lab — 文章发布技能

当用户直接粘贴 markdown 文章内容时，使用此技能将文章发布到网站。

## 触发条件

用户粘贴以 `#` 开头的 markdown 文本，或说「发布文章」「提交文章」「push 这篇文章」时激活。

## 工作流程

### Step 1: 解析用户提供的 markdown

从用户粘贴的内容中提取：
- `#` 标题 → `title`
- 代码块和表格数量 → 估算阅读时间
- 内容主题 → 自动分类（SYSTEMS / THEORY / CULTURE / ENGINEERING / DESIGN）

### Step 2: 生成 frontmatter

```yaml
---
title: "提取的标题"
cat: "自动分类"
tags: [自动推断的标签]
min: "估算的分钟数"
date: "YYYY.MM.DD — HH:MM:SS"（当前时间）
image: ""
label: "LATEST TRANSMISSION"
labelZh: "最新传输"
excerpt: "从第一段提取的摘要"
---
```

### Step 3: 写入文件

将 frontmatter + 原始 markdown 内容写入 `src/content/blog/{slug}.md`，slug 从标题生成（小写，连字符分隔，去除停用词）。

### Step 4: 同步与构建

运行：
```bash
python3 scripts/sync.py
npm run build
```

### Step 5: 确认

告诉用户：
- 文章 slug 和 URL
- 分类和标签
- 构建状态

## slug 生成规则

- 标题转小写
- 非字母数字替换为 `-`
- 去除 `the, a, an, on, in, of, is, for, to` 等停用词
- 去除连续连字符
- 示例：`On Distributed Systems and the Illusion of Consensus` → `distributed-systems-illusion-consensus`

## 标签推断

从标题和前两段内容中提取 2-4 个关键词：
- 编程相关 → `programming, code, software`
- 机器学习 → `machine-learning, ml, data-science`
- 系统设计 → `architecture, systems, distributed`
- 数学 → `math, formulas`
- 其他 → 根据内容推断

## 分类推断

| 关键词 | 分类 |
|--------|------|
| system, distributed, infrastructure, database, linux, network | SYSTEMS |
| theory, math, principle, formula, proof | THEORY |
| philosophy, society, culture, design, trend | CULTURE |
| engineering, tool, code, programming, api, algorithm | ENGINEERING |
| ui, ux, visual, typography, layout, style | DESIGN |

## 重要规则

1. **不修改用户原文** — 原样粘贴，只添加 frontmatter
2. **不添加 AI 总结** — 不重写、不精简、不改写
3. **修复格式问题** — 仅修复 markdown 语法错误（如缺少空行）
4. **保护数学公式** — `$$...$$` 块保持原样不拆分
5. **代码块保持完整** — `<pre><code>` 内容不转义
6. **确认后执行** — 先给用户预览 frontmatter 和 slug，等确认后再写入
