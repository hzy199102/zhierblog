# event loop 系列

1.  异步背后的“靠山”就是 event loops。这里的异步准确的说应该叫浏览器的 event loops 或者说是 javaScript 运行环境的 event loops，因为 ECMAScript 中没有 event loops，event loops 是在 HTML Standard 定义的。event loops 规范中定义了浏览器何时进行渲染更新，了解它有助于性能优化。

## 异步操作的方法

```js
function flush() {
...
}
function useMutationObserver() {
  var iterations = 0;
  var observer = new MutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

setTimeout(flush, 0);
```

      "&fields=id,title,image,author,publisher,price&apikey=0b2bdeda43b5688921839c8ecb20399b";
