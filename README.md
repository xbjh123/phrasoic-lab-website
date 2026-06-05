# PHRASOIC LAB

个人知识库 · 设计笔记 · 技术档案

## 技术栈

- [Astro](https://astro.build/) — 静态站点生成
- [Pagefind](https://pagefind.app/) — 全文搜索
- [KaTeX](https://katex.org/) — 数学公式渲染

## 本地开发

```bash
npm install
npm run dev        # 开发服务器
npm run preview    # 预览构建
npm run sync       # 同步文章 MD → posts.ts
npm run build      # 生产构建
```

## 文章管理

```bash
# 导入新文章
python3 scripts/import.py ~/path/to/article.md

# 更新已有文章（保留元数据）
python3 scripts/import.py ~/path/to/article.md --update

# 强制覆盖（重新生成所有元数据）
python3 scripts/import.py ~/path/to/article.md --force
```

## 部署

Vercel 自动检测 Astro 配置，推送即部署。
