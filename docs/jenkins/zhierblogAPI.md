# zhierblogAPI 的配置

## General

### 描述

zhier 的 API，node server,[测试接口](http://101.200.192.219:2290/test/api)

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

```bash
## 非格式化命令
docker rm -f zhierblogAPI || true
docker volume create node_modules10
docker run -dit -p 2290:8090 -v /docker_volume/jenkins_home/workspace/zhierblogAPI:/project -w /project -v node_modules13:/project/node_modules --name zhierblogAPI node:10.15.3
docker exec -i zhierblogAPI bash -c "npm config set registry https://registry.npm.taobao.org && npm config set unsafe-perm true && npm install && ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 && ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime && nohup pm2-runtime ./server/index.js &"
```

```bash
## 格式化命令
docker rm -f zhierblogAPI || true
docker volume create node_modules10
docker run -dit -p 2290:8090 \
-v /docker_volume/jenkins_home/workspace/zhierblogAPI:/project \
-w /project -v node_modules13:/project/node_modules \
--name zhierblogAPI node:10.15.3
docker exec -i zhierblogAPI \
bash -c "npm config set registry https://registry.npm.taobao.org \
&& npm config set unsafe-perm true \
&& npm install \
&& ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 \
&& ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime \
&& nohup pm2-runtime ./server/index.js &"
```

重点解析下这段 shell 命令。

::: tip bash 详解

- `docker rm -f zhierblogAPI || true`：如果存在`zhierblogAPI`容器，那么先删除它。<span style="color: red;">这里有个坑，`docker rm -f zhierblogAPI`，在不存在容器的情况下会报错，所以加了`|| true`，这是个任何场景都可以借鉴的技巧。</span>
- `docker volume create node_modules10`：数据持久化，[详情](../docker/docker_node.md)
- `-v /docker_volume/jenkins_home/workspace/zhierblogAPI:/project`：把 git download 下来的工作目录绑定到容器的指定工作目录下
- `-w /project`：指定容器的工作目录，这个路径和上面对应
- `-v node_modules13:/project/node_modules`：之前生成的共享卷绑定到指定容器工作目录的 node_modules 下，这个路径和上面对应，[详情](../docker/docker_node.md)
- `--name zhierblogAPI node:10.15.3`：指定容器名，方便后续容器操作，指定 node 镜像版本，这里和共享卷的名称对应，是个小技巧。另外这里有 2 个坑：
  1. <span style="color: red;">node server 使用的 npm 包（koa）在 node 13 下有问题，所以特别适配到 node 10 的环境。</span>
  2. <span style="color: red;">使用 node:10.15.3 镜像而不是 node:10.15.3-alpine 镜像，因为这个镜像不包含适合 bash 的风格操作，后面的`bash c`命令无法被识别。[详情](../docker/docker_node.md)</span>
- `docker exec -i zhierblogAPI bash -c "[cmd]"`：
  1. `docker exec`：可以进入容器内部操作
  2. `bash -c`：可以按顺序执行多条命令
  3. `-i`：如果写成`-it`会报错：jenkins 执行 docker run 时报错 the input device is not a TT
- `npm config set registry https://registry.npm.taobao.org`：不多说
- `npm config set unsafe-perm true`：否则`pm2`包无法被安装，具体报错参考[详情](../docker/docker_node.md)
- `npm install`：这里执行生成的`node_modules`文件夹就会绑定到`node_modules10`共享卷
- `ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime`：
  因为`pm2`是系统全局的，本身应该`npm install pm2 -g`去全局安装，但是这样每次 jenkins 执行命令都要重新下载它，很耗时耗流量，所以把它也放到共享卷，然后通过软连接做成全局。
  所以在项目的 package.json 中别忘了加入 pm2，就是项目中要执行：`npm install pm2 --save-dev`
- `nohup pm2-runtime ./server/index.js &`：使用 pm2 运行 node server，但是这样 jenkins 任务会一直转圈圈，但是已经成功了，所以加入`nohup [cmd] &`,[详情](../docker/docker_node.md),
  这样效果一样，但是因为是另开一个进程去处理这个事情，所以如果 jenkins 显示部署成功，但是实际上只是开进程成功，进程的任务运行还要一段时间，之前就是一看到 jenkins 成功就去看效果，结果失败，
  以为是自己命令的问题，后来过会儿在看，发现又成功了。但是这里有个麻烦，就是你不知道是否真的成功运行了 node server，所以要看日志，这里就不深入了。
  如果一直不成功，就运行`pm2-runtime ./server/index.js`，先在转圈圈的情况下看下错在哪里，解决了在改回去。

:::
