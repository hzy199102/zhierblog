# import-maps

## 参考资料

1. [import-maps git](https://github.com/WICG/import-maps)
1. [import-maps git 中文](https://www.jianshu.com/p/b23d823a183a)
1. [joeldenning/import-map-overrides](https://github.com/joeldenning/import-map-overrides#user-interface)

   目前我不太理解这个的场景，核心意思如下：

   导入映射是一种控制从哪个 URL 下载 javascript 模块的方法。import-map-overrides 库允许您通过将替代存储在本地存储中来动态更改 javascript 模块的 url。这使开发人员可以在模块开发期间覆盖各个模块以指向其本地主机，而不必与所有其他模块和后端服务器一起启动本地环境。
   您不应该将 import-map-overrides 用作页面上的唯一导入地图，因为您不能依靠每个人对所有模块具有有效值的本地存储。相反，应该将 import-map-overrides 视为开发人员体验增强和开发工具-开发人员可以在部署的环境上进行开发和调试，而不必启动本地环境。

## 概念

- 允许直接 import 标志符，就能在浏览器中运行，比如：import moment from "moment。[模块标识符映射](./improt-maps.md#模块标识符映射)
- 提供兜底解决方案，比如 import \$ from "jquery"，他先会去尝试去 CDN 引用这个库，如果 CDN 挂了可以回退到引用本地版本。[类 URL 的重映射](./improt-maps.md#类-url-的重映射)，
  [兜底方案](./improt-maps.md#兜底方案)
- 开启对一些内置模块或者其他功能的 polyfill。
- 共享 import 标识符在 Javascript importing 上下文或者传统的 url 上下文，比如 fetch()、<img src="">或者<link href="">。

他的主要机制是通过导入 import map（模块和对应 url 的映射），然后我们就可以在 HTML 或者 CSS 中接受使用 url 导入模块的上下文替换成 import: URL scheme 来导入模块。

示例：

```js
import moment from "moment";
import { partition } from "lodash";
```

这样写纯粹的标识符会抛出错误，（简单来说只能允许/ ./ ../开头的标识符）。

但是如果有了 import map：

```js
<script type="importmap">
{
  "imports": {
    "moment": "/node_modules/moment/src/moment.js",
    "lodash": "/node_modules/lodash-es/lodash.js"
  }
}
</script>
```

那种纯粹的写法就能被解析为：

```js
import moment from "/node_modules/moment/src/moment.js";
import { partition } from "/node_modules/lodash-es/lodash.js";
```

在 import:URL Schema 的场景下：

```html
<link rel="modulepreload" href="import:lodash" />
```

## 场景

### 模块标识符映射

```js
{
  "imports": {
    "moment": "/node_modules/moment/src/moment.js",
    "lodash": "/node_modules/lodash-es/lodash.js"
  }
}
```

在设置了这个 import map 之后，

```js
import moment from "moment";
import("lodash").then(_ => ...);
```

以上这种写法就能在 js 里直接支持。

:::tip 路径问题
需要注意的是映射的 value，必须以/、./或者../开头，或者是一个能够识别的 url。在这个示例中的是一个类相对路径的地址，它会根据 import map 的基本路径进行解析，比如：内联的 import map，它的基础路径就是页面 url，而如果是外部资源的 import map（<script type="importmap" src="xxxxx" />）那么它的基础路径，就是这个 script 标签的 url。
:::

### package 的斜杠语法

在 nodejs 或者打包环境中，我们经常会写这样的语句 import localeData from "moment/locale/zh-cn.js"; ，他并非一个纯粹的库名，而是前缀固定，然后相对寻址去拿对应文件。而之前，我们都是说的支持纯粹的库名来 map 一个 url，其实这样的写法也是可以支持的，只需要配置 importmap：

```js
{
  "imports": {
    "moment": "/node_modules/moment/src/moment.js",
    "moment/": "/node_modules/moment/src/",
    "lodash": "/node_modules/lodash-es/lodash.js",
    "lodash/": "/node_modules/lodash-es/"
  }
}
```

import map 通过识别以/结尾的的 key 值，来完成这样的功能，于是以下的写法都能支持：

```js
import localeData from "moment/locale/zh-cn.js";
import fp from "lodash/fp.js";
```

### 类 URL 的重映射

`Import maps` 特别允许类 URL 标识符的重新映射，它的其中一个优势是做兜底 url 映射。

可以用本地版本 vue 来替代全局任何从 cdn 获取的 vue。如下：

```js
{
  "imports": {
    "https://www.unpkg.com/vue/dist/vue.runtime.esm.js": "/node_modules/vue/dist/vue.runtime.esm.js"
  }
}
```

### 无扩展名 imports（鸡肋）

在 nodejs 或者打包环境中，我们也经常 import 某个文件，省略其扩展名，import map 没有这样高级的功能去一直寻址扩展名，但是我们能够直接配置缺失的扩展名在 import map 上。

```js
 {
   "imports": {
     "lodash": "/node_modules/lodash-es/lodash.js",
     "lodash/": "/node_modules/lodash-es/",
     "lodash/fp": "/node_modules/lodash-es/fp.js",
   }
 }
```

这样不仅我们能够支持 `import fp from "lodash/fp.js"` 而且还能支持 `import fp from "loadsh/fp"`。

尽管这个例子展示了如何允许使用 `import map`实现无扩展的导入，但并不一定需要这样做。这样做会使 `import map` 臃肿，并使包的接口对人对工具都变得不是那么简单。

### 映射脚本中的 hash (很有用)

脚本文件名中通常包含 hash 值，为了改善 web 的缓存能力。详见：[Caching best practices & max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/), 或者 [利用长期缓存](https://developers.google.com/web/fundamentals/performance/webpack/use-long-term-caching)。

在模块依赖的图中，这会存在一个问题：

- 考虑一种没有 hash 值场景，app.mjs 依赖 dep.mjs，dep.mjs 依赖 sub-dep.mjs。当我们改了 sub-dep.mjs，app.mjs 和 dep.mjs 依然缓存着的，我们只需要替换 sub-dep.mjs 即可。
- 但是如果加了 hash 值，例如：app-8e0d62a03.mjs, dep-16f9d819a.mjs, 和 sub-dep-7be2aa47f.mjs，当我们改了 sub-dep.mjs 之后它的 hash 值会发生变化（如果不知道为什么的先去了解下加 hash 的原因），由于 dep.mjs 依赖的 sub-dep.mjs hash 值发生了变化，那么 dep 要更替依赖，那么 dep 的 hash 值也会发生变化，以此类推 app 的 hash 值也会发生变化，，那么这样依赖浏览器的缓存效率全失。

Import maps 提供了一个途径来解决这样的窘境，通过解耦 import 语句中模块的标识符，例如：

```js
{
  "imports": {
    "app.mjs": "app-8e0d62a03.mjs",
    "dep.mjs": "dep-16f9d819a.mjs",
    "sub-dep.mjs": "sub-dep-7be2aa47f.mjs"
  }
}
```

那我们就可以用 import "./sub-dep.mjs"替代 import "./sub-dep-7be2aa47f.mjs"，如果我们的 sub-dep.mjs 发生了变化，我们只需要更新我们的 import maps：

```js
{
  "imports": {
    "app.mjs": "app-8e0d62a03.mjs",
    "dep.mjs": "dep-16f9d819a.mjs",
    "sub-dep.mjs": "sub-dep-5f47101dc.mjs"
  }
}
```

这样即使 sub-dep.mjs 更新了，但是 dep.mjs 里的 import "sub-dep.mjs"这句话也不会发生变化，那么它仍然可以继续缓存在浏览器中，同样 app.mjs 也如此。

### 兜底方案

#### 第三方模块

这就是我们之前说的如果 CDN 挂了，回退到访问本地的库的例子。我们通常使用这个方案 terrible document.write()-[using sync-script-loading hacks](https://www.hanselman.com/blog/cdns-fail-but-your-scripts-dont-have-to-fallback-from-cdn-to-local-jquery) 来解决这个问题。

```html
<script src="http://ajax.aspnetcdn.com/ajax/jquery/jquery-2.0.0.min.js"></script>
<script>
  if (typeof jQuery == "undefined") {
    document.write(
      unescape(
        "%3Cscript src='/js/jquery-2.0.0.min.js' type='text/javascript'%3E%3C/script%3E"
      )
    );
  }
</script>
```

现在 import maps 提供了一种能力来控制模块的解析，这样做能更好。

使用一个兜底数组来提供兜底链接：

```js
{
  "imports": {
    "jquery": [
      "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js",
      "/node_modules/jquery/dist/jquery.js"
    ]
  }
}
```

先加载 CDN 的资源，如果挂了，就加载本地 node_modules 里的资源（回退策略只会生效一次，之后便会缓存所有的功能）。
`"jquery": "/node_modules/jquery/dist/jquery.js"` 其实就是`"jquery": ["/node_modules/jquery/dist/jquery.js"]` 的语法糖。

#### 内建模块且浏览器支持 import maps

我们不仅可以对第三方模块做兜底，这样适用于内建模块：

```js
{
  "imports": {
    "std:kv-storage": [
      "std:kv-storage",
      "/node_modules/kvs-polyfill/index.mjs"
    ]
  }
}
```

它首先回去尝试使用浏览器的"std:kv-storage"，但是如果浏览器并不支持这个功能，就可以加载它的 polyfill - /node_modules/kvs-polyfill/index.mjs。

:::tip 注意
std:在这里只是解说意图，这个提案是通用的，可以使用任何内置模块前缀。
:::

#### 内建模块，但浏览器不支持 import maps

如果浏览器不支持`import maps，import { StorageArea } from "std:kv-storage"` 总会执行失败。有什么写法即可以在老式浏览器生效，也可以在支持 import maps 的浏览器生效：

```js
import { StorageArea } from "/node_modules/kvs-polyfill/index.mjs";
```

然后配置重映射到内建模块上:

```js
{
  "imports": {
    "/node_modules/kvs-polyfill/index.mjs": [
      "std:kv-storage",
      "/node_modules/kvs-polyfill/index.mjs"
    ]
  }
}
```

- 这样不支持 import maps 的浏览器，会使用 polyfill。
- 支持 import maps，但不支持 KV storage 的浏览器，会映射到 URL 上，于是使用 polyfill。
- 都支持的浏览器，就会直接使用内建模块。

但是这样的方式不能工作在`<script>`里：

```js
import "/node_modules/virtual-scroller-polyfill/index.mjs";
```

这样写之前讲过了，是没有问题的。但是：

```html
<script
  type="module"
  src="/node_modules/virtual-scroller-polyfill/index.mjs"
></script>
```

这样就不能正常运行了，这样会无条件的加载 polyfill，而不会使用内建模块。
如果还想上面的功能正常进行，应该这么写：

```html
<script
  type="module"
  src="import:/node_modules/virtual-scroller-polyfill/index.mjs"
></script>
```

遗憾的是，这样的写法只能运行在支持 import maps 的浏览器中，但是在不支持 import maps 的浏览器中，我们只有这么写：

```html
<script type="module">
  import "/node_modules/virtual-scroller-polyfill/index.mjs";
</script>
```

这样就能像上述我们所说那种运行了。

### 作用域（非常重要）

#### 相同的模块多版本

这是一个常见的 case，比如我们用了 socksjs-client 这个库，他依赖 querystringify@1.0，但是我们想使用 querystringify@2.0 的功能。一种解决方案是我们为我们使用的 querystringify 改个名字，但这并不是我们想要的解决方案。
Import maps 提供了 scope 来解决这样的情况：

```js
{
  "imports": {
    "querystringify": "/node_modules/querystringify/index.js"
  },
  "scopes": {
    "/node_modules/socksjs-client/": {
      "querystringify": "/node_modules/socksjs-client/querystringify/index.js"
    }
  }
}
```

使用了这个`import maps`，任何以`/node_modules/socksjs-client/`开头的库都会去使用`/node_modules/socksjs-client/querystringify/index.js`，然而顶级的`imports`确保其他我们使用到的`querystringify`，都是`"/node_modules/querystringify/index.js"`这个版本。

#### 作用域继承

作用域以一种简单的方式合并切覆盖例如：

```js
{
  "imports": {
    "a": "/a-1.mjs",
    "b": "/b-1.mjs",
    "c": "/c-1.mjs"
  },
  "scopes": {
    "/scope2/": {
      "a": "/a-2.mjs"
    },
    "/scope2/scope3/": {
      "b": "/b-3.mjs"
    }
  }
}
```

将会按以下的这种方式解析：

| Specifier |        Referrer        | Resulting URL |
| --------- | :--------------------: | :------------ |
| a         |    /scope1/foo.mjs     | /a-1.mjs      |
| b         |    /scope1/foo.mjs     | /b-1.mjs      |
| c         |    /scope1/foo.mjs     | /c-1.mjs      |
| a         |    /scope2/foo.mjs     | /a-2.mjs      |
| b         |    /scope2/foo.mjs     | /b-1.mjs      |
| c         |    /scope2/foo.mjs     | /c-1.mjs      |
| a         | /scope2/scope3/foo.mjs | /a-2.mjs      |
| b         | /scope2/scope3/foo.mjs | /b-3.mjs      |
| c         | /scope2/scope3/foo.mjs | /c-1.mjs      |

### 虚拟化（太少见）

直接看参考资料，不介绍了

### import: URLs（重要）

作为 import maps 概念的补充，提供了 import: URL scheme。 它使得在 HTML、CSS 或者一些其他接受 URL 地方来使用 import map。

#### 一个 widget 库的例子

这个库不仅仅包括 js 模块，还报错 css 主题和一些图片，你可以配置 import map：

```js
{
  "imports": {
    "widget": "/node_modules/widget/index.mjs",
    "widget/": "/node_modules/widget/"
  }
}
```

然后就可以使用：

```html
<link rel="stylesheet" href="import:widget/themes/light.css" />
<script type="module" src="import:widget"></script>
```

或者：

```css
.back-button {
  background: url("import:widget/assets/back.svg");
}
```

这使得所有 web 资源都可以通过库标识符来访问。

#### 数据文件的例子

```js
{
  "imports": {
    "tzdata": "/node_modules/tzdata/timezone-data.json"
  }
}
```

然后就可以这样访问：

```js
const data = await (await fetch("import:tzdata")).json();
```

### URL 解析语义

如何精确的来解析 import:仍然是有些模糊的，特别是以下两种情况使用 URL 时：

- 解析相对路径标识符，例如 import:./foo
- 在不同地方决定使用哪个作用域时

第一种情况并不重要，因为相应的用例并不十分重要。但是第二种情况就会产生歧义，比如我们 app 用了 v2 的 widget，但是有一个第三方库使用了 v1 的 widget，我们就需要配置：

```js
{
  "imports": {
    "widget": "/node_modules/widget-v2/index.mjs",
    "widget/": "/node_modules/widget-v2/"
  },
  "scopes": {
    "/node_modules/gadget/": {
      "widget": "/node_modules/widget-v1/index.mjs",
      "widget/": "/node_modules/widget-v1/"
    }
  }
}
```

问题在于`/node_modules/gadget/styles.css`会怎么解析？

```css
.back-button {
  background: url(import:widget/back-button.svg);
}
```

这里其实和你预期时一样的，使用的是 v1 相应的 url。
当前我们关于 import:所提案的 url 解析方案是使用请求所在的 URL，意思是：

- 默认的，使用页面的基础 URL（获取客户端 API 所基于的 URL）
- 如果请求发生在 css 里，使用 css 文件的 url
- 如果请求发生在 HTML module 里，使用模块的相对路径。

但是默认这种选择就会出现问题，假如在`/node_modules/gadget/index.mjs` 里：

```js
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "import:widget/themes/light.css";
document.head.append(link);
```

因为他最终会成为页面上的一个 link 元素然后引用 import:widget/themes/light.css，而不是 js 代码里的引用，所以他最终会按照页面的 URL 去解析，故得到的是 v2 的版本。但实际上这是在`/node_modules/gadget/index.mjs` 里的代码，我希望他获取的是 v1。

一个提案是使用 `import.meta.resolve()`：

```js
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = import.meta.resolve("widget/themes/light.css");
document.head.append(link);
```

由于兜底这个功能这也会变得有些复杂。讨论：[#79](https://github.com/WICG/import-maps/issues/79)。

前一个版本的提案是解析 import:相对于，当前执行脚本，但是也会有问题，见：[#75](https://github.com/WICG/import-maps/issues/75)。

### 动态生成 import maps

你可以在执行任何 import 之前，执行以下脚本，动态生成 import maps

```js
<script>
const im = document.createElement('script');
im.type = 'importmap';
im.textContent = JSON.stringify({
  imports: {
    'my-library': Math.random() > 0.5 ? '/my-awesome-library.mjs' : '/my-rad-library.mjs';
  }
});
document.currentScript.after(im);
</script>

<script type="module">
import 'my-library'; // will fetch the randomly-chosen URL
</script>
```

也可以动态覆盖已经导入的 import

```js
<script type="importmap">
{
  "imports": {
    "lodash": "/lodash.mjs",
    "moment": "/moment.mjs"
  }
}
</script>

<script>
if (!someFeatureDetection()) {
  const im = document.createElement('script');
  im.type = 'importmap';
  im.textContent = '{ "imports": { "lodash": "/lodash-legacy-browsers.js" } }';
  document.currentScript.after(im);
}
</script>

<script type="module">
import _ from "lodash"; // will fetch the right URL for this browser
</script>
```

动态覆盖的 script 在第二个，因为如果已经有人使用到了 import maps 再覆盖，就没有用了。
