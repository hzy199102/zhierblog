# vuessr 指南

## 完成一个基本示例

1. 安装
   `npm install vue vue-server-renderer vuex vue-router express vuex-router-sync --save`

2. 渲染一个 Vue 实例，与服务器集成
   `vue-server-renderer` 会将 Vue 实例渲染为 HTML，然后输出到客户端页面
   需要 `express`

3. 使用一个页面模板

   1. header 标签中设置`<meta charset="utf-8">`，这样客户端才不会是乱码
   2. `<!--vue-ssr-outlet-->` 注释 -- 这里将是应用程序 HTML 标记注入的地方。
      不加上这个模板是无效的，会报错：`throw new Error("Content placeholder not found in template.")`
   3. `<!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->`,
      `<!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->`
   4. renderToString 第二个参数提供的插值数据支持层次引用，即 模板中支持`meta.meta`

4. 服务器上的数据响应

   1. 每个请求应该都是全新的、独立的应用程序实例
   2. 因为实际的渲染过程需要确定性，所以我们也将在服务器上“预取”数据 ("pre-fetching" data) - 这意味着在我们开始渲染时，我们的应用程序就已经解析完成其状态。也就是说，将数据进行响应式的过 程在服务器上是多余的，所以默认情况下禁用。禁用响应式数据，还可以避免将「数据」转换为「响应式对象」的性能开销。

5. 组件生命周期钩子函数
   由于没有动态更新，所有的生命周期钩子函数中，只有 beforeCreate 和 created 会在服务器端渲染 (SSR) 过程中被调用。
   你应该避免在 beforeCreate 和 created 生命周期时产生全局副作用的代码，例如在其中使用 setInterval 设置 timer。

6. 构建步骤
   1. 需要使用 webpack 来打包我们的 Vue 应用程序
      1. 通常 Vue 应用程序是由 webpack 和 vue-loader 构建，并且许多 webpack 特定功能不能直接在 Node.js 中运行（例如通过 file-loader 导入文件，通过 css-loader 导入 CSS）。
      2. 尽管 Node.js 最新版本能够完全支持 ES2015 特性，我们还是需要转译客户端代码以适应老版浏览器。这也会涉及到构建步骤。

## demo 进阶

1. 加入路由

   1. 因为是 webpack 打包，所以会涉及到 vue-loader，涉及到 import 导入，之前的 demo 都是 require 导入，现在改为 import，必须 webpack 打包才行
   2. 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，以便服务器能够等待所有的内容在渲染前，就已经准备就绪。`router.onReady`,`router.getMatchedComponents()`
   3. 客户端和服务端都应该加入路由处理

2. 代码分割
   `const Foo = () => import('./Foo.vue')`

3. 数据预取和状态

   1. 在服务器端渲染(SSR)期间，我们本质上是在渲染我们应用程序的"快照"，所以如果应用程序依赖于一些异步数据，那么在开始渲染过程之前，需要先预取和解析好这些数据。
   2. 在服务器端，我们可以在渲染之前预取数据，并将数据填充到 store 中。此外，我们将在 HTML 中序列化(serialize)和内联预置(inline)状态。这样，在挂载(mount)到客户端应用程序之前，可以直接从 store 获取到内联预置(inline)状态。
   3. vuex
   4. vuex-router-sync
      组件与 Vuex 和 Vue-router 的逻辑完全分离，在 vuex 中本来无法使用 vue-router 的相关参数
   5. 带有逻辑配置的组件 (Logic Collocation with Components)
      我们在哪里放置「dispatch 数据预取 action」的代码？
      我们需要通过访问路由，来决定获取哪部分数据 - 这也决定了哪些组件需要渲染。事实上，给定路由所需的数据，也是在该路由上渲染组件时所需的数据。所以在路由组件中放置数据预取逻辑，是很自然的事情。
      我们将在路由组件上暴露出一个自定义静态函数 asyncData。注意，由于此函数会在组件实例化之前调用，所以它无法访问 this。需要将 store 和路由信息作为参数传递进去：
      1. 服务器端数据预取 (Server Data Fetching)
         在 entry-server.js 中，我们可以通过路由获得与 router.getMatchedComponents() 相匹配的组件，如果组件暴露出 asyncData，我们就调用这个方法。然后我们需要将解析完成的状态，附加到渲染上下文(render context)中。
         context 有合用？ 除了`router.push(context.url);`之外，就只有`context.state = store.state;`
         当使用 template 时，context.state 将作为`window.__INITIAL_STATE__`状态，自动嵌入到最终的 HTML 中。而在客户端，在挂载到应用程序之前，store 就应该获取到状态：

4. 自定义指令

## vue-hackernews-2.0 源码

## 扩展

### postinstall

参考资料：[npm: disable postinstall script for package](https://stackoverflow.com/questions/23505318/npm-disable-postinstall-script-for-package)

```json
// package.json
"scripts": {
    "dev": "node server",
    "start": "cross-env NODE_ENV=production node server",
    "build": "rimraf dist && npm run build:client && npm run build:server",
    "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js --progress --hide-modules",
    "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js --progress --hide-modules",
    "postinstall": "npm run build"
  }
```

### scrollBehavior

参考资料：[vue 组件的 scrollBehavior](https://www.jianshu.com/p/c805b74e1f14?utm_campaign)

如果`yarn install`或者`cnpm install`之后，会自动执行`postinstall`对应的命令，除非临时修正：`npm install --ignore-scripts`或者永久修正：`npm config set ignore-scripts true`

### SSR

参考资料：[webpack4、Koa 配置 Vue 服务器端渲染(SSR)](https://juejin.cn/post/6844903701434335246)
