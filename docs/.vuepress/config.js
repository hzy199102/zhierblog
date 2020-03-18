module.exports = {
  base: "/vuepress/",
  title: "zhierblog",
  description: "这是止耳的vuepress博客",
  // 如果网址不是部署在根目录下，favicon.ico必须指定
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],

  configureWebpack: {
    resolve: {
      alias: {
        "@alias": "path/to/some/dir"
      }
    }
  },
  evergreen: false, //浏览器兼容性，如果你的对象只有那些 “常青树” 浏览器，你可以将其设置成 true，这将会禁止 ESNext 到 ES5 的转译以及对 IE 的 polyfills，同时会带来更快的构建速度和更小的文件体积。
  markdown: {
    anchor: { permalink: true },
    toc: {
      includeLevel: [1, 2, 3],
      containerHeaderHtml: '<div class="toc-container-header">Contents</div>',
      containerFooterHtml: '<div class="toc-container-footer">Footer</div>'
    },
    lineNumbers: true,
    extractHeaders: ["h2", "h3", "h4"]
  },
  themeConfig: {
    logo: "/zhier.jpg",
    lastUpdated: "Last Updated",
    smoothScroll: true,
    nav: require("./nav/zh"),
    sidebar: require("./sidebar/zh")
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
    [
      "vuepress-plugin-container",
      {
        type: "theorem",
        before: info => `<div class="theorem"><p class="title">${info}</p>`,
        after: "</div>"
      }
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
    ]
  ]
};
