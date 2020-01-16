module.exports = {
  title: "Hello VuePress11111",
  description: "Just playing around",
  base: "/vuepress/",
  configureWebpack: {
    resolve: {
      alias: {
        "@alias": "path/to/some/dir"
      }
    }
  }
};
