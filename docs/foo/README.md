[[toc]]

# foo

[VuePress 中文文档 | VuePress 中文网](https://www.vuepress.cn/guide/markdown.html#%E7%9B%AE%E5%BD%95) <!-- VuePress 中文文档 | VuePress 中文网 -->

## Front Matter

---

title: Blogging Like a Hacker
lang: en-US

---

## GitHub 风格的表格

| Tables        |      Are      |       Cool |
| ------------- | :-----------: | ---------: |
| col 3 is      | right-aligned | \$16000000 |
| col 2 is      |   centered    |       \$12 |
| zebra stripes |   are neat    |     \$1122 |

## Emoji

:tada: :100:

## 自定义容器

::: tip
这是一个提示
:::

::: warning
这是一个警告
:::

::: danger
这是一个危险警告
:::

::: details
这是一个详情块，在 IE / Edge 中不生效
:::

::: theorem 牛顿第一定律
假若施加于某物体的外力为零，则该物体的运动速度不变。

::: right
来自 [维基百科](https://zh.wikipedia.org/wiki/%E7%89%9B%E9%A1%BF%E8%BF%90%E5%8A%A8%E5%AE%9A%E5%BE%8B)
:::

## 代码块中的语法高亮

输入

````
```js
export default {
  name: 'MyComponent',
  // ...
}
```

````

输出

```js {1,3-4}
export default {
  name: "MyComponent"
  // ...
};
```

<<< @/docs/.vuepress/config.js{14}

::: v-pre
`{{ This will be displayed as-is }}`
:::

# text <Tag/>

# text `<Tag/>`
