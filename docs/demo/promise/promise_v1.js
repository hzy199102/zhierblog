/**
 * promise函数
 * 1. 之所以用函数不用class，是为了方便定义对象的私有变量和私有方法
 * @param {*} executor 执行函数，原来执行同步或者异步操作
 */
function promise(executor) {
  // 三种基础状态
  const PENDING = "pending";
  const FULFILLED = "fulfilled";
  const REJECTED = "rejected";

  // 结果值，pendding状态下是undefined，fulfilled状态下是执行结果，rejected状态下是错误原因
  let value;

  // 状态，初始状态是pending
  let state = PENDING;

  // 立即运行执行函数
  executor();
}
