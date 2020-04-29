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

/**
 * 获取文件夹下所有文件名，生成右侧边栏目录数组
 * 解决包含文件夹导致目录数组数据有误问题
 * @param {*} obj
 */
function getSideBar(obj) {
  var temp = [];
  var files = fs.readdirSync(obj.path);
  for (var i = 0, len = files.length; i < len; i++) {
    var filename = files[i];
    if (fs.lstatSync(path.resolve(obj.path, `${filename}`)).isDirectory()) {
      continue;
    }
    if (filename.indexOf("README.md") > -1) {
      temp.unshift(["", "介绍"]);
    } else {
      temp.push(filename.slice(0, -3));
    }
  }
  return temp;
}
/**
 * 获取文件夹下所有文件名，生成右侧边栏目录数组
 * 被淘汰，无法过滤文件夹，导致目录树显示有误
 * @param {*} obj
 */
function getSideBar_del(obj) {
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
function getDiarySideBar(obj) {
  return fs
    .readdirSync(obj.path)
    .map(filename => {
      if (filename === "README.md") {
        return ["", "介绍"];
      }
      console.log(filename);
      return filename.slice(0, -3);
    })
    .sort();
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
  "/docker/": [
    {
      title: "docker配置",
      collapsable: false,
      sidebarDepth: 2,
      children: getSideBar({
        path: path.resolve(__dirname, "../../docker")
      })
    }
  ],
  "/daily/2020/": [
    {
      title: "2020",
      collapsable: false,
      sidebarDepth: 2,
      children: getSideBar({
        path: path.resolve(__dirname, "../../daily/2020")
      })
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
      sidebarDepth: 3,
      children: getSideBar({
        path: path.resolve(__dirname, "../../interview/vuepress")
      })
    }
  ]
};

module.exports = obj;
