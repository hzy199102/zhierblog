function throttle(fn, delay) {
  var prev = Date.now();
  return () => {
    var now = Date.now();
    if (now - prev >= delay) {
      fn.apply(this, arguments);
      prev = Date.now();
    }
  };
}
// 处理函数
function handle() {
  console.log(`函数节流（时间戳）：${Math.random()}`);
}
// 滚动事件
window.addEventListener("scroll", throttle(handle, 1000));
