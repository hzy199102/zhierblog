const { path } = require("@vuepress/shared-utils");
console.log(path.resolve(__dirname, "../", "demo"));
module.exports = {
  base: "/vuepress/",
  title: "zhierblog",
  description: "这是止耳的vuepress博客",
  // 如果网址不是部署在根目录下，favicon.ico必须指定
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
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
  },
  configureWebpack: {
    resolve: {
      alias: {
        // 由于代码段的导入将在 webpack 编译之前执行，因此你无法使用 webpack 中的路径别名，此处的 @ 默认值是 process.cwd()。所以@demo无效
        "@demo": path.resolve(__dirname, "../", "demo")
      }
    }
  },
  evergreen: false, //浏览器兼容性，如果你的对象只有那些 “常青树” 浏览器，你可以将其设置成 true，这将会禁止 ESNext 到 ES5 的转译以及对 IE 的 polyfills，同时会带来更快的构建速度和更小的文件体积。
  markdown: {
    anchor: {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: "#",
      level: 1
    },
    // markdown-it-table-of-contents
    toc: {
      includeLevel: [1, 2, 3],
      containerHeaderHtml: '<div class="toc-container-header">Contents</div>',
      containerFooterHtml: '<div class="toc-container-footer">Footer</div>'
    },
    lineNumbers: true,
    extractHeaders: ["h2", "h3"]
  },
  themeConfig: {
    logo: "/zhier.jpg",
    lastUpdated: "Last Updated",
    smoothScroll: true,
    nav: require("./nav/zh"),
    sidebar: require("./sidebar/zh"),
    sidebarDepth: 1 //在require("./nav/zh")中覆写了，具体去那个文件中看
  },
  plugins: [
    // 你可以多次使用这个插件
    [
      "vuepress-plugin-container",
      {
        type: "right",
        defaultTitle: ""
      }
    ],
    ["demo-container"],
    // ["vuepress-plugin-right-anchor"],
    [
      "vuepress-plugin-right-anchor",
      {
        showLevel: 2,
        // showDepth: 2, // 显示h2,h3，但是这个参数没用，看源码发现的
        ignore: [
          "/"
          // "/api/"
        ],
        expand: {
          default: false,
          trigger: "click"
        },
        customClass: "your-customClass",
        disableGlobalUI: false
      }
    ],
    [
      ("vuepress-plugin-container",
      {
        type: "theorem",
        before: info => `<div class="theorem"><p class="title">${info}</p>`,
        after: "</div>"
      })
    ],

    // 这是 VuePress 默认主题使用这个插件的方式
    [
      "vuepress-plugin-container",
      {
        type: "tip",
        defaultTitle: {
          "/": "TIP",
          "/zh/": "提示"
        }
      }
    ],
    [
      "vuepress-plugin-zooming",
      {
        // selector: ".my-wrapper .my-img",
        delay: 1000,
        options: {
          bgColor: "black",
          zIndex: 10000
        }
      }
    ]
  ]
};
