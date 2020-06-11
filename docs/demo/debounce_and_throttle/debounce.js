function debounce(fn, wait) {
  var timeout = null;
  return () => {
    // timeout可以同时赋值多个settimeout定时器，不会被覆盖，所以一定要清除原有的，再赋值最新的。
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, wait);
  };
}
// 处理函数
function handle() {
  console.log(`函数防抖：${Math.random()}`);
}
// 滚动事件
window.addEventListener("scroll", debounce(handle, 1000));
