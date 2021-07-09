# miniprogram-cli

> 微信小程序脚手架。

---

## 集成

- Less CSS 预处理语言

- Alias 路径别名

- Imagemin 图片压缩

- Hot reload 热更新

- Miniprogram npm支持

  

## 目录结构

```bash
├── dist                          # 打包文件，微信开发者工具项目导入入口
├── gulp                          # gulp 工具
│   ├── install.js                # miniprogram 依赖安装脚本
├── miniprogram                   # miniprogram
│   ├── package.json              # miniprogram package.json
├── src                           # 源代码
│   ├── assets.                   # 资源文件
│   ├── pages.                    # pages
│   ├── utils.                    # 工具
│   ├── project.config.json       # project.config.json
│   ├── sitemap.json              # sitemap.json
└── gulpfile.js                  # gulp 配置
```



## 启动

```bash
npm run serve
```



## npm 支持

1. 安装依赖

```bash
npm run install
eg: npm run install @vant/weapp
```

2. 重启
3. [构建npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

