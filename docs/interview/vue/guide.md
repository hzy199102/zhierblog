# vue3.0 项目搭建

## 基础搭建

1. 使用 vue-cli 初始化项目

   1. `vue create projectname`
   2. 这里需要注意，选择`Manually select features`，选择对应的插件，其中 css pre-processors 对应的就是 less,stylus,sass。如果是移植别的项目，最好别选 linter / Formatter

2. 安装基础 npm 包

   `npm install vue-resourse cross-env element-ui --save-dev`

3. package.json 配置命令

   ```json
   "scripts": {
   "serve": "vue-cli-service serve",
   "build": "vue-cli-service build",
   "serve-isv": "cross-env project=isv vue-cli-service serve",
   "lint": "vue-cli-service lint"
   },
   ```

4. webpack 相关
   目的是单个项目可运行多命令执行，每个文件夹对应一个子项目，每个子项目运行在不同端口上

   1. 根目录下创建 vue.config.js 和 build/runproject.js
      ```js
      // runproject.js
      var projects = {
        isv: {
          port: 8130
        }
      };
      module.exports = { projects };
      ```
      ```js
      // 注意，不能用import，一定要用require，所以runproject.js也要是commonjs写法：module.exports
      var { projects } = require("./build/runproject");
      const path = require("path");
      function resolve(dir) {
        return path.join(__dirname, `/${dir}`);
      }
      // 因为使用了"serve-isv": "cross-env project=isv vue-cli-service serve",另外安装了cross-env包。所以能获取对应的值
      console.log("project", process.env.project);
      module.exports = {
        // 官网有配置详解
        devServer: {
          port: projects[process.env.project].port // 指定打开浏览器的端口号
        },
        // 生成环境，所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，唯二的限制是
        // 1. 当使用基于 HTML5 history.pushState 的路由时
        // 2. 当使用 pages 选项构建多页面应用时。
        publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
        // 多页面，相对路径的 publicPath 有一些使用上的限制。在以下情况下，应当避免使用相对 publicPath:当使用 pages 选项构建多页面应用时。
        // pages: {
        //   index: {
        //     // page 的入口
        //     entry: resolve(`${process.env.project}/src/main.js`),
        //     // 模板来源
        //     template: resolve(`${process.env.project}/index.html`)
        //   }
        // },
        // 和configureWebpack都能达到修改配置的效果，但是这样的修正更高级
        chainWebpack: config => {
          // 选择对应的模板index.html
          config.plugin("html").tap(args => {
            // console.log(args);
            args[0].template = resolve(`${process.env.project}/index.html`);
            return args;
          });
          // 设置别名
          config.resolve.alias
            .set("@common", resolve("common"))
            .set("@api", resolve("api"))
            .set("@", resolve(`${process.env.project}/src`));
        },
        // 可以console.log(config)看看具体内容，本来想用pages进行多页配置，后来发现publicPath变得不灵活，就放弃了。
        configureWebpack: config => {
          config.entry.app = [resolve(`${process.env.project}/src/main.js`)];
          if (process.env.NODE_ENV === "production") {
            // 为生产环境修改配置...
          } else {
            // 为开发环境修改配置...
          }
          // console.log(config);
        }
      };
      ```

5. 遇到的坑

   1. No inputs were found in config file 'tsconfig.json'
      解决方案，其实只要在 include 目录中，任意新增一个 ts 文件即可通过编译。

      ```json
      "include": [
      "src/**/*.ts",
      "src/**/*.tsx",
      "src/**/*.vue",
      "tests/**/*.ts",
      "tests/**/*.tsx"
      ],
      ```

6. 复盘
   1. 如何修正 webpack 相关配置，包括指定 build 目录，更新 index.html 模板，设置别名，设置部署应用包时的基本 URL，设置调试模式的端口号，
      chainWebpack 和 configureWebpack 的区别和使用方式等等
   2. 如果传递命令行参数
   3. 注意 import 写法和 require 写法
   4. 如何快速移植旧的项目
   5. 注意如何处理第三方插件
