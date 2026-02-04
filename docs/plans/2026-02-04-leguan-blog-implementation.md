# Leguan's Blog 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 搭建一个基于 Hexo + Butterfly 主题的完整个人博客

**Architecture:** 使用 Hexo 静态博客框架，配合 Butterfly 主题实现美观的博客界面。所有页面使用 Markdown 编写，通过 Hexo 生成静态 HTML 部署到 GitHub Pages。

**Tech Stack:** Node.js, Hexo 7.x, Butterfly 4.x, npm

---

## Task 1: 初始化 Hexo 项目

**Files:**
- Create: `d:\blog\package.json`
- Create: `d:\blog\_config.yml`
- Create: `d:\blog\source\_posts\hello-world.md`

**Step 1: 安装 Hexo CLI**

```bash
npm install -g hexo-cli
```

Expected: 成功安装 hexo-cli

**Step 2: 初始化 Hexo 项目**

```bash
cd d:\blog
hexo init .
```

注意：如果目录非空，需要先清理或使用临时目录初始化后复制

**Step 3: 安装依赖**

```bash
npm install
```

Expected: 成功安装所有依赖

**Step 4: 验证安装**

```bash
hexo version
```

Expected: 显示 Hexo 版本信息

---

## Task 2: 安装 Butterfly 主题

**Files:**
- Create: `d:\blog\themes\butterfly\`
- Create: `d:\blog\_config.butterfly.yml`

**Step 1: 安装 Butterfly 主题**

```bash
npm install hexo-theme-butterfly
```

**Step 2: 创建主题配置文件**

从 node_modules 复制配置文件到根目录：

```bash
cp node_modules/hexo-theme-butterfly/_config.yml _config.butterfly.yml
```

**Step 3: 修改 Hexo 配置使用 Butterfly 主题**

修改 `_config.yml`，设置 theme 为 butterfly：

```yaml
theme: butterfly
```

**Step 4: 安装必要插件**

```bash
npm install hexo-renderer-pug hexo-renderer-stylus
```

---

## Task 3: 配置基本站点信息

**Files:**
- Modify: `d:\blog\_config.yml`

**Step 1: 修改站点基本信息**

```yaml
title: Leguan's Blog
subtitle: ''
description: 'A person who wants to see the world'
keywords:
author: Leguan
language: zh-CN
timezone: 'Asia/Shanghai'
url: https://leguan.github.io
```

**Step 2: 配置永久链接格式**

```yaml
permalink: :year/:month/:day/:title/
```

---

## Task 4: 配置 Butterfly 主题基本信息

**Files:**
- Modify: `d:\blog\_config.butterfly.yml`

**Step 1: 配置博主信息卡片**

```yaml
# 侧边栏设置
aside:
  enable: true
  hide: false
  button: true
  mobile: true
  position: right

# 卡片作者
card_author:
  enable: true
  description: A person who wants to see the world
  button:
    enable: true
    icon: fab fa-github
    text: GitHub
    link: https://github.com/leguan
```

**Step 2: 配置页脚**

```yaml
footer:
  owner:
    enable: true
    since: 2025
  custom_text:
  copyright: true
```

**Step 3: 配置博客副标题**

```yaml
subtitle:
  enable: true
  effect: true
  loop: true
  source: false
  sub:
    - Digest your emotions
```

---

## Task 5: 创建标签页面

**Files:**
- Create: `d:\blog\source\tags\index.md`

**Step 1: 创建 tags 目录和页面**

```bash
hexo new page tags
```

**Step 2: 编辑 tags/index.md**

```markdown
---
title: 标签
date: 2026-02-04 00:00:00
type: "tags"
---
```

---

## Task 6: 创建分类页面

**Files:**
- Create: `d:\blog\source\categories\index.md`

**Step 1: 创建 categories 页面**

```bash
hexo new page categories
```

**Step 2: 编辑 categories/index.md**

```markdown
---
title: 分类
date: 2026-02-04 00:00:00
type: "categories"
---
```

---

## Task 7: 创建归档页面

**Files:**
- Modify: `d:\blog\_config.butterfly.yml`

归档页面 Hexo 自带，只需确保菜单配置正确即可。

---

## Task 8: 创建关于我页面

**Files:**
- Create: `d:\blog\source\about\index.md`

**Step 1: 创建 about 页面**

```bash
hexo new page about
```

**Step 2: 编辑 about/index.md**

```markdown
---
title: 关于我
date: 2026-02-04 00:00:00
type: "about"
---

## About Me

A person who wants to see the world.

### Digest your emotions

欢迎来到我的博客！
```

---

## Task 9: 创建友人帐页面

**Files:**
- Create: `d:\blog\source\link\index.md`

**Step 1: 创建 link 页面**

```bash
hexo new page link
```

**Step 2: 编辑 link/index.md**

```markdown
---
title: 友人帐
date: 2026-02-04 00:00:00
type: "link"
---
```

**Step 3: 在主题配置中添加友链数据**

在 `_config.butterfly.yml` 中添加：

```yaml
# 友链设置
flink:
  - class_name: 推荐网站
    class_desc: 一些好朋友
    link_list:
      - name: 示例友链
        link: https://example.com
        avatar: https://example.com/avatar.png
        descr: 这是一个示例友链
```

---

## Task 10: 创建留言板页面

**Files:**
- Create: `d:\blog\source\messageboard\index.md`

**Step 1: 创建 messageboard 页面**

```bash
hexo new page messageboard
```

**Step 2: 编辑 messageboard/index.md**

```markdown
---
title: 留言板
date: 2026-02-04 00:00:00
---

欢迎留言！

由于评论系统暂未配置，留言功能稍后开放。
```

---

## Task 11: 创建闲言碎语页面

**Files:**
- Create: `d:\blog\source\shuoshuo\index.md`

**Step 1: 创建 shuoshuo 页面**

```bash
hexo new page shuoshuo
```

**Step 2: 编辑 shuoshuo/index.md**

```markdown
---
title: 闲言碎语
date: 2026-02-04 00:00:00
---

记录生活中的点滴...
```

---

## Task 12: 创建健身日寄页面

**Files:**
- Create: `d:\blog\source\fitness\index.md`

**Step 1: 创建 fitness 页面**

```bash
hexo new page fitness
```

**Step 2: 编辑 fitness/index.md**

```markdown
---
title: 健身日寄
date: 2026-02-04 00:00:00
---

记录健身历程...
```

---

## Task 13: 创建番剧页面

**Files:**
- Create: `d:\blog\source\bangumi\index.md`

**Step 1: 创建 bangumi 页面**

```bash
hexo new page bangumi
```

**Step 2: 编辑 bangumi/index.md**

```markdown
---
title: 番剧
date: 2026-02-04 00:00:00
---

追番记录...
```

---

## Task 14: 创建记忆胶囊页面

**Files:**
- Create: `d:\blog\source\memory\index.md`

**Step 1: 创建 memory 页面**

```bash
hexo new page memory
```

**Step 2: 编辑 memory/index.md**

```markdown
---
title: 记忆胶囊
date: 2026-02-04 00:00:00
---

珍藏的回忆...
```

---

## Task 15: 配置导航菜单

**Files:**
- Modify: `d:\blog\_config.butterfly.yml`

**Step 1: 配置完整导航菜单**

```yaml
menu:
  首页: / || fas fa-home
  文章:
    归档: /archives/ || fas fa-archive
    标签: /tags/ || fas fa-tags
    分类: /categories/ || fas fa-folder-open
  休闲:
    健身日寄: /fitness/ || fas fa-dumbbell
    番剧: /bangumi/ || fas fa-video
    记忆胶囊: /memory/ || fas fa-camera-retro
  社交:
    留言板: /messageboard/ || fas fa-comment-dots
    友人帐: /link/ || fas fa-user-friends
  个人:
    闲言碎语: /shuoshuo/ || fas fa-comment
    关于我: /about/ || fas fa-user
```

---

## Task 16: 配置主题功能

**Files:**
- Modify: `d:\blog\_config.butterfly.yml`

**Step 1: 配置本地搜索**

先安装搜索插件：

```bash
npm install hexo-generator-searchdb
```

在 `_config.yml` 中添加：

```yaml
search:
  path: search.xml
  field: post
  content: true
```

在 `_config.butterfly.yml` 中启用：

```yaml
local_search:
  enable: true
  preload: false
  CDN:
```

**Step 2: 配置代码高亮**

```yaml
highlight_theme: mac
highlight_copy: true
highlight_lang: true
highlight_shrink: false
```

**Step 3: 配置图片灯箱**

```yaml
fancybox: true
```

**Step 4: 配置复制提示**

```yaml
copy:
  enable: true
  copyright:
    enable: true
    limit_count: 50
```

**Step 5: 配置加载动画**

```yaml
preloader:
  enable: true
  source: 1
  pace_css_url:
```

**Step 6: 配置阅读进度条**

```yaml
reading_progress:
  enable: true
  position: top
  color: "#AAAAAA"
  height: 3px
```

**Step 7: 配置昼夜模式**

```yaml
darkmode:
  enable: true
  button: true
  autoChangeMode: false
```

---

## Task 17: 创建示例文章

**Files:**
- Create: `d:\blog\source\_posts\welcome.md`

**Step 1: 创建欢迎文章**

```markdown
---
title: 欢迎来到 Leguan's Blog
date: 2026-02-04 00:00:00
tags:
  - 博客
categories:
  - 随笔
---

# 欢迎！

这是我的第一篇博客文章。

## 关于这个博客

Digest your emotions - 消化你的情绪。

我是 Leguan，一个想要看看世界的人。

<!-- more -->

## 博客内容

这里会记录：
- 技术分享
- 生活随笔
- 学习笔记

敬请期待更多内容！
```

---

## Task 18: 本地预览测试

**Step 1: 清理并生成静态文件**

```bash
hexo clean && hexo generate
```

**Step 2: 启动本地服务器**

```bash
hexo server
```

Expected: 服务器在 http://localhost:4000 启动

**Step 3: 验证所有页面**

- [ ] 首页正常显示
- [ ] 文章列表正常
- [ ] 所有导航菜单可点击
- [ ] 标签页正常
- [ ] 分类页正常
- [ ] 关于我页面正常
- [ ] 昼夜模式切换正常
- [ ] 搜索功能正常

---

## Task 19: 准备 GitHub Pages 部署

**Files:**
- Create: `d:\blog\.github\workflows\deploy.yml`

**Step 1: 创建 GitHub Actions 工作流**

```yaml
name: Deploy Hexo to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

**Step 2: 确保 package.json 有 build 脚本**

```json
{
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server"
  }
}
```

---

## 完成检查清单

- [ ] Hexo 项目初始化完成
- [ ] Butterfly 主题安装配置完成
- [ ] 所有页面创建完成（共 10 个页面）
- [ ] 导航菜单配置完成
- [ ] 主题功能配置完成
- [ ] 示例文章创建完成
- [ ] 本地预览正常
- [ ] GitHub Actions 部署配置完成
