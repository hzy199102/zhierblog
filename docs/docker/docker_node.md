# docker 中部署 nodejs 应用

错在陈醋当成墨，写尽半生纸上酸。

## 参考资料

1. [Docker + jenkins 自动化部署 Node.js 应用](https://www.jianshu.com/p/47ef444c74da)
2. [利用 Docker 容器搭建高效的 Node.js 开发环境](https://www.imooc.com/article/19840)
3. [Docker 化 Node.js Web 应用](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
4. [pm2 官网](https://pm2.keymetrics.io/docs/usage/quick-start/)
5. [Docker 部署 nodejs 项目 - 草稿](https://www.jianshu.com/p/5acae24b00cc)
6. [Docker 部署 nodejs 应用并使用 PM2 作为守护进程](https://www.cnblogs.com/caidingyu/p/11170524.html)
   http://101.200.192.219:2227/vuepress/
   https://www.imooc.com/article/19840
   https://www.jianshu.com/p/bb9f88c1c032?utm_campaign
   https://www.jianshu.com/p/f8740c00bbf6
   https://www.jianshu.com/p/f8740c00bbf6
   http://101.200.192.219:2201/job/zhierblog/
   https://blog.csdn.net/chengly0129/article/details/70292953

## 前言

1.  一定要有 node_module 吗，可以像 node client 一样，build 一下吗？
    不行

## 1.0 时代

之前有在 linux 上部署 node 服务，是个 ws 通讯。但是是一次性的，基本不需要后期维护。

### 部署步骤

1.  在 linux 上安装 npm，node，pm2
2.  上传项目到 linux 指定目录
3.  在指定目录路径下（package.json 所在目录）运行：`npm install`
4.  运行 pm2 命令
5.  如果有代码更新，要手动重复执行部署步骤 2-4

### 缺陷：

1. node_modules 很大，而且每个 node server 都需要有一份 node_modules，无法公用。而且`npm install`是非常耗时的。
   当然可以全局安装 npm 包，即`npm install -g npm包`，但这样遇到 node 和 npm 包的版本兼容的问题就很难处理,这个会在后面详解。
2. 需要在 linux 上搭建环境，安装 node，pm2，这样如果更换服务器就还需要在搭建一次。
   另外 1 的问题，就是版本兼容的问题依然会存在。
3. 每次部署都要代码上传，非常繁琐，而且没有版本处理，回滚不方便。
4. 时间久了之后，后期维护人员要回忆这些步骤和注意事项会非常累。

### 优化思路

1. jenkins 自动化部署，代码从 git 上 download 下来，支持项目的各种 git 版本的处理，回滚很方便。
2. docker volume（共享卷）的方式去公用 node_module，甚至为维护 node 和 npm 包的版本兼容上提供了技术支持。
3. docker 中搭建 node 和 pm2 环境，方便服务器部署。

## 2.0 时代

jenkins 自动化部署，docker 容器运行 node server。

### 部署步骤

[jenkins 部署 node 服务示例](../jenkins/zhierblogAPI.md)

## 各种问题的呈现和解决

### Error: stat /bin/bash: no such file or directory": unknown

```bash
[root@zhier test]# docker exec -dit project /bin/bash
Error response from daemon: OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"/bin/bash\": stat /bin/bash: no such file or directory": unknown
```

这个错误说明 镜像不包含适合 bash 的风格操作，没有这样的文件或目录，可能你的镜像基于 busybox，它没有 bash shell。但他在/bin/sh 有一个 shell。比如基于 alpine 镜像。

- 正确写法

```bash
# alpine镜像
docker exec -dit project /bin/sh
```

- 错误写法

```bash
# alpine镜像
docker exec -dit project /bin/bash
```

### 拉取 node 镜像

- 实现效果

  1.  任何指定的镜像，包括其版本，都能被找到并且拉取到本地。

- 实现步骤

  1.  常用 docker 镜像仓库地址

  - 国内仓库
    <br>[网易](https://c.163yun.com/hub#/m/home/) （需登录）
    <br>[阿里云](https://cr.console.aliyun.com/cn-beijing/instances/images) （需登录）
    <br>[DaoCloud 道客网络](https://hub.daocloud.io/)

  - 国外仓库
    <br>[Docker Hub](https://hub.docker.com/)
    <br>[Quay](https://quay.io/search)

  2.  因为我的 jenkins 的 node 版本是 13.6，所以镜像也取相同版本，如图：

      ![Image from alias](./img/docker_node/docker_node_2.png)
      ![Image from alias](./img/docker_node/docker_node_3.png)
      ![Image from alias](./img/docker_node/docker_node_4.png)

      ::: tip
      这里要注意相同版本的 node 也会有基于不同 linux 版本的镜像，如基于 Alpine 的 node 镜像，运行这些镜像的容器的的命令也有很大区别！文章其他地方会有介绍！
      (`bash -c`)
      :::

### node_modules 的共享操作

- 参考资料

  1. [利用 Docker 容器搭建高效的 Node.js 开发环境](https://www.imooc.com/article/19840)

- 实现效果

  1. node_modules 在多个 node 服务中被共享。
  2. 解决 node 和 npm 包的版本兼容问题。
  3. `npm install`只更新不存在的 npm 包，已有的不处理，解决耗时问题。

- 实现方案

  1. <span style="color: red;">（初级方案）</span>在 docker 中创建一个容器用来缓存 node_modules，并暴露 /project/node_modules 作为挂载路径。

     ```bash
     # 一定要-dit，否则容器会自动停止
     # Alpine 操作系统是一个面向安全的轻型 Linux 发行版。
     # Alpine 采用了 musl libc 和 busybox 以减小系统的体积和运行时资源消耗。
     docker run -dit -v /project/node_modules --name node_modules alpine
     # 可以进入容器内部查看情况，可以看到共享卷已经被创建。
     # 按组合键 `Ctrl+q`退出容器。
     # 不能用`exit`命令，否则容器关闭的同时会停止运行。
     # 注意：这是基于alpine镜像的docker容器处理方式
     docker attach node_modules
     # 一定要-dit运行，代表后台运行
     docker run -dit \
     # 宿主机目录挂载到docker上的指定目录
     -v /docker_volume/node_server/test:/project \
     # 指定工作目录，执行命令的初始路径，不指定默认`/`根目录
     -w /project \
     # 挂载之前运行的共享容器
     --volumes-from node_modules \
     # 一定要取容器名，方便后期的容器操作
     --name project \
     # node:13.6.0-alpine镜像如果本地不存在会自动去下载
     # node:13.6.0-alpine镜像的名字的来源请看上面的内容：拉取 node 镜像
     # 基于alpine镜像，所以注意问题:[stat /bin/bash: no such file or directory": unknown]
     node:13.6.0-alpine
     # 在刚才启动的容器内部执行命令：npm i lodash
     # 执行路径：/project
     # lodash的安装路径：/project/node_modules，和共享容器暴露的挂载路径相吻合。
     docker exec -it project npm i lodash
     # 可以进入 node 容器
     # 可以直接`exit`退出
     docker exec -it project /bin/sh
     ```

     经过上述步骤，可以观察发现，lodash 已经在 2 个容器中共享。[docker 入门 —— docker 容器数据卷 volumes-from](https://blog.csdn.net/xiaojin21cen/article/details/84564973)，
     从这篇文章可得出个结论：<span style="color: red;">容器之间配置信息的传递，数据卷的生命周期一直持续到没有容器使用它为止。</span>

  2. <span style="color: red;">（高级方案）</span>创建一个 Docker volume 用来共享容器间的数据。

     - 初级方案的缺点：

       1. 把数据保存在容器中并不是一种值得推荐的做法，抛开 Docker 守护进程和容器本身的稳定性不说，容器也存在一定被误删的可能性。
       2. 而这种共享卷的方式有个更麻烦的问题是所有想利用这个缓存卷的容器目录结构都必须是 /project/node_modules，这样的限制就显得很不友好了。
       3. 另外用来缓存卷的容器基本上算是浪费了，起不到什么实质性的作用。

     - 高级方案的实现：

       ```bash
       # 这个volume可以叫任意名字，也可以挂载到容器不同的路径下。
       # 这里之所以加上“13”是因为不同npm版本组织模块的方式会有些不同，
       # 这里通过对node版本号来进行标注，表示这些模块可用于Node.js 7版本。
       docker volume create node_modules13
       # 查看下现在的挂载卷列表
       docker volume ls
       # 一定要-dit运行，代表后台运行
       docker run -dit \
       # 宿主机目录挂载到docker上的指定目录
       -v /docker_volume/node_server/test:/project \
       # 指定工作目录，执行命令的初始路径，不指定默认`/`根目录
       -w /project \
       # 挂载之前创建的共享卷在指定的容器目录下
       -v node_modules13:/project/node_modules
       # 一定要取容器名，方便后期的容器操作
       --name project \
       # node:13.6.0-alpine镜像如果本地不存在会自动去下载
       # node:13.6.0-alpine镜像的名字的来源请看上面的内容：拉取 node 镜像
       # 基于alpine镜像，所以注意问题:[stat /bin/bash: no such file or directory": unknown]
       node:13.6.0-alpine
       # 在刚才启动的容器内部执行命令：npm i underscore
       # 执行路径：/project
       # underscore的安装路径：/project/node_modules，
       # 和-v node_modules13:/project/node_modules对应上。
       docker exec -it project npm i underscore
       # 可以进入 node 容器
       # 可以直接`exit`退出
       docker exec -it project /bin/sh
       # 在执行一次docker 容器启动操作，把name改为project2，
       # 接着docker exec -it project2 /bin/sh
       ```

       经过上述步骤，可以观察发现，underscore 已经在 2 个容器中共享，即可以确认共享模块成功。

4. `docker exec`方式去运行容器内的命令，安装 pm2，不需要写在镜像中

### 查询运行的 node 服务

```bash
# 查询运行的 node 服务进程
ps =ef|grep node
# 强行杀死进程
kill -9 id
```

### Error: No such container: project

- 正确写法

```bash
# 如果存在project容器，那么删除它。
# 在不存在project容器的情况下会报错，所以加了|| true，这是个任何场景都可以借鉴的技巧。
docker rm -f project || true
```

- 错误写法

```bash
# 如果存在project容器，那么删除它。
# 在不存在project容器的情况下会报错，所以加了|| true，这是个任何场景都可以借鉴的技巧。
docker rm -f project
```

### jenkins 任务打圈圈

已经正确执行完任务，但是因为是部署 node 服务，所以没有 jenkins 无法收到结束信号，所以无法变成 success 状态。

参考资料：[jenkins 的任务卡住](https://www.cnblogs.com/sdadx/p/10498526.html)

```bash
nohup [cmd] &
```

- 正确写法

```bash
# 必须启用nohup [cmd] &
docker exec -i zhierblogAPI \
bash -c "npm config set registry https://registry.npm.taobao.org \
&& npm config set unsafe-perm true \
&& npm install \
&& ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 \
&& ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime \
&& nohup pm2-runtime ./server/index.js &"
```

- 错误写法

```bash
# 必须启用nohup [cmd] &
docker exec -i zhierblogAPI \
bash -c "npm config set registry https://registry.npm.taobao.org \
&& npm config set unsafe-perm true \
&& npm install \
&& ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 \
&& ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime \
&& pm2-runtime ./server/index.js"
```

- <span style="color: red;">这样 jenkins 会快速变成 success，但是 cmd 的命令是另开一个进程去做的，所以即使 success，也不代表命令运行完成，这时候第一时间去测试是没有效果的，
  需要过段时间等那个进程的命令真正执行完毕才能看到效果。这是个坑，我之前就犯了这个错误，还一直以为是我命令的问题。</span>
- <span style="color: red;">如果命令有问题，jenkins 上也是看不到的，因为它只显示另开进程成功，可以从错误日志去看，也可以先改成正常的 cmd 去解决问题，跑通了再改回 nohup 模式。</span>

### jenkins 安装 node 环境打圈圈

直接看这里：[jenkins 安装 nodejs 卡死](https://blog.csdn.net/u012075238/article/details/103052201)

### Error: No valid exports main found for '/project/node_modules/koa'

在本地运行 node 服务没问题，但是在 docker 容器中出现这样的问题，在进入 node_modules 确认 koa 的确存在的情况下，发现是 node 版本有区别，本地是 node10，而 docker 容器是 node13，
于是把 node 镜像从`node:13.6.0-alpine`改为`node:10.15.3-alpine`，一切正常。

### 在 docker 容器中调用和执行宿主机的 docker

- 参考资料

1. [在 docker 容器中调用和执行宿主机的 docker](https://blog.csdn.net/catoop/article/details/91042007)
2. [docker_jenkins](./docker_jenkins.md)

这个概念又被称为 docker in docker，在 jenkins 的 shell 命令中执行宿主机的 docker 命令，发现执行不了才去研究的。
<span style="color: red;">运行容器怎么挂载目录的问题非常麻烦，索性这里只需要用到备份数据的思路，具体看：[docker_jenkins](./docker_jenkins.md)</span>

### Error: could not get uid/gid

- 参考资料

1. [Dockerfile 中 npm 中 Error: could not get uid/gid 问题的解决方法](https://www.cnblogs.com/liyongjian5179/p/9884944.html)

`npm install pm2 -g`遇到这个错误的

```bash
# 这个问题也和node版本有有关，在node13中没这个问题，node10才有。
npm config set unsafe-perm true
npm install pm2 -g
```

### pm2 的软连接

每次 jenkins 部署都要在容器中运行`npm install pm2 -g`，因为没把它缓存到 node_modules10 的共享卷，所以每次都要下载安装，非常耗时。
`npm install pm2 --save-dev`：将 pm2 放到 package.json 中，然后`npm install`就会把它缓存到 node_modules10 的共享卷，但是 pm2 是全局的，所以需要软连接下：

```bash
# 路径可以在node_modules中确认，避免出错
ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 \
&& ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime \
# 确认是否pm2全局化成功
pm2 list
```

### docker 报错 the input device is not a TT

- 正确写法

```bash
# 不能-it，需要-t
docker exec -i zhierblogAPI \
bash -c "npm config set registry https://registry.npm.taobao.org \
&& npm config set unsafe-perm true \
&& npm install \
&& ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 \
&& ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime \
&& nohup pm2-runtime ./server/index.js &"
```

- 错误写法

```bash
# 不能-it，需要-t
docker exec -it zhierblogAPI \
bash -c "npm config set registry https://registry.npm.taobao.org \
&& npm config set unsafe-perm true \
&& npm install \
&& ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 \
&& ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime \
&& nohup pm2-runtime ./server/index.js &"
```

### linux 命令执行顺序

- 正确写法

```bash
docker exec -i zhierblogAPI \
bash -c "npm config set registry https://registry.npm.taobao.org \
&& npm config set unsafe-perm true \
&& npm install \
&& ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 \
&& ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime \
&& nohup pm2-runtime ./server/index.js &"
```

可能遇到以下问题：

```bash
Error response from daemon: OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"bash\": executable file not found in $PATH": unknown
Build step 'Execute shell' marked build as failure
```

这个错误说明 镜像不包含适合 bash 的风格操作，没有这样的文件或目录,可能你的镜像基于 busybox，它没有 bash shell。的确我使用的是`node:13.6.0-alpine`，改为`node:10.15.3`即可。
和前面的问题:[stat /bin/bash: no such file or directory": unknown]是同理。

- 错误写法

```bash
docker exec -i zhierblogAPI \
npm config set registry https://registry.npm.taobao.org \
&& npm config set unsafe-perm true \
&& npm install \
&& ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2 \
&& ln -s /project/node_modules/pm2/bin/pm2-runtime /usr/bin/pm2-runtime \
&& nohup pm2-runtime ./server/index.js &
```

结果是看了 jenkins 的输出日志才发现不对的，只有`docker exec -i zhierblogAPI npm config set registry https://registry.npm.taobao.org`是正确的容器执行，
后面的代码都是非容器执行了...

- 错误写法

```bash
docker exec -dit zhierblogAPI \
npm config set registry https://registry.npm.taobao.org
docker exec -dit zhierblogAPI npm config set unsafe-perm true
docker exec -dit zhierblogAPI npm install
docker exec -dit zhierblogAPI ln -s /project/node_modules/pm2/bin/pm2 /usr/bin/pm2
docker exec -dit zhierblogAPI nohup pm2-runtime ./server/index.js &
```

结果是看了 jenkins 的输出日志才发现不对的，因为全部是`-dit`，也就是另开进程，所以根本不确定执行顺序，虽然 jenkins 显示 success，但是我在 linux 上查看发现服务根本没起来。
