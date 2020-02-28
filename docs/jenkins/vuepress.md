# VuePress 在 Jenkins 上部署的配置

## General

### 描述

一般加上网页地址：[止耳的技术博客](http://101.200.192.219:2227/vuepress/)

### GitHub 项目

填入 github 项目的 url 地址：[github 地址](https://github.com/hzy199102/zhierblog.git/)，但这只是提示功能，不填写也无大碍。

### 丢弃旧的构建

填写最大构建数：5

## 源码管理

### git

#### Repositories

- Repository URL：
  填入 github 项目的 url 地址：[github 地址](https://github.com/hzy199102/zhierblog.git/)。这个必填。
- Credentials：
  录入 github 的账号密码

#### Branches to build

- 指定分支：
  `*/master`，一般为 master 分支

#### Additional Behaviours

- 高级克隆行为：
  - `fetch tags`：勾选；
  - `克隆和拉取操作的超市时间（分钟）`：10；这个是指拉取 git 项目到 jenkins 的超时时间，有的 git 项目非常大的时候，网络不稳定的情况下，很容易超过默认的 10 分钟，从而导致 timeout 超时，之前我有个项目就因为项目过大，看编译进度总是卡在 git fetch 上，然后就 timeout。

## 构建环境

### Provide Node & npm bin/ folder to PATH

如果没这个选项，说明没装 `nodejs 插件`，可以在 `jenkins 的系统管理`——>`全局工具配置`——>`nodejs`，如果这里也没 `nodejs`，
说明 `nodejs 插件`没安装，需要在 `jenkins 的系统管理`——>`插件管理`——>`可选插件`——>`NodeJS Plugin`进行安装（可`ctrl+F`全局搜索 `nodejs`），安装之后在`全局工具配置`新建对应的 nodejs，然后在 jenkins 构建环境中就能找到了。这里我选择的 nodejs 版本是 13.6

## 构建

### 执行 shell

我一般选择直接执行 shell 命令。

```bash{5-7}
npm install -g yarn -registry=https://registry.npm.taobao.org
yarn config set registry https://registry.npm.taobao.org
yarn
yarn docs:build
rm -rf ../vuepress/tmp/*
touch ../vuepress/hzyinit.md
mv `ls ../vuepress/|awk '{print i$0}' i=$(dirname "$PWD")'/vuepress/'|grep -v 'tmp\|test'|xargs` ../vuepress/tmp
mv docs/.vuepress/dist/* ../vuepress
```

重点解析下这段 shell 命令。

- vuepress 最好需要使用 yarn 命令，因为如果你的现有项目依赖了 webpack 3.x，推荐使用 Yarn 而不是 npm 来安装 VuePress。因为在这种情形下，npm 会生成错误的依赖树。
- 因为构建环境选择了 nodejs，所以才能在 shell 中使用 npm
- 为了防止网络问题导致 npm 包下载异常，npm 和 yarn 都最好加入淘宝镜像
- 编译好的目录文件需要移动到制定的目录下，这就是最后一行代码{8}的作用
- 为了加入历时记录的功能，主要是担心上限的网页有问题，可以及时回滚，所以每次 jenkins 部署时候，都会在部署成功前，先备份一份旧版本代码，核心代码{5-7}。

::: warning shell 代码{5-7}详解

- `rm -rf ../vuepress/tmp/*`：先清空制定备份目录下的内容，备份最新的旧版本代码，前提是新版本正确编译了，即`yarn docs:build`正确运行。
- `touch ../vuepress/hzyinit.md`：在最开始的时候，需要备份的文件可能不存在，比如第一次新建项目，或者更正了项目的存储地址的时候，这时候运行下一行命令会提示没有可执行的移动文件，为了防止这样的极端情况发生，每次备份的时候都先建立个冗余文件。
- `代码 7`：最复杂的一段备份代码，在 jenkins 正在编译的文件夹`zhierblog`路径下，找到同级的另一个文件夹`vuepress`下的关键字不包括 tmp 和 test 的所有文件和文件夹`grep -v 'tmp\|test'`，通过
  `awk '{print i$0}' i=$(dirname "$PWD")'/vuepress/'`列出文件和文件夹的完整路径，因为是`zhierblog`下找同级的`vuepress`，所以先确定上一级目录`$(dirname "$PWD")`，目录的最后部分`$(basename "$PWD")`，在拼接`/vuepress/`,可以直接在`zhierblog`路径下运行`ls ../vuepress/|awk '{print i$0}' i=$(dirname "$PWD")'/vuepress/'|grep -v 'tmp\|test'|xargs`看效果，可以看到`hzyinit.md`的完整路径名。接着就是移动备份，之所以排除 tmp 和 test2 个关键字对应的文件和文件夹，是为了做多条件排除的示例，其实这里只需要排除 tmp 即可。`xargs`是管道的用处，可以将得到的结果作为参数用作接下来的命令。`ls ../vuepress/`可以列出制定目录下的全部文件和文件夹。每个特定的命令可以使用`|`做连接。
- 注意<code>`</code>符号的使用，一行 shell 命令只能使用一次。

:::
