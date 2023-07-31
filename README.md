# 类antd 4.x 组件库模版

用于开发类 antd 4.x的组件库的模板

## 特性（Feature）

- 支持 `commonjs`、`esm`、`umd` 三种种模块输出
- 集成`typescript`
- 集成`rollup`构建
- 集成`babel`语法转换与`polyfill`
- 规范`commit message`，支持`commit message`检查
- 集成`prettier`代码美化
- 集成`cspell`, 支持拼写检查
- 集成自动升级版本号与生成`changeLog.md`
- 集成 github-action 自动发布`npm`包
- 开箱即用`scripts`命令
- 集成`eslint` 检查
- 支持babel-plugin-import

## 注意事项

- 需要有拼写错误提示，可以通过 `/cspell.json` 进行忽略或者修复

## 项目设计结构（Structure）

目录结构

```bash
.
├── LICENSE
├── README.md
├── babel.config.js
├── commitlint.config.js
├── components
│   ├── _util
│   │   ├── index.ts
│   │   └── isNumeric.ts
│   ├── avatar
│   │   ├── avatar.tsx
│   │   ├── index.ts
│   │   └── style
│   │       ├── index.less
│   │       └── index.tsx
│   ├── button
│   │   ├── button.tsx
│   │   ├── index.ts
│   │   └── style
│   │       ├── index.less
│   │       └── index.tsx
│   ├── index.ts
│   └── style
│       ├── core
│       │   ├── base.less
│       │   ├── global.less
│       │   └── index.less
│       ├── index.less
│       ├── mixins
│       │   ├── clearfix.less
│       │   ├── index.less
│       │   ├── reset.less
│       │   └── size.less
│       └── themes
│           ├── default.less
│           └── index.less
├── cspell.config.js
├── index.d.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── rollup.config.js
└── tsconfig.json
```

## 项目使用（Usage）

```js
pnpm add react-components-style

import { Button } from 'react-components-style'

const Demo = () => <Button>点我</Button>
```

## 本地开发（Development）

### 安装依赖

```
pnpm install
```

### 开发模式

```
pnpm dev
```

注意开发新组件，按照components下的组件格式开发即可

### 构建模式

```
pnpm build
```

### 语法校验

```
pnpm lint:all
```

### 环境依赖

```
node >=10.13.0
```
