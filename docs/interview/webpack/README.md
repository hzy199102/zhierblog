# webpack 知识点

这是 webpack 的世界

## tree shaking

### 选择一个概念

webpack 的 tree shaking

### 讲授这个概念（费曼技巧的灵魂）

1. tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。
2. 在一个纯粹的 ESM 模块世界中，识别出哪些文件有副作用很简单。然而，我们的项目无法达到这种纯度，所以，此时有必要向 webpack 的 compiler 提供提示哪些代码是“纯粹部分”。
   这种方式是通过 package.json 的 "sideEffects" 属性来实现的。
   ::: tip
   「副作用」的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。举例说明，例如 polyfill，它影响全局作用域，并且通常不提供 export。
   :::
   ::: tip
   注意，任何导入的文件都会受到 tree shaking 的影响。这意味着，如果在项目中使用类似 css-loader 并导入 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：
   :::
   ```json
   {
     "name": "your-project",
     "sideEffects": ["./src/some-side-effectful-file.js", "*.css"]
   }
   ```
   可以在 module.rules 配置选项 中设置 "sideEffects"
   ```js
   module.rules: [
   {
    include: path.resolve("node_modules", "lodash"),
    sideEffects: false
   }
   ]
   ```
3. 压缩输出
   我们已经可以通过 import 和 export 语法，找出那些需要删除的“未使用代码(dead code)”，然而，我们不只是要找出，还需要在 bundle 中删除它们。为此，我们将使用 -p(production) 这个 webpack 编译标记，来启用 uglifyjs 压缩插件。
   从 webpack 4 开始，也可以通过 "mode" 配置选项轻松切换到压缩输出，只需设置为 "production"。

### 查漏补缺

为了学会使用 tree shaking，你必须……

1. 使用 ES2015 模块语法（即 import 和 export）。
2. 在项目 package.json 文件中，添加一个 "sideEffects" 入口。
3. 引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin）。

### 简化语言和尝试类比

## ES6 模块的循环加载

[ES6 模块的循环加载](https://www.jianshu.com/p/d3bed7042fdc)
核心：函数具有提升作用

## Fetch 相比 Ajax 有什么优势？

## 代码分离

### 选择一个概念

webpack 的 代码分离

### 讲授这个概念（费曼技巧的灵魂）

1. 防止重复
   SplitChunks 插件

   1. 入口指的是 entry 中配置的对象，入口越多，index.html 中加载的 js 链接就越多，很容易存在公用模块
   2. node_modules 的模块应该单独打包，因为它们很少变动。

      ```js
      optimization: {
          splitChunks: {
          cacheGroups: {
              commons: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all"
              }
          }
          }
      },
      output: {
          filename: "[name].bundle.[chunkhash].js",
          path: path.resolve(__dirname, "dist")
      }
      ```

      chunkhash：使用基于每个 chunk 内容的 hash，这样能保证 node_module 的块不变，只有更改的块才会被替换，其他在浏览器会有缓存

   3. [webpack 的 splitChunk 造成 hash 一致但文件内容不一致的 bug](https://blog.csdn.net/zhaolandelong/article/details/89227170)
      hash 是个大块

   4. 相对于 CommonsChunkPlugin 插件的优势
      在进行缓存的时候，需要使用 chunkhash，如果使用 CommonsChunkPlugin，还要配合 HashedModuleIdsPlugin 或者 NamedModulesPlugin，更麻烦。

2. css 拆分
   ExtractTextWebpackPlugin 插件

3. bundle-loader: 用于分离代码和延迟加载生成的 bundle。

4. 动态导入和懒加载

   ```js
   function getComponent() {
     return import(/* webpackChunkName: "lodash" */ "lodash")
       .then(_ => {
         var element = document.createElement("div");

         element.innerHTML = _.join(["Hello", "webpack"], " ");

         return element;
       })
       .catch(error => "An error occurred while loading the component");
   }
   ```

   懒加载就是在需要的时候在加载，需要把他代码分离，才能做到，

5. 缓存

   ```js
   plugins: [
       new CleanWebpackPlugin(),
       new HTMLWebpackPlugin({
       title: "Caching"
       }),
       new webpack.ProvidePlugin({
       _: "lodash"
       })
   ],
   ```

   如果你遇到了至少一处用到 lodash 变量的模块实例，那请你将 lodash package 包引入进来，并将其提供给需要用到它的模块。

### 查漏补缺

1.

```js
module: {
  rules: [
    {
      // 一些传统的模块依赖的 this 指向的是 window 对象。当模块运行在 CommonJS 环境下这将会变成一个问题，也就是说此时的 this 指向的是 module.exports。
      // 可以通过使用 imports-loader 覆写 this
      // 注意此时不能在index.js的头部加入import了,但可以加入require
      test: require.resolve("./src/index.js"),
      use: "imports-loader?this=>window"
    },
    {
      // 某个库(library)创建出一个全局变量，它期望用户使用这个变量。
      // 们可以使用 exports-loader，将一个全局变量作为一个普通的模块来导出
      test: require.resolve("./src/globals.js"),
      use: "exports-loader?file,parse=helpers.parse"
    }
  ]
},
```

```js
// globals.js 某个库(library)创建出一个全局变量，它期望用户使用这个变量。
var file = "blah.txt";
var helpers = {
  test: function() {
    console.log("test something");
  },
  parse: function() {
    console.log("parse something");
  }
};
```

2. 加载 polyfills
   polyfills 虽然是一种模块引入方式，但是并不推荐在主 bundle 中引入 polyfills，因为这不利于具备这些模块功能的现代浏览器用户，会使他们下载体积很大、但却不需要的脚本文件。

   ```js
   <script>
      var modernBrowser = "fetch" in window && "assign" in Object;

      if (!modernBrowser) {
        var scriptElement = document.createElement("script");

        scriptElement.async = false;
        scriptElement.src = "/polyfills.bundle.js";
        var c = document.getElementsByTagName("script")[0];
        c.parentNode.insertBefore(scriptElement, c);
        // document.head.appendChild(scriptElement);
      }
    </script>
   ```

   ```js
   // polyfills.js
   import "babel-polyfill";
   import "whatwg-fetch";
   ```

   ```js
   // webpack.config.js
   optimization: {
   splitChunks: {
     cacheGroups: {
       commons: {
         // test: /[\\/]node_modules[\\/][^(?=(babel-polyfill|whatwg-fetch))][\\/]/,
         // 本来想用排除法，遇到babel-polyfill和whatwg-fetch不进行处理，但是babel-polyfill处理会有问题，所以忽略这个方法
         // test: /[\\/]node_modules[\\/](?!(lodash))/,
         test: /[\\/]node_modules[\\/]/,
         name: "vendors",
         // chunks: "all"
         chunks(chunk) {
           // 排除名字为`polyfills`的模块。
           // 这是最核心的配置
           return chunk.name !== "polyfills";
         }
       }
     }
   }
   },
   ```

## Service Worker

### 选择一个概念

Service Worker

参考资料：[Service Worker ——这应该是一个挺全面的整理](https://blog.csdn.net/huangpb123/article/details/89498418)

### 讲授这个概念（费曼技巧的灵魂）

1. Service Worker 是什么
2. Service Worker 使用方法
3. Service Worker 原理

### 查漏补缺

1. HTTP-SERVER 下的网页没有 navigator.serviceWorker，也就是不支持 Service Worker，用 express 去运行项目。
