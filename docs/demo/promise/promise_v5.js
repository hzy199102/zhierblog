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
  // 为了能移除提示任务用的
  let tipTask;
  function change(newState, newValue) {
    if (state === PENDING) {
      // 限制只能在状态pending下改变，保证状态和结果值只改变一次
      value = newValue;
      state = newState;
      if (!onQueue.length && state === REJECTED) {
        /**
         * 当状态为rejected，而且没有注册回调函数，则在任务中放入一个提示任务。
         * 如果在MyPromise运行的这个宏任务中注册了回调，则在run中提示任务被移除
         * 直到最后，肯定会有没有注册回调函数的MyPromise对象。这个对象就会执行这个提示任务了
         * 例如一个链式调用p.then().then()....then()不可能无穷的，总会有最后一个。
         * 这最后一个返回的promise就不会被注册回调。所以这里添加的提示任务就会被执行了
         */

        tipTask = setTimeout(() => {
          // 为了能移除这个任务。把变量放在MyPromise函数作用域下'
          console.error(
            "在MyPromise里，需要注册一个处理错误的回调 \n" + (value || "")
          );
        }, 0);
      }
      // 这里执行run方法，在状态改变的时候尝试处理一下回调函数
      run();
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

  /**
   * 注意run函数的调用时机，就能发现无论在随时注册回调方法，都可以处理那个返回值。
   */
  function run() {
    if (state === PENDING) {
      return;
    }
    while (onQueue.length) {
      if (tipTask) {
        // 如果注册了回调。这里把change方法里加的提示任务移除掉
        clearTimeout(tipTask);
      }

      // 从队列的回调中拿出一份，放入下面模拟的微任务中
      let onObj = onQueue.unshift();
      // 用setTimeout模拟微任务，把回调放入，等待执行
      setTimeout(() => {
        // 判断当前状态下，是否注册了回调函数
        if (onObj[state].on) {
          // 加了回调函数运行时抓取错误
          try {
            // 有就运行回调函数，得到返回值
            let returnValue = onObj[state].on(value);
            if (returnValue instanceof myPromise) {
              /**
               * 返回值是MyPromise类型，用这个MyPromise对象的then方法，能得到返回MyPromise对象的状态和值。
               * 再利用nextPromise的resolve和reject方法作为参数得到状态和值，这样就实现了继承状态和值
               */
              returnValue.then(onObj[FULFILLED].next, onObj[REJECTED].next);
            } else {
              // 返回值不是MyPromise类型，直接改变nextPromise状态为fulfilled，值为回调函数的返回值
              onObj[FULFILLED].next(returnValue);
            }
          } catch (error) {
            // 如果回调函数报错则以rejected的状态向下传递
            onObj[REJECTED].next(error);
          }
        } else {
          /**
           * 当前状态没有注册回调函数，则利用保存的nextPromise对象的resolve或reject，改变nextPromise对象的状态，同时传递当前值
           * 这就相当于传递了状态和值
           */
          onObj[state].next(value);
        }
      }, 0);
    }
  }

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
      /**
       * 状态和结果值需要向下传递，就是从当前myPromise对象传递到nextPromise对象
       * myPromise对象的状态和当前值，只能通过它的resolve和rejected方法才能改变
       * 所以这里把nextResolve和nextReject也存储到队列中，方便传递和继承。
       */
      onQueue.push({
        [FULFILLED]: {
          on: onFulfilled,
          next: nextResolve
        },
        [REJECTED]: {
          on: onRejected,
          next: nextReject
        }
      });
    });
    // 这里执行run方法。用来处理注册的回调函数，run方法里有判断，为pending状态不处理回调函数
    run();
    return nextPromise;
  }

  this.then = register.bind(this);
  this.catch = register.bind(this, undefined);

  // 如果executor不是函数类型，就向外抛错
  if (!(executor instanceof Function)) {
    throw new TypeError(
      executor + " 不是个函数。亲！MyPromise参数得是个函数的呢"
    );
  }
  /**
   * 立即运行执行函数
   * 以参数形式对外暴露resolve, reject方法
   * 这里又加了try...catch为执行函数运行时抓取错误。
   * 但是有个问题就是如果executor不是函数，光加个try就不会向外抛出错误了，所以在这前边再加个判断
   */
  try {
    executor(resolve, reject);
  } catch (error) {
    /**
     * 如果执行函数报错，改变自身状态为rejected。
     * 如果在状态改变之后报错，也会执行这里，但是前面已经限制了状态只能改变一次。
     * 在这里调用reject方法就没有用了。达到了状态改变之后报错不处理的效果。
     */
    reject(error);
  }
}
