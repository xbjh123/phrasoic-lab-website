# Phrasoic Lab — 部署技能

当用户说「部署」「上线」「发布」「push」时激活此技能。

## 工作流程

### Step 1: 同步文章
```bash
python3 scripts/sync.py
```

### Step 2: 构建站点
```bash
npm run build
```

### Step 3: Git 提交
```bash
git add -A
git commit -m "update: {描述本次变更}"
```

### Step 4: 推送到 GitHub（触发 Vercel 自动部署）
```bash
git push
```

### Step 5: 确认
告诉用户：
- 推送状态
- Vercel 部署链接：`https://phrasoic-lab-website.vercel.app`
- 变更内容摘要

## 注意事项

1. **先同步再构建** — sync.py 会将 MD 转换为 posts.ts
2. **Vercel 自动部署** — push 到 main 分支自动触发重建
3. **Token 安全** — 不要在日志中暴露 GitHub Token
4. **报错处理** — 如果推送失败，检查网络和 Token 权限
