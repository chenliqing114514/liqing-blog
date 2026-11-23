---
title: '你好，世界'
description: '这个博客的第一篇文章，也是它的起点。'
pubDate: '2026-11-23'
---

这是博客的第一篇文章。站点已经跑起来了，接下来只需要把它推到 GitHub、连上 Vercel，就会有一个自己的网址。

## 为什么写博客

把学到的东西写下来，是一种很好的复习方式；时间久了，也能看到自己走过的路。

## 怎么写新文章

1. 在 `src/content/blog/` 下新建一个 `.md` 文件，文件名用英文和短横线，比如 `my-first-post.md`
2. 在文件开头写上 frontmatter：

```markdown
---
title: '文章标题'
description: '一句话摘要'
pubDate: '2026-11-23'
---
```

3. 下面正常写 Markdown 正文即可
4. 本地预览：`npm run dev`，打开 <http://localhost:4321>
5. 发布：`git add -A && git commit -m "post: 标题" && git push`

## 几个小提醒

- 图片放在 `src/assets/` 或 `public/`，路径别写错
- 日期写成 `YYYY-MM-DD`，不要带时区
- 文件名一旦发布就不要再改，否则旧链接会失效

就这些，开始写吧。
