const { fs, path } = require("@vuepress/shared-utils");

/**
 * 动态加载制定目录下的所有md文件，无需一个个手动录入
 */
const jenkinsSideBar = fs
  .readdirSync(path.resolve(__dirname, "../../jenkins"))
  .map(filename => {
    if (filename === "README.md") {
      return ["", "介绍"];
    }
    return filename.slice(0, -3);
  })
  .sort();

function getSideBar(obj) {
  return fs
    .readdirSync(obj.path)
    .map(filename => {
      if (filename === "README.md") {
        return ["", "介绍"];
      }
      return filename.slice(0, -3);
    })
    .sort();
}
/**
 * 生成日记侧边栏
 * @param {*} obj 整体侧边栏目录结构
 * @param {*} Catalog 制定的目录下的内容生成侧边栏目录，用于插入整体的侧边栏目录，这个目录必须是根目录下的二级目录
 */
function getDiarySideBar(obj, Catalog) {
  var yearCatalog = fs
    .readdirSync(path.resolve(__dirname, "../../" + Catalog))
    .map(filename => {
      return filename;
    })
    .sort();
  console.log(yearCatalog);
}

// getDiarySideBar("", "diary");

var obj = {
  "/jenkins/": [
    {
      title: "jenkins配置",
      collapsable: false,
      sidebarDepth: 2,
      children: jenkinsSideBar
      // children: [["", "介绍"], "vuepress"]
    }
  ],
  "/api/": [
    {
      title: "接口",
      collapsable: false,
      sidebarDepth: 2,
      children: getSideBar({
        path: path.resolve(__dirname, "../../api")
      })
    }
  ],
  "/interview/css/": [
    {
      title: "interview——CSS篇",
      collapsable: false,
      sidebarDepth: 2,
      children: getSideBar({
        path: path.resolve(__dirname, "../../interview/css")
      })
    }
  ],
  "/interview/nodejs/": [
    {
      title: "interview——nodejs篇",
      collapsable: false,
      sidebarDepth: 2,
      children: getSideBar({
        path: path.resolve(__dirname, "../../interview/nodejs")
      })
      // children: [["", "介绍"]]
    }
  ],
  "/interview/vuepress/": [
    {
      title: "interview——vuepress篇",
      collapsable: false,
      children: getSideBar({
        path: path.resolve(__dirname, "../../interview/vuepress")
      })
    }
  ]
};

module.exports = obj;
