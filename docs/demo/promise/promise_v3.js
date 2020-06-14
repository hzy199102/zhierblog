/**
 * myPromise函数
 * 1. 之所以用函数不用class，是为了方便定义对象的私有变量和私有方法
 * @param {*} executor 执行函数，原来执行同步或者异步操作
 */
function myPromise(executor) {
  // 三种基础状态
  const PENDING = "pending";
  const FULFILLED = "fulfilled";
  const REJECTED = "rejected";

  // 结果值，pendding状态下是undefined，fulfilled状态下是执行结果，rejected状态下是错误原因
  let value;

  // 状态，初始状态是pending
  let state = PENDING;

  function change(newState, newValue) {
    if (state === PENDING) {
      // 限制只能在状态pending下改变，保证状态和结果值只改变一次
      value = newValue;
      state = newState;
    }
  }

  /**
   * 对外暴露的改变状态和结果值的方法，对外使用的时候只需要传递结果值，因为状态已经设置好了
   * 等价于
   * let resolve = function(value) {
   *   change(FULFILLED, value);
   * };
   */
  let resolve = change.bind(this, FULFILLED);
  let reject = change.bind(this, REJECTED);

  /** 本次看点 */
  // 为了能注册多个回调，定义了onQueue，存储注册的回调，等待状态改变后调用
  var onQueue = [];

  /**
   * 注册回调函数必须返回新的myPromise对象，
   * 另外新的执行函数仅仅是将注册的回调函数放到当前myPromise对象的回调队列中
   * 请思考一个问题：如何将当前myPromise对象的状态和结果值用在新的myPromise对象的reslove和rejected方法中
   * @param {*} onFulfilled
   * @param {*} onRejected
   */
  function register(onFulfilled, onRejected) {
    let nextPromise = new myPromise((nextResolve, nextReject) => {
      onQueue.push({
        [FULFILLED]: { on: onFulfilled },
        [REJECTED]: { on: onRejected }
      });
    });
    return nextPromise;
  }

  this.then = register.bind(this);
  this.catch = register.bind(this, undefined);
  /** 本次看点 */

  /**
   * 立即运行执行函数
   * 以参数形式对外暴露resolve, reject方法
   */
  executor(resolve, reject);
}
