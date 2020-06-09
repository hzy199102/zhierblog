# 禁止调试

参考资料：[前端防止 JS 调试技巧](https://www.cnblogs.com/ceet/p/12166990.html)，[前端页面禁止调试 debugger 方法汇总](http://www.fly63.com/article/detial/8775)，
[**defineGetter** 引发的思考](https://segmentfault.com/a/1190000002407109)

1. `defineProperty`原理，只要打开控制台就会触发指定变量的 get 方法，达到监听控制台打开的效果

```js
<script>
    //debug调试时跳转页面
    var element = new Image();
    Object.defineProperty(element,'id',{get:function(){window.location.href="https://www.baidu.com"}});
    console.log(element);
</script>
```

2. 一道面试题

```js
(function() {
  var u = { a: 1, b: 2 };
  var r = {
    m: function(k) {
      return u[k];
    }
  };
  window.r = r;
})();

var R = window.r;
alert(r.m("a"));

/**
 * 能否通过r.m获取到u
 * 你能否想到通过属性访问自身
 * 你能否想到使用原型继承来定义访问自身的属性
 * 你是否知道 Object.prototype.__defineGetter__和defineProperty方法
 *
 */
// 这个方法已废弃
Object.prototype.__defineGetter__("x123c3", function() {
  return this;
});
alert(R.m("x123c3"));
delete Object.prototype["x123c3"];
// 这是标准方法
Object.defineProperty(Object.prototype, "blablabla", {
  get: function() {
    return this;
  }
});
console.log(R.m("blablabla"));
```
