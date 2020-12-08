# vuepress-theme-reco 调研

## 目标

优化自己的博客主题，实现 calendar，能会后端交互，数据取自 mysql

## 源码分析

### index.js

1. thmem/index.js：主题文件的入口文件
   ```js
   module.exports = (options, ctx) => ({
     alias() {
       // themeConfig：config.js的themeConfig
       // siteConfig：config.js的整个对象，内含themeConfig
       const { themeConfig, siteConfig } = ctx;
       // resolve algolia
       // console.log(themeConfig);
       // console.log(siteConfig);
       const isAlgoliaSearch =
         themeConfig.algolia ||
         // var a = {a:1}; var b= {b:1}; console.log(a && b); console.log(a || b);
         // {b:1}
         // {a:1}
         // some: 有一个元素满足条件就返回true
         Object.keys((siteConfig.locales && themeConfig.locales) || {}).some(
           base => themeConfig.locales[base].algolia
         );
       return {
         "@AlgoliaSearchBox": isAlgoliaSearch
           ? path.resolve(__dirname, "components/AlgoliaSearchBox.vue")
           : path.resolve(__dirname, "noopModule.js"),
         "@SearchBox": path.resolve(__dirname, "components/SearchBox.vue")
       };
     }
   });
   ```
2. enhanceApp.js

   ```js
   export default ({ Vue, siteData, isServer, router }) => {
     Vue.use(VueCompositionAPI);
     Vue.mixin(postMixin);
     Vue.mixin(localMixin);
     if (!isServer) {
       addLinkToHead("//at.alicdn.com/t/font_1030519_2ciwdtb4x65.css");
       addScriptToHead("//kit.fontawesome.com/51b01de608.js");
       // 选定代码显示风格，在config.js的codeTheme配置
       registerCodeThemeCss(siteData.themeConfig.codeTheme);
     }
     interceptRouterError(router);
   };

   // 支持的prism.js代码风格如下，但是现在有更多风格，具体看官网或者node_modules的prism包内容
   export function registerCodeThemeCss(theme = "tomorrow") {
     const themeArr = [
       "tomorrow",
       "funky",
       "okaidia",
       "solarizedlight",
       "default"
     ];
     const href = `//prismjs.com/themes/prism${
       themeArr.indexOf(theme) > -1 ? `-${theme}` : ""
     }.css`;

     addLinkToHead(href);
   }
   ```
