# docker 中部署 jenkins 应用

参考资料：[Docker 决战到底(四) Jenkins 的安装与使用](https://www.jianshu.com/p/01bb90bfcabb)，[jenkins github](https://github.com/jenkinsci/docker)

## 步骤

1. `docker pull jenkins/jenkins:lts`：jenkins/jenkins:lts 比 jenkins/jenkins:alpine 大了 200 多 M，我用了大的
2. `mkdir -p /docker_volume/jenkins_home`：在宿主机创建挂载文件夹
3. `chown -R 1000:1000 /docker_volume/jenkins_home`：
   如果不加这个，是启动不了 jenkins 的，因为用户权限问题，可以在 log 日志中看到，在[jenkins github](https://github.com/jenkinsci/docker)也能看到原因和解决方案。
4. 运行 docker_jenkins

   ```bash
   # jenkins/jenkins:alpine界面用的不习惯
   docker run -d --restart unless-stopped --name jenkins_dockerindocker \
   -p 2203:8080 -p 2204:50000 \
   -v /docker_volume/jenkins_home:/var/jenkins_home \
   # 确认/var/run/docker.sock存在
   -v /var/run/docker.sock:/var/run/docker.sock \
   # 确认/usr/bin/docker存在
   -v /usr/bin/docker:/usr/bin/docker \
   -e JAVA_OPTS=-Duser.timezone=Asia/Shanghai \
   -u root \
   jenkins/jenkins:alpine
   ```

   ```bash
   # jenkins/jenkins:lts界面用的不习惯
   docker run -d --restart unless-stopped --name jenkins_dockerindocker_lts \
   -p 2203:8080 -p 2204:50000 \
   -v /docker_volume/jenkins_home:/var/jenkins_home \
   # 确认/var/run/docker.sock存在
   -v /var/run/docker.sock:/var/run/docker.sock \
   # 确认/usr/bin/docker存在
   -v /usr/bin/docker:/usr/bin/docker \
   -e JAVA_OPTS=-Duser.timezone=Asia/Shanghai \
   -u root \
   jenkins/jenkins:lts
   ```

   ```bash
   # 直接用老版本
   docker run -d --restart unless-stopped --name jenkins_dockerindocker_old \
   -p 2203:8080 -p 2204:50000 \
   -v /docker_volume/jenkins_home:/var/jenkins_home \
   # 确认/var/run/docker.sock存在
   -v /var/run/docker.sock:/var/run/docker.sock \
   # 确认/usr/bin/docker存在
   -v /usr/bin/docker:/usr/bin/docker \
   -e JAVA_OPTS=-Duser.timezone=Asia/Shanghai \
   -u root \
   a3f949e5ebfd
   ```

5. 之前的 jenkins 容器没有 docker in docker，但是在已经启动的容器中加入挂载目录很麻烦，所以想着重新弄个容器，但是很担心里面的数据都丢失了，所以只是`docker stop jenkins`，
   然后新开了上述容器，发现因为之前就设定了宿主机挂载目录，所以数据都在，那太棒了。为了防止意外，整体命令如下：

   ```bash
    docker stop jenkins
   ```

   ```bash
    # 直接备份老版本
   docker run -d --restart unless-stopped --name jenkins_dockerindocker_old \
   -p 2203:8080 -p 2204:50000 \
   -v /docker_volume/jenkins_home:/var/jenkins_home \
   # 确认/var/run/docker.sock存在
   -v /var/run/docker.sock:/var/run/docker.sock \
   # 确认/usr/bin/docker存在
   -v /usr/bin/docker:/usr/bin/docker \
   -e JAVA_OPTS=-Duser.timezone=Asia/Shanghai \
   -u root \
   a3f949e5ebfd
   ```

   看效果么问题之后：

   ```bash
    # 直接备份老版本
   docker stop jenkins_dockerindocker_old
   ```

   ```bash
    # 直接备份老版本
   docker run -d --restart unless-stopped --name jenkins \
   -p 2201:8080 -p 2202:50000 \
   -v /docker_volume/jenkins_home:/var/jenkins_home \
   # 确认/var/run/docker.sock存在
   -v /var/run/docker.sock:/var/run/docker.sock \
   # 确认/usr/bin/docker存在
   -v /usr/bin/docker:/usr/bin/docker \
   -e JAVA_OPTS=-Duser.timezone=Asia/Shanghai \
   -u root \
   a3f949e5ebfd
   ```

   ```bash
    # 删除备份容器
   docker rm -f jenkins_dockerindocker_old
   ```

   这个启动命令解决了时差问题，实现了 docker in docker，完成了宿主机备份数据

6. 容器数据备份
   参考资料：[详解复制备份 docker 容器数据的方法](https://www.jb51.net/article/183644.htm)
