# vuepress 引入 calendar 官方 demo

目的是把如下图：

![图片](./img/calendar/1.png)

放到我的博客中，方便记录日常，以及之后更重要的东西

## 步骤

1.  经过 vuepress-theme-reco 的主题调研，已经成功配置了 Calendar.vue 用于展示布局。

2.  尝试将 Calendar 第三方插件的基础版放入其中，已经成功。

3.  尝试将 calendar 官方 demo 放入其中

    1.  首先将其拆分成三部分，分别是右侧边栏，上方工具栏和日历，然后在`layout`中统一调用，然后 css 样式在`layout`中统一引用，如图：

        ![图片](./img/calendar/2.png)

        但是因为红框的`bootstrap.min.css`是个框架级别的 css，会造成全局 css 污染，导致整个博客样式变形，所以修正为下图:

        ![图片](./img/calendar/3.png)

        但是`bootstrap.min.css`还是全局污染了，看了一遍`@import` 的规则后, 进行初步猜测，难道是`@import` 引入外部样式表错过了`scoped style`?又回想到此前看过的前端性能优化文章里面都有提到，在生产环境中不要使用`@import` 引入 css，因为在请求到的 css 中含有`@import`引入 css 的话，会发起请求把`@import`的 css 引进来，多次请求浪费不必要的资源。`@import`并不是引入代码到`<style scoped></style>`里面，而是发起新的请求获得样式资源，并且没有加`scoped`。于是修正为下图：

        ![图片](./img/calendar/4.png)

        ![图片](./img/calendar/13.png)

        这时候全局污染问题解决了，但是样式还是有问题，在控制台查看元素的 style，发现导入的样式没生效，以`icons.css`为例，对应的小图标都没有，在尝试放入子组件中，结果发现这个问题修复了，所以这个原因是<span style="color: red;">父组件的 scoped 无法作用到子组件中。</span>但是不可能在所有子组件都通过 scoped 引入 css 样式，这样 css 样式就会有重复的 N 份，很占体积。于是被迫将三个子组件又合并回`layout`中，这样就避免了父组件 css 的 scoped 特性在处理子组件 css 时候的麻烦问题。当然如果这里只是定制化的第三方插件的样式修正，也有父组件 css 穿透子组件 css 的方法，，可以[这样](https://vue-loader-v14.vuejs.org/zh-cn/features/scoped-css.html)，如图：

        ![图片](./img/calendar/5.png)

        但是可以看出它有 3 个局限性：1.必须写在 vue 文件的 style 样式中，这样才能被解析。2.只能简单定制化操作，如果是大规模引入第三方插件以及 demo，就想本例一样，工作量太大，不可行。3.它有 vue 的版本要求，旧一点的版本不支持。

        现在 demo 示例的代码都写在`layout`中，但是样式问题还是存在，首先是动态生成的 dom 元素上的 css 样式无法被 scoped！理由如下图：

        ![图片](./img/calendar/6.png)

        scoped 会在代码编译的时候给元素打上私有化标记，然后 css 选择器会准确定位到作用的元素，但是动态生成的 dom 上的元素则会跳过打上私有化标记的时机！

        解决思路如下：

        首先观察 calendars 组件需要引入的 css 样式有`tui-date-picker.css`,`tui-time-picker.css`, `tui-calendar.css`, `bootstrap.min.css`, `default.css`, `icons.css`,

        1.  `tui-date-picker.css`,`tui-time-picker.css`, `tui-calendar.css`, `icons.css`4 个有命名空间，所以不会污染全局 css，
        2.  `bootstrap.min.css`会污染全局 css，必须使用`<style src="" scoped></style>`
        3.  `default.css`没有命名空间，而且会污染全局 css，而且其中的`classname`有大量动态生成的代码引用，<span style="color: red;">所以将它加入命名空间</span>。如图：

            ![图片](./img/calendar/7.png)

        接着修正为如图：

        ![图片](./img/calendar/8.png)

        结果发现还是有 css 冲突，就是`bootstrap.min.css`的优先级有高于`default.css`的样式，但是我希望反过来！首先造成的原因有 2 个：

        1. scoped 的 css 带有选择器的特性，本来优先级就高于普通 css
        2. scoped 的 css 比`import`的 css 更靠后，按顺序看，优先级也更高。

        这里陷入了僵局，难道对`default.css`的内容进行拆分，一部分以 scoped 的方式加载，一部分以 import 的方式？但是这样动态生成的 dom 元素上的 css 样式无法被 scoped 问题和 scoped 的 css 优先级高于 import 的 css 问题会冲突。这时候灵光一闪，终极方案出现，修正如下图：

        ![图片](./img/calendar/9.png)

        相信不用解释，也能明白成功的原因了。

        <span style="color: red;">总结起来，引入第三方插件的 demo 示例的 css 样式成功的关键是：1.注意动态生成元素的 css 样式的全局设置，以命名空间做约束。2.注意样式优先级问题，尤其是 scoped 和 import2 种方式的优先级。3.注意父组件和子组件 css 穿透问题。</span>

        现在又遇到个新的 css 问题：在元素的 css 不存在问题的情况下，展示的元素大小有偏差，如图：

        ![图片](./img/calendar/10.png)

        后来定位原因如下图：

        ![图片](./img/calendar/11.png)

        可以分析出`bootstrap.min.css`是 scoped 的，所以这个样式不会被用到，当然，类似于这样的情况需要经验积累，见到一个修复一个。没别的系统的解决方案。在`default.css`中如下图：

        ![图片](./img/calendar/12.png)

    2.  css 问题处理完成，接下来就是 js 处理，因为要 vue 化，所以 import 和 require 的区别要了解

        `import Calendar from "tui-calendar";`的结果可以在 vue 的生命周期，比如 mounted 中使用，而

        ```js
        var tui = require("tui-calendar");
        window.tui = tui;
        console.log(tui);
        ```

        在 vue 的生命周期无法使用，它的使用场景是在其他 js 文件中引用 tui 的时候。

        引入 npm 包[chance](https://chancejs.com/usage/node.html)的时候，遇到了 2 个大坑，

        1. 使用`var chance = require("chance")`,结果发现这个`chance`是全局的，非本地的，怎么也引不到本项目的 node_modules 下的`chance`，后来才明白因为优先查找 ts 文件，查找顺序是从本项目的 node_modules 下的 chance 中是否有 ts——>找全局的 typescript 下的 chance 中是否有 ts——>node_module 下的 chance 中是否有 js，这个我是先修改了全局的 typescript 下的 chance 文件夹名称为 chance2，然后发现`chance`指向正常，才确定的，然后发现只要`yarn add @types/chance`，就可以在本项目下的 node_modules 下拥有 chance 的 ts 格式。这里面涉及到<span style="color: red;">一个知识点：引用 npm 包的查找路径！</span>
        2. 使用`var chance = require("chance")`后有错误提示`Uncaught (in promise) ReferenceError: global is not defined`，如图：

        ![图片](./img/calendar/14.png)

        这里耽误 4 个多小时，在 nodejs 中没什么问题，但是在 web 上会有，最后在[stackoverflow——Uncaught (in promise): ReferenceError: global is not defined](https://stackoverflow.com/questions/58693720/uncaught-in-promise-referenceerror-global-is-not-defined)中找到灵感，代码如下：

        ```js
        window.global = window;
        var chance = require("chance")();
        ```

        这里涉及到<span style="color: red;">一个知识点：global 到底是什么，在 nodejs 环境和 web 环境下，它有什么不同，这个在参考 jquery 的源码后，会得到一定的领悟！</span>

        尝试将公共的第三方插件的变量通过 ProvidePlugin 插件，不在需要每个文件都引用，需要处理的包括：moment，global，chance，jquery

        ```js
        chainWebpack: config => {
            // console.log(config.module);
            // webp Loader
            // 支持webp
            config.module
            .rule("webp")
            .test(/\.webp$/)
            .use("file-loader")
            .loader("file-loader")
            .end();
            config.plugin("provide").use(webpack.ProvidePlugin, [
            {
                $: "jquery",
                jquery: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                moment: "moment",
                global: [
                path.resolve(
                    __dirname,
                    "../../",
                    "theme-reco/vuepress-theme-reco/helpers/global.js"
                ),
                "global"
                ]
            }
            ]);
        },
        ```

        ```js
        // global.js
        export var global = typeof window !== "undefined" ? window : this;
        ```

        <span style="color: red;">一个知识点：注意 global.js 文件中公共变量的导出写法，以及在`webpack.ProvidePlugin`中的引用方式</span>，

        <span style="color: red;">一个知识点：global 如何作为全局变量，并且值为 web 环境下才有的 window 对象。这里参考了 jquery 的源码！</span>，如下图：

        ![图片](./img/calendar/15.png)

        至此：vuepress 引入 calendar 官方 demo 基本完成！

## 遇到的问题

### css 篇

### vuepress 配置篇

### js 篇
