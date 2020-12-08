# vuepress 官方博客主题

## 参考资料

[Calendar](https://nhn.github.io/tui.calendar/latest/Calendar)
[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/views/1.x/)
[Demo Container](https://calebman.github.io/vuepress-plugin-demo-container/zh/#%E5%AE%83%E6%98%AF%E5%A6%82%E4%BD%95%E5%B7%A5%E4%BD%9C%E7%9A%84%EF%BC%9F)

## demo

参考资料：[@ vuepress / plugin-blog](https://vuepress-plugin-blog.ulivz.com/)

::: demo 此处放置代码示例的描述信息，支持 `Markdown` 语法，**描述信息只支持单行**

```html
<template>
  <div class="red-center-text">
    <p>{{ message }}</p>
    <input v-model="message" placeholder="Input something..." />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        message: "Hello Vue"
      };
    }
  };
</script>
<style>
  .red-center-text {
    color: #ff7875;
    text-align: center;
  }
</style>
```

:::
