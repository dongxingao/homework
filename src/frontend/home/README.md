# Home Frontend Structure

## 目录说明

```text
home/
├── index.html
├── pages/
│   ├── passenger.html
│   └── admin.html
└── styles/
    └── home.css
```

## 约定

- `pages/`：放首页页面文件
- `styles/`：放首页共用样式
- `index.html`：首页入口，默认跳转到用户首页

当前目标是让 `home` 目录按页面和样式分层，避免所有文件平铺在同一级目录中。
