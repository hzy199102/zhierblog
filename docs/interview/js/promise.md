# promise

参考资料：[手写 Promise，手把手过程](https://mp.weixin.qq.com/s/q8JFWNaOZvzeLnsol7wdXw)

## 目标

1. promise 的基本功能
2. promise 的使用场景
3. promise 的实现原理
4. promise 的常见问题
5. promise 的扩展

## promise 的实现原理

### promise 是一个容器

模拟 promise 首先需要实现它的最基本的功能

1. promise 这个容器，用来存储异步或同步执行的结果。
2. 需要状态，来反映同步或者异步处理的阶段，有三种状态
   1. pending：异步或同步的执行阶段，这个时候结果值为 undefined
   2. fulfilled：异步或者同步成功返回了结果的状态，这个时候结果值记录返回的正确结果
   3. rejected：异步或者同步出现错误时的状态，这个时候结果值记录错误的原因
3. 在 promise 对象外部不鞥直接访问到 promise 的状态和结果值
4. 以参数的形式，向 promise 传递执行函数（执行同步或者异步的函数），它会在 promise 的构造函数中执行，也就是初始化 promise 对象的时候就会立即执行的函数。
   这就是为什么我们使用 promise 的时候会有一个工厂函数，专门用于初始化 promise 对象。

代码：

<<< @/docs/demo/promise/promise_v1.js{2}
