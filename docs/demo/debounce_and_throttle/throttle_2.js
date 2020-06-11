function throttle(fn, delay) {
  var timeout = null;
  return () => {
    if (!timeout) {
      var args = arguments;
      timeout = setTimeout(() => {
        fn.apply(this, args);
        timeout = null;
      }, delay);
    }
  };
}
// 处理函数
function handle() {
  console.log(`函数节流（定时器）：${Math.random()}`);
}
// 滚动事件
window.addEventListener("scroll", throttle(handle, 1000));
