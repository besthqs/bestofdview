# BestOfdview

## ofd 查看器

### 介绍

BestOfdview 是一款开源的 ofd 查看器，支持 vue3，主要功能有：

- 支持 ofd 文件格式的解析，包括解析出 ofd 文档的基本信息、解析出 ofd 文档中的文字、表格、签名等内容。
- 支持 ofd 文件格式的渲染，包括将 ofd 文档中的文字、表格、签名等内容渲染成可视化的页面。
- 支持 ofd 文件格式的签名验证，包括对 ofd 文档的签名进行验证，验证签名是否正确。

### 下载

- [GitHub](https://github.com/besthqs/bestofdview)

### 安装

```
npm i bestofdview
```

### 安装依赖

```
npm i  jszip-utils jszip @lapo/asn1js sm-crypto ofd-xml-parser  js-md5 js-sha1 jsrsasign core-js web-streams-polyfill
```

### 使用

创建 src/views/OfdView.vue 文件，并引入组件：

```
<template>
  <div class="ofd-view-container">
    <OfdView></OfdView>
  </div>
</template>
<script setup lang="ts">
import { OfdView } from 'bestofdview'
import 'bestofdview/src/assets/main.css'
import 'bestofdview/src/polyfills'
import 'sm-crypto'
import 'jsrsasign'
import 'ofd-xml-parser'
import 'jszip'
import 'jszip-utils'
import 'js-md5'
import 'js-sha1'
</script>
<style scoped>
.ofd-view-container {
  width: 100%;
  height: 100vh;
}
</style>
```

添加路由：src/router/index.ts 中添加路由：

```
{
  path: '/ofd-view',
  name: 'OfdView',
  component: () => import('@/views/OfdView.vue')
}
```

### bestofdview API

| 属性名             | 类型     | 说明                      | 默认值 |
| ------------------ | -------- | ------------------------- | ------ |
| showOpenFileButton | boolean  | 是否显示打开 ofd 文档按钮 | true   |
| ofdLink            | string   | ofd 文档链接              | —      |
| sealClick          | Function | 给印章添加点击事件        | —      |

### 贡献

欢迎提交 PR，共建开源 ofd 查看器。
