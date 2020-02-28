module.exports = {
  base: "/vuepress/",
  title: "zhierblog",
  description: "这是止耳的vuepress博客",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  configureWebpack: {
    resolve: {
      alias: {
        "@alias": "path/to/some/dir"
      }
    }
  },
  markdown: {
    anchor: { permalink: true },
    toc: { includeLevel: [1, 2, 3] },
    lineNumbers: true
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
