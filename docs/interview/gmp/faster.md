# 提升 PC 端网页的性能

## 减少链接数

### 背景

PC 端软件可以内嵌多个网页，每个网页都是独立的，所以在打开软件的时候，所有网页的请求会一并发出，这是个较大的并发量，但是经过分析，用户在使用软件的时候，很多时候并不是为了浏览内嵌的网页，而是要正常的进行工作，很多内嵌网页基本处于隐藏状态，但是它们却都加载了，但它们基本都软件被关闭都不会被切换显示和浏览使用，所以这部分网页是可以被优化处理的。

### 方法

1. 如何判断网页是否是显示状态

   一开始希望软件提供接口，但是存在 2 个问题：

   1. 软件发版是个很重的操作，而且每个软件都需要有这样的接口，就意味着需要每个软件都发新版。
   2. 即时软件都发新的版本，用户也不一定都会更新，所以还需要设计兼容以前的版本。

   但是如何在网页上就能通过 js 判断是否显示呢？[【第 2037 期】深入了解页面生命周期 API](https://mp.weixin.qq.com/s/R_qYZtK2ZZA_d5FgJXLvwA)给了我灵感，核心就在`document.visibilityState`，经过测试，内嵌网页上支持。所以思路变成刚开始网页判断是否处于隐藏状态，如果是，就不进行 api 请求！这个可以通过一个定时器去处理，
   只要记住在合适的时候注销定时器，防止内存溢出。

   现在有了更好的做法：

   ```js
   document.addEventListener("visibilitychange", function() {
     console.log(document.visibilityState);
   });
   ```

## 减少 js 体积

1. 缓存 js（不可行）

   想要像浏览器一样，硬盘缓存，但是因为之前的历史原因，硬盘缓存的设置被去掉了，所以软件打开必然请求 js 文件。

2. js 文件在内嵌网页上共用

   这个思路是针对软件设计的特定方案，因为软件中的内嵌网页是可以互相通信的，而且网页也只运行在软件上，所以没有太多兼容性的顾虑，直接在一个网页中下载公用 js，然后通过广播以字符串的形式发送给其他网页，那问题的核心在于：

   1. 指定的网页如何下载 js 代码，并运行和发送给其他网页，
   2. 公用 js 代码具体包含哪些？vue,vue-router,axios,vue-resource,element-ui，然后怎么把它们分离成独立的第三方 js 文件
   3. 其他网页在收到这些 js 文件的字符串之后，如何正确运行它们
   4. 是否有其他兼容性措施，在上述途径出问题的时候，网页还能正常运行

3. 组件级别的延迟加载

   这个思路取决于[【第 2147 期】交互导入模式](https://mp.weixin.qq.com/s/6O3CYnzbBCHrUWeYG-Yx4Q)

### 步骤

1. 先拆分一个 vue.js，在 gmp-side 和 gmp-project 上看下效果。

   1. 以 gmp-side 和 gmp-project 项目为例，本地正常运行的情况下，gmp 为基础网页，负责下载公共 js，gmp-project 则接收下载好的公共 js 文件，以 vue.js 为例，看效果。

      ![图片](./img/faster/2.png)

      从上图可看出，未移植出 vue 的 npm 包前，app.js 为 2.1M。

   2. 先根据 package.json 和 node_modules 判断 vue 的版本，然后从官网下载对应的 js 文件：[vue@2.6.11.min.js](https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js)，[vue@2.6.11.js](https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.js)，本地连调环境用未压缩版，方便调试。然后通过 jenkins 部署到稳定的 cdn 上。
   3. gmp-side 上通过原生 xhr 下载 vue.js，然后通过`new Function(source.vuejs)(window);`的方式将`Vue`绑定到 window，这一步非常关键。用 eval 是做不到的。另一方面，设定请求为同步请求。

      ```js
      initJS: function() {
        var source = {
        vuejs: ""
        };
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            window.onSendVuejs = function() {
                // console.log(source.vuejs.length);
                // console.log(source.vuejs);
                MainInteractor.broadcast("getVuejs",base64.Base64.encode(
                source.vuejs
                ));
            };
            source.vuejs = xhr.responseText;
            MainInteractor.registerCallBack("sendVuejs", "onSendVuejs");
            // eval(source.vuejs);
            new Function(source.vuejs)(window);
            // console.log(Vue);
            console.log(2222);
            } else {
            //
            }
        }
        };
        xhr.open(
        "get",
        "https://aecore-static.glodon.com/prod-ops/gmp-cdn/vue@2.6.11.js",
        // "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.js",
        false
        );
        xhr.send(null);
        console.log(222222);
      },
      ```

   4. 因为 vue 库在各个地方都有用到，import 语法始终会导致 vue 在没被初始化的时候被别的地方使用，比如 vue-reosure，所以使用
      `import("@common/middleware/qwebmiddleware.js").then(async qtInteractor => {...}`语法，完美解决这个问题。
   5. 通过广播的方式，将 vue.js 文件传递给 gmp-project，但是发现传递失败，原来，vue.js 的内容虽然是字符串，但是有特殊字符，作为参数被广播的时候无法被识别，所以用 base64 加密传递。
   6. gmp-project 的接受方式如下：

      ```js
      initJS2: function() {
          var timer = null;
          var source = {
          vuejs: ""
          };
          window.onGetVuejs = function(str) {
          // console.log(base64.Base64.decode(str));
          clearInterval(timer);
          if (source.vuejs) return
          source.vuejs = base64.Base64.decode(str)
          new Function(source.vuejs)(window);
          window.onFinishVuejs()
          };
          MainInteractor.registerCallBack("getVuejs", "onGetVuejs");
          timer = setInterval(() => {
          MainInteractor.broadcast("sendVuejs", "");
          }, 250);
      }
      ```

      ```js
      // import Vue from "vue";
      import App from "./App";
      /**
       * 引入element-ui控件
       */
      import ElementUI from "element-ui";
      import "element-ui/lib/theme-chalk/index.css";
      /**
       * 引入公共样式
       */
      import "@common/css/gmp/gmp.css";
      /**
       * 引入公共方法库
       */
      import ToolManager from "@common/js/ToolManager.js";
      /**
       * 引入qt中间件
       */
      import("@common/middleware/qwebmiddleware.js").then(
        async qtInteractor => {
          window.onFinishVuejs = function(str) {
            console.log(222);
            /**
             * 引入api
             */
            import("@common/api/index").then(interceptor => {
              Vue.use(ElementUI);

              Vue.prototype.api = interceptor.default;

              Vue.prototype.ToolManager = ToolManager;
              /**
               * 另外建立一条事件线
               */
              Vue.prototype.eventHub = Vue.prototype.eventHub || new Vue();

              /**
               * 初始化
               */
              var app = new Vue({
                el: "#app",
                render: h => h(App),
                created: function() {
                  this.eventHub.$on("Authorization", function(Authorization) {
                    console.log("Authorization", Authorization);
                    Vue.http.headers.common["Authorization"] = Authorization;
                  });
                }
              });
              // 将vue实例传入interceptor中
              interceptor.default.init(app);
            });
          };
          await qtInteractor.default.init({
            // source: "gmp-side"
          });
        }
      );
      ```

   7. 现在看下 gmp-project 的最终请求流量：

      ![图片](./img/faster/3.png)

      上图的 app.js 变成 1.8M，少了 300K，效果明显。

2. 在 vendor.js 中发现 vue-resource，vue，jquery，mock，其中 mock 在生产环境不在需要。发现技巧是搜索`/*!`，任何包开头都会有注释。<span style="color: red;">而且包括版本号。</span>
   vendor.js 是依赖的第三方库，它上面的内容都可以参照 vue.js 的处理手段。
   这里曾经遇到一个坑，我本打算直接使用这个第三方库，就是 gmp-side 下载这个 vendor.js，然后 gmp-project 接受这个文件，但是发现不行，原因有 2 个：

   - 核对 gmp-side 和 gmp-project 的 vendor.js 的内容是不是一样。这是通过对比得出的，虽然大体看就是一样，但是文件对比显示不一样。
   - 不同网页可能用到的 vendor 内容也不一样，有的用到 vue-router，有的没用到，所以这条路不灵活。

   终上所述，还是决定在 vendor.js 中一个个核对 npm 包，把它们一一下载并上传到稳定的 cdn 源上，之前想用官方 cdn，后来发现很不稳定，不能用于企业级应用，就是 demo 级别的。

3. 接下来要做的是把 eleme-ui，vue，vue-resource，jquery，mock 全部做一样的处理，关键在于怎么设计出满足生产环境和开发环境的架构。这是接下来要处理的。

   1. 尝试剥离 elemetUI，这时候会涉及到异步下载多文件，但是下载完成之后同步执行的问题，所以最好使用 promise 来控制，并且用回调函数的方法保证正确的执行顺序

      ![图片](./img/faster/4.png)

      如图，app.js 已经降到 1.3M 了。

      ```js
      initJS: function(obj) {
        var source = {};
        var downloadArr = [];
        for (var i = 0; i < obj.needjs.length; i++) {
          downloadArr.push(this.download[obj.needjs[i]]());
        }
        Promise.all(downloadArr)
          .then(res => {
            for (var i = 0; i < res.length; i++) {
              console.log("初始化公共文件:" + obj.needjs[i]);
              source[obj.needjs[i]] = res[i];
              new Function(base64.Base64.decode(res[i]))(window);
            }
            window.onSendNeedjs = function(str) {
              MainInteractor.broadcast("getNeedjs", JSON.stringify(source));
            };
            MainInteractor.registerCallBack("sendNeedjs", "onSendNeedjs");
            // console.log(Vue);
            obj.next && obj.next();
          })
          .catch(err => {
            console.log(err);
          });
      },
      download: {
        common: function(obj) {
          return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                  resolve(base64.Base64.encode(xhr.responseText));
                } else {
                  //
                }
              }
            };
            xhr.open("get", obj.url, false);
            xhr.send(null);
          });
        },
        "vue-js": function() {
          return this.common({
            url: "https://aecore-static.glodon.com/prod-ops/gmp-cdn/vue@2.6.11.js"
            // url: "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.js"
          });
        },
        "element-ui-js": function() {
          return this.common({
            url:
              "https://aecore-static.glodon.com/prod-ops/gmp-cdn/element-ui@2.13.0.min.js"
          });
        }
      },
      /**
      * 附属页面发送广播获取共享js，并且处理接受来的共享js
      * @param {*} obj
      *    needjs：需要的共享js的数组，例：["vue-js", "element-ui-js"]
      */
      initJS2: function(obj) {
        var timer = null;
        var source = null;
        window.onGetNeedjs = function(str) {
          clearInterval(timer);
          if (source) return;
          source = JSON.parse(str);
          for (var i = 0; i < obj.needjs.length; i++) {
            if (source[obj.needjs[i]]) {
              console.log("初始化公共文件:" + obj.needjs[i]);
              new Function(base64.Base64.decode(source[obj.needjs[i]]))(window);
            } else {
              console.log("公共文件不存在:" + obj.needjs[i]);
            }
          }
          // console.log(Vue);
          obj.next && obj.next();
        };
        MainInteractor.registerCallBack("getNeedjs", "onGetNeedjs");
        timer = setInterval(() => {
          // 全部公共文件都要获取，但是可以按needjs指定初始化其中部分
          MainInteractor.broadcast("sendNeedjs", obj.needjs.join(","));
        }, 250);
      }
      ```

      ```js
      // import Vue from "vue";
      import App from "./App";
      /**
       * 引入element-ui控件
       */
      // import ElementUI from "element-ui";
      import "element-ui/lib/theme-chalk/index.css";
      /**
       * 引入公共样式
       */
      import "@common/css/gmp/gmp.css";
      /**
       * 引入公共方法库
       */
      import ToolManager from "@common/js/ToolManager.js";
      /**
       * 引入qt中间件
       */
      import("@common/middleware/qwebmiddleware.js").then(
        async qtInteractor => {
          var next = str => {
            /**
             * 引入api
             */
            import("@common/api/index").then(interceptor => {
              // Vue.use(ElementUI);

              Vue.prototype.api = interceptor.default;

              Vue.prototype.ToolManager = ToolManager;
              /**
               * 另外建立一条事件线
               */
              Vue.prototype.eventHub = Vue.prototype.eventHub || new Vue();

              /**
               * 初始化
               */
              var app = new Vue({
                el: "#app",
                render: h => h(App),
                created: function() {
                  this.eventHub.$on("Authorization", function(Authorization) {
                    console.log("Authorization", Authorization);
                    Vue.http.headers.common["Authorization"] = Authorization;
                  });
                }
              });
              // 将vue实例传入interceptor中
              interceptor.default.init(app);
            });
          };
          await qtInteractor.default.init({
            source: "gmp-project",
            next: next,
            needjs: ["vue-js", "element-ui-js"]
          });
        }
      );
      ```

   2. 尝试剥离 elemetUI 的 css 文件，这个和 js 的处理方式又不同，怎么运行 css 字符串呢？

      ![图片](./img/faster/5.png)

      如图，app.js 已经降到 1.1M 了。

      ```js
      // 没做兼容性处理，但是在qt上已经有效
      includeStyleElement: function(styleId, styles) {
        if (document.getElementById(styleId)) {
          return false;
        }
        var style = document.createElement("style");
        style.id = styleId;
        (document.getElementsByTagName("head")[0] || document.body).appendChild(
          style
        );
        style.appendChild(document.createTextNode(styles));
      },
      ```

   3. 尝试剥离 vue-resource，按之前的套路，没啥难度，但是，app.js 的体积没减少，很奇怪，可能是其他地方减少了

   4. 尝试剥离 jquery，[jquery 源码](http://code.jquery.com/jquery-3.4.1.min.js)

      这里遇到个问题，就是

      ```js
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
      }),
      ```

      jquery 是在 webpack 全局注入的，为了不影响其他项目，所以要在 webpack 上根据项目的不同特殊处理。

      ![图片](./img/faster/6.png)

      如图，app.js 已经降到 930k 了。

   5. 尝试移除 mock，因为并不需要，这个的确是框架需要的，尤其是开发环境，但是目前根本没用到，但是阴差阳错一直在，去掉它。至少在生产环境要去掉。

      目前在没啥区别，但是在打包之后就能发现明显体积差别。

   6. 最后看下生产环境优化前后的对比：

      ![图片](./img/faster/7.png)

4. 待优化项目：

   1. element-ui 也可以按需加载，目前是全部加载

5. 至此，js 文件在内嵌网页上共用完成，就差组件级别的延迟加载。

## 图片处理

图片是最耗流量的地方，优化方式两种：

### 定制化裁剪

为什么叫定制化裁剪，因为每一个模块下的图片的裁剪方式都不一样，需要深入核对，使用[华为云裁剪](https://support.huaweicloud.com/fg-obs/obs_01_0430.html).

以右侧边栏为例，它的展示要求如下：

1. 图片内容居中裁剪
2. 图片尺寸固定 260 \* 140
3. 原图都是宽高比大于展示区域的宽高比
4. 可以容忍图片分辨率的细微降低

原来效果如下图，但是它其实是一张 1145 \* 350，体积 83.5kb 的大图

![图片](./img/faster/9.png)

做了华为云横向裁剪，`?x-image-process=image/resize,limit_1,w_260`，结果图片是 260 \* 79，体积 9.3kb

![图片](./img/faster/8.png)

为什么图片模糊，因为这个模块的图片应该是 260 \* 140，居中缩放裁剪，仔细观察原图，是个横向远大于纵向的，所以裁剪之后的图片为了加载在指定区域还被迫做了纵向拉伸，所以变形。

那么改为华为云纵向裁剪，`?x-image-process=image/resize,limit_1,m_lfit,h_140`，结果图片是 458 \* 140，体积 23kb

![图片](./img/faster/10.png)

这样已经达到效果，但是还有欠缺，下载的图片还是比展示区域要大，要在浏览器上进行居中裁剪，能不能直接下发一个满足条件的图片呢？可以！
`?x-image-process=image/resize,limit_1,m_fill,w_260,h_140`，结果图片是 260 \* 140，体积 20.1kb

![图片](./img/faster/11.png)

其实仔细看图片会比原图模糊一点点，这个需求方表示可以容忍就算可行！

<span style="color: red;">这里有个关键点，如果是高清大图，强行显示在一个很小的区域，会出现渲染失真的问题，所以在小区域尽量不要使用高清大图。</span>

现在图片优化方案已经完成可行，但是是以上述限定条件来说的，其他模块的图片，可能就不能用现在这个方案了，所以说这是定制化的方案。

### 整体效果预览

1. 优秀案例

改造前

![图片](./img/faster/14.png)

改造后

![图片](./img/faster/12.png)

2. 课程学习

改造前

![图片](./img/faster/15.png)

改造后

![图片](./img/faster/13.png)

3. 积分商城

改造前

![图片](./img/faster/16.png)

改造后

![图片](./img/faster/17.png)
