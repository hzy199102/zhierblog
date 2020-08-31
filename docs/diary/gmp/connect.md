# gmp 链接数过多导致并发量太大问题调优

## 问题现场

华为云服务挂了，网页打不开，看请求数，发现并发量达到 1.5W+。可以提升配置，但是目前的更好做法是减少请求量。

## 解决思路

1. 列出前 100 的请求，逐个判断哪些是瓶颈，可以被优化。这里通过华为云自带服务 graylog。

2. 发现 favicon.ico 可以去除，PC 端网页不需要这个。

3. 文章接口优化，多个文章接口合并成一个，并且指定需要的字段，同时减少网络请求量和网络并发量

4. 栏目接口优化，合并

5. 土建资源 cdn 化，之前没做处理

6. 网页初始化获取了数据，用户异步登录之后又重新获取了数据，这个可以业务优化，根据用户登录情况只取一次数据

7. 华为云图片裁剪功能，减少图片大小

8. 考虑 pwa

   ```js
   console.log("serviceWorker" in navigator);
   ```

   验证存在

9. 统计所有涉及的项目有 gmp-side,gmp-user,gmp-course,gmp-project,gmp-shop,gtj-side,gtj-user,gtj-feedback,gccp-5-user,gccp-5-news,gccp-6-user,gccp-6-news,gmp-hot

## 解决流程

### gmp-side

![gmp-side原始network概览图](./img/connect/gmp-side.png)
