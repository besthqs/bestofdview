# BestOfdview

## ofd 查看器

### OFD 是由工业和信息化部软件司牵头中国电子技术标准化研究院成立的版式编写组制定的版式文档国家标准，属于中国的一种自主格式，要打破政府部门和党委机关电子公文格式不统一，以方便的进行电子文档的存储、读取以及编辑 。

### 介绍

BestOfdview 是一款开源的 ofd 查看器，支持 vue3，主要功能有：

- 支持 ofd 文件格式的解析，包括解析出 ofd 文档的基本信息、解析出 ofd 文档中的文字、表格、签名等内容。
- 支持 ofd 文件格式的渲染，包括将 ofd 文档中的文字、表格、签名等内容渲染成可视化的页面。
- 支持 ofd 文件格式的签名验证，包括对 ofd 文档的签名进行验证，验证签名是否正确。

### 下载

- [GitHub](https://github.com/besthqs/bestofdview)

### 在线预览地址

- [ofdview](https://hbhjpt.580168.net/ta/web/#/ofdview)

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

### 预览

![打开ofd](https://github.com/besthqs/bestofdview/blob/main/src/assets/openofd.png?raw=true)

![ofd文件](https://github.com/besthqs/bestofdview/blob/main/src/assets/ofd999.png?raw=true)

### 贡献

欢迎提交 PR，共建开源 ofd 查看器。如果使用中出现问题，可以发邮件 [besthqs@qq.com](mailto:besthqs@qq.com)。

### 版本更新说明

- 2025.1.18(0.3.12) 对工具栏图标增加了禁用显示，如果没有打开 ofd 文件，工具栏的图标是灰色，不可用
- 2025.1.21(0.3.13) 部分发票，完全使用 svg 填充，需要取资源中的 FillColor,否则不填充，导致不显示
- 2025.1.21(0.3.14) 表格如果设置了底纹，本处显示时，去掉了底纹，需要判断 drawParam 是否有值
- 2025.2.27(0.3.15) 工具栏增加了按比例显示功能、全屏、打印、下载、证书列表按钮
- 2025.3.15(0.3.16) 解决部分发票无法显示图片的问题
- 2025.3.16(0.3.17) 解决部分发票无法显示表格线的问题
