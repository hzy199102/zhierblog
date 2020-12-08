# 正则表达式

::: demo 各种各样有趣的正则表达式

```html
<template>
  <div class="red-center-text">
    <p v-for="item in regRes">{{ item }}</p>
    <p>{{ message }}</p>
    <input v-model="message" placeholder="Input something..." />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        regRule: {
          tanlan: {
            rule: "a+b",
            remark: "贪婪匹配"
          },
          feitanlan: {
            rule: "a+?b",
            remark: "非贪婪匹配"
          }
        },
        regStr: {
          tanlan: "aaab",
          feitanlan: "aaab"
        },
        regRes: {},
        message: "Hello Vue"
      };
    },
    created() {
      for (var item in this.regRule) {
        var pattern = new RegExp(this.regRule[item].rule);
        var res = pattern.exec(this.regStr[item]);
        this.regRes[item] = res;
      }
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
