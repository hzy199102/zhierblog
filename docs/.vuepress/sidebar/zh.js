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

module.exports = {
  "/jenkins/": [
    {
      title: "jenkins配置",
      collapsable: false,
      sidebarDepth: 2,
      children: jenkinsSideBar
      // children: [["", "介绍"], "vuepress"]
    }
  ],
  "/interview/css/": [
    {
      title: "interview——CSS篇",
      collapsable: false,
      children: getSideBar({
        path: path.resolve(__dirname, "../../interview/css")
      })
    }
  ],
  "/interview/nodejs/": [
    {
      title: "interview——nodejs篇",
      collapsable: false,
      children: getSideBar({
        path: path.resolve(__dirname, "../../interview/nodejs")
      })
      // children: [["", "介绍"]]
    }
  ]
};
