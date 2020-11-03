# 微前端向导

## 参考资料

[微前端简介](https://www.jianshu.com/p/785c2ca5a886)

## 概念

微前端主要是借鉴后端微服务的概念。简单地说，就是将一个巨无霸（Monolith）的前端工程拆分成一个一个的小工程。别小看这些小工程，它们也是“麻雀虽小，五脏俱全”，完全具备独立的开发、运行能力。整个系统就将由这些小工程协同合作，实现所有页面的展示与交互。

## 难点

1. 多个微前端如何共享数据，子 app 之间的通信
2. 如何按需顺序加载
3. 子 app 的生命周期
4. 路由和加载应用
5. 共享库

开发人员担心微前端架构的一个常见问题是浪费资源，每个前端都导入自己的框架版本。是的，如果开箱即用默认的 bundler，是的，这是一个问题，但这不是一定要解决的。

我个人的建议是使用共享库。这些库已经预先安装在系统上，并且可以由所有 app 导入。这是在将库部署到系统上时可以使用的文件夹结构的示例：

<pre><code class="language-treeview">
root_folder/
├── a first folder/
|   ├── holidays.mov
|   ├── javascript-file.js
|   └── some_picture.jpg
├── documents/
|   ├── spreadsheet.xls
|   ├── manual.pdf
|   ├── document.docx
|   └── presentation.ppt
└── etc.
</code></pre>

```tree -F
libraries/
|-- preact/
|   |-- 8/
|   |-- 10/
|-- components/
|   |-- 1/
|   |-- 2/
```

数字是什么意思？这些是那些库的主要版本。如果一个库遵循 semver，根据定义，如果它具有相同的主版本号，则它是向后兼容的。当应用程序要使用库时，它将指定要使用的主要版本，而不是特定的次要版本和修补程序版本

这种方法的好处：

缓存 - 浏览器缓存更有可能被更好地利用，因为应用程序将引用相同的库文件，而不是必须分别缓存的多个特定版本。
更新 - 使用这种方法，如果三方库中有错误修复稍有更改，要做的就是部署共享仓库的新版本，并且所有应用程序（无需重新编译）将自动使用最新版本，因为它们仅指定主版本。

6. 全局样式

在 spa 中控制全局样式可以使用 less sass 等控制其作用域, 但在微服务的架构中每个子项目都会使用自己的技术偏好,那么如何保证样式的独立性成为了一个问题, 在这里有一个解决方案, 那就是记录子 app 创建的 style 标签在生命周期卸载时, 移除他们, 这样每次在子 app 中互相切换不会互相影响彼此

7. 对性能的影响

   按需加载、公共依赖加载和预加载，是关于性能的，这些很重要，否则虽然上了微前端，但性能严重下降，或者由于升级引起线上故障，就得不偿失了。

## 优点

### 更多的构建

项目规模越大，构建该项目所花费的时间就越长。尽管 Webpack 和 Parcel 之类的打包工具通过使用多个线程和缓存来尽力提高打包的性能，但在我看来，但这没有结局根本问题。即使有了这些性能改进，随着 app 的不断增长，app 构建速度也会逐渐变慢。请记住，没有良好的开发体验，就很难提供良好的用户体验。

通过拆分为几个不同的项目，每个项目都有自己的构建方式，无论您的系统如何增长，每个项目的构建速度都会非常快。集成系统也将从中受益，因为每个项目都可以独立且并行的构建，并最终在最后合在一起。

### 并行开发

通过将拆分为单独的项目，可以让多个团队一起工作。每个团队可以负责系统的一项功能。例如，一个团队可以使用电话功能，而另一个团队可以使用联系人功能。每个团队可以拥有自己的 Git 仓库，并可以在需要时运行带有自己的版本控制和变更日志的部署。

在大多数情况下，这些团队不需要了解彼此的功能。但是，这两个应用程序之间仍然需要集成。每个团队都需要在公共 API 上定义并保证向后兼容。该 API 通常通过使用 URL 来实现(也可以由父容器定义)。