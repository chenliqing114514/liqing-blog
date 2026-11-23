# 立青

用 [Astro](https://astro.build/) 搭建的静态博客，托管在 GitHub，部署在 Cloudflare Pages。

- 线上地址（国内可访问）：<https://liqing-blog.pages.dev>
- 备用地址（Vercel，国内需代理）：<https://liqing-blog.vercel.app>

## 本地运行

```powershell
cd C:\Users\陈\Downloads\liqing-blog
npm install      # 第一次或依赖变化后执行
npm run dev      # 打开 http://localhost:4321
npm run build    # 构建到 dist/，推送前可先自检
```

## 写文章

1. 在 `src/content/blog/` 新建 `.md` 文件，文件名用英文短横线，例如 `my-trip.md`
2. 开头必须是：

```markdown
---
title: '文章标题'
description: '一句话摘要，会显示在列表和搜索结果里'
pubDate: '2026-11-23'
---
```

3. 正文用普通 Markdown 写
4. 预览确认后发布：

```powershell
git add -A
git commit -m "post: 文章标题"
git push
```

推送后 Vercel 会自动构建并上线，一般 1～2 分钟。

## 改站点信息

| 想改什么 | 改哪里 |
|---|---|
| 站点标题、描述 | `src/consts.ts` |
| 域名（影响 RSS/sitemap） | `astro.config.mjs` 里的 `site` |
| 导航栏 | `src/components/Header.astro` |
| 首页 | `src/pages/index.astro` |
| 关于页 | `src/pages/about.astro` |
| 样式 | `src/styles/global.css` |

## 注意

- 日期必须是 `YYYY-MM-DD`，不要带时区，否则线上可能差一天
- 文章文件名发布后不要再改，改了旧链接会 404
- 图片建议放 `src/assets/` 并在 frontmatter 里用 `heroImage` 引用，构建时会自动压缩
- 不要提交 `node_modules` 和 `dist`（`.gitignore` 已处理）
