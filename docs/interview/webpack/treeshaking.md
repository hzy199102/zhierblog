# tree shaking

移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export

本次使用的是 webpack4.0+，这是重点。

参考文档：[Webpack 4 Tree Shaking 终极优化指南](https://www.bbsmax.com/A/obzbDr365E/),[Webpack 4 教程 - 第七部分 减少打包体积与 Tree Shaking](https://www.cnblogs.com/powertoolsteam/p/10621660.html),[tree shaking](https://www.webpackjs.com/guides/tree-shaking/)

## 目标

项目引入 lodash，但只使用其中的部分功能，希望打包的时候也只带包引用到的部分，减少文件体积。

## 遇到的坑以及解决方案

1. `mode: "produnction"`的作用

   1. webpack4 中，如果不在 package.json 中配置`mode`，默认就是`mode: "produnction"`，在运行打包命令的时候会有如下提示：
      `The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.`
   2. UglifyJsPlugin 插件在`mode: "produnction"`情况下是默认被启动的，Webpack 只有在压缩代码的时候会 tree-shaking，而这只会发生在生产模式中。
   3. `optimization.usedExports`设置成 true, 同样在 `mode: "produnction"`时被默认添加上去了，这意味着 Webpack 将识别出它认为没有被使用的代码，并在最初的打包步骤中给它做标记。

2. `sideEffects`的作用

   1. 在一个纯粹的 ESM 模块世界中，识别出哪些文件有副作用很简单。然而，我们的项目无法达到这种纯度，所以，此时有必要向 webpack 的 compiler 提供提示哪些代码是“纯粹部分”。
   2. 「副作用」的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。举例说明，例如 polyfill，它影响全局作用域，并且通常不提供 export。
   3. 如果一个包的作者想要提供信息以标识它的库没有副作用，他可以在包的 package.json 文件里做这件事情。如果你查看 lodash 代码库的 package.json 文件，你可以看到它有一个"sideEffects: false"。
   4. Webpac 默认会忽略 sideEffect 标识。如果想改变这种行为，我们需要把 optimization.sideEffects 设置成 true。你可以手动设置，或者通过 `mode: "produnction"`实现。
   5. 注意，任何导入的文件都会受到 tree shaking 的影响。这意味着，如果在项目中使用类似 css-loader 并导入 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：
      ```js
      {
      "name": "your-project",
      "sideEffects": [
        "./src/some-side-effectful-file.js",
        "*.css"
      ]
      }
      ```
      或者：
      ```js
      module: {
        rules: [
          {
            test: /regex/,
            use: [loaders],
            sideEffects: true,
          },
        ];
      }
      ```
   6. 只测试项目引入 lodash 时，这个东西可以不设置，`mode: "produnction"`帮我们处理好了一切。

3. ProvidePlugin 插件的作用

   ```js
    plugins: [
     new CleanWebpackPlugin(),
     new HTMLWebpackPlugin({
       title: "Caching"
     }),
     new webpack.ProvidePlugin({
       // _: "lodash-es"
       _join: ["lodash-es/join", "default"]
     })
   ],
   ```

   ::: tip lodash 的无底坑

   - 如果你打算对函数库进行 tree shaking，你需要记得上一段提到的是事情：使用 ES6 模块，而它并不是总是被函数库使用。一个绝佳的例子是 lodash。如果你去看它提供的产品代码，可以清楚地看到它并没有使用 ES6 模块。它本身是 commonjs 模块，但是它有一个 lodash-es 版本，用的是 es2015 模块。所以一定要`npm install lodash-es --save-dev`
   - webpack.ProvidePlugin 的设置意义是：如果你遇到了至少一处用到 lodash 变量的模块实例 join，那请你将 lodash package 包中的 join 模块引入进来，并将其提供给需要用到它的模块。注意写法：
     `_join: ["lodash-es/join", "default"]`，网络上就没有写对的，错误写法是`_join: ["lodash-es", "join"]`，导致打包压缩无效，导致大部分人都是直接在业务代码中`import { join } from "lodash-es";`去引用。
     :::

4. es2015 模块 Babel 配置
   Babel 不支持将其他模块系统编译成 es2015 模块。但是，如果你是前端开发人员，那么你可能已经在使用 es2015 模块编写代码了，因为这是全面推荐的方法。因此，为了让我们编译的代码使用 es2015 模块，我们需要做的就是告诉 babel 不要管它们。

   ```js
   module: {
      rules: [
        {
          test: /\.js$/,
            exclude: /(node_modules)/,
              use: {
              loader: 'babel-loader',
                options: {
                  presets: ['env', { modules: false }]
                }
              }
        }
      ]
    },
   ```

   或者

   ```js
   // es2015 模块的基本 Babel 配置
   const config = {
     presets: [
       [
         "[@babel/preset-env](http://twitter.com/babel/preset-env)",
         {
           modules: false,
         },
       ],
     ],
   };
   ```

   把 modules 设置为 false，就是告诉 babel 不要编译模块代码。这会让 Babel 保留我们现有的 es2015 import/export 语句。

5. 代码拆分
   因为 lodash 被使用的部分太少，所以它不会被代码拆分，代码拆分的原则具体参考：[SplitChunksPlugin](https://www.webpackjs.com/plugins/split-chunks-plugin/)
   注意，在 webpack4 中，已经不用 CommonsChunkPlugin 插件了，改用 SplitChunksPlugin 插件了，相对于 CommonsChunkPlugin 插件的优势
   1. 进行缓存的时候，需要使用 chunkhash，如果使用 CommonsChunkPlugin，还要配合 HashedModuleIdsPlugin 或者 NamedModulesPlugin，更麻烦。

## demo

1. webpack.config.js

```js
module.exports = {
  entry: {
    index: "./src/index.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      title: "Caching",
    }),
    new webpack.ProvidePlugin({
      // _: "lodash-es"
      _join: ["lodash-es/join", "default"], //
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  output: {
    filename: "[name].[chunkhash].js",
    // chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  // The 'mode' option has not been set, webpack will fallback to 'production' for this value
  // mode: "development"
};
```

2. index.js

   ```js
   // import _join from "lodash-es/join";
   function component() {
     var element = document.createElement("div");

     // Lodash, now imported by this script
     element.innerHTML = _join(["Hello", "webpack"], " ");

     return element;
   }

   document.body.appendChild(component());
   ```
