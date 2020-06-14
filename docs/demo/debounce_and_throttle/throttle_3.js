// 节流throttle代码（时间戳+定时器）：
var throttle = function(func, delay) {
  var timeout = null;
  var startTime = Date.now();
  return () => {
    var curTime = Date.now();
    var remaining = delay - (curTime - startTime);
    var args = arguments;
    if (remaining <= 0) {
      // 超过delay，清除定时器，包括重置timeout，然后立即执行函数，如果它是首次触发，或者最后一次触发，都会被执行！
      // 一定要timeout = null，否则下次触发scroll可能不执行函数了。
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      func.apply(this, args);
      startTime = Date.now();
    } else {
      // 没超过delay，如果没有定时器，立即注册一个，保证执行完定时器之后，重置startTime，否则会出现刚执行完定时器，又满足remaining <= 0的情况，执行函数会连续触发2次。
      // 如果已经存在定时器，那么没必要在去注册一个了，因为即使清除现有的，再注册一个，注意remaining，新建的定时器和已有的定时器会在同一时刻被触发。
      // 它能保证最后一次scroll触发一次触发被执行。
      if (!timeout) {
        timeout = setTimeout(() => {
          func.apply(this, args);
          startTime = Date.now();
          timeout = null;
        }, remaining);
      }
    }
  };
};
function handle() {
  console.log(`函数节流（时间戳+定时器）：${Math.random()}`);
}
window.addEventListener("scroll", throttle(handle, 1000));
