/* @flow */

/**
 * 执行队列
 * @param queue {to,from,next}
 * @param fn
 * @param cb
 */
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    // 如果执行到了队列的最后一个，则执行回到函数
    if (index >= queue.length) {
      cb()
    } else {
      // 当前队列存在的话执行，不存在尝试找队列中下一个
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
