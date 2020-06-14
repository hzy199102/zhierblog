# 学习的资料

1. [小 tips:了解 CSS 变量 var](https://www.zhangxinxu.com/wordpress/2016/11/css-css3-variables-var/comment-page-1/)

## 巨坑

### 选择题选项标注对错失效

![选择题选项标注对错失效](./img/1.png)

如图，选择了答案之后，和正确答案进行对比，错了打叉，对了打钩，但是，突然这个功能失效了，无论你选择啥，他都不显示对错。
这个问题花了我 2 个多小时才定位和解决！
定位问题：

1. 打日志

   ```js
   // 源码
   console.log(referAnswer);
   console.log(answer);
   referAnswer.indexOf(answer) > -1;

   // 日志
   // 正确答案：["379436326798418"]
   // 当前选择：379436326752773
   ```

2. 分析
   乍看就没问题啊，后来突然反应过来，answer 是 number 类型，而且是这个那么多位数的数值，对比铁定出现失去精度导致对比失效。

3. 解决

   ```js
   answer = answer.toString();
   ```
