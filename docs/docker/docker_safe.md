# docker 安全问题

挖矿程序 zbrtgwlxz 怀疑和 docker root 用户有关

## 场景

    服务器突然很卡，从阿里云上看硬盘读写达到峰值，用xshell连上去发现卡的连命令都打不了，然后无意中发现docker 有2个陌生的容器在运行，`rm - f`之后发现一切恢复正常。
    这时候关注阿里云的警报发现是发现挖矿木马。但是目前没去深入，有点担心之后还会出现这样的问题。

[记一次阿里云被植入挖矿木马的事件](https://www.cnblogs.com/bugutian/p/10881070.html)
