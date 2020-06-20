/* @flow */

import { inBrowser } from './dom'
import { saveScrollPosition } from './scroll'
import { genStateKey, setStateKey, getStateKey } from './state-key'
import { extend } from './misc'

/**
 * 是否支持 pushState
 * @type {boolean|boolean|*}
 */
export const supportsPushState = inBrowser &&
  (function () {
    const ua = window.navigator.userAgent

    if (
      (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
      ua.indexOf('Mobile Safari') !== -1 &&
      ua.indexOf('Chrome') === -1 &&
      ua.indexOf('Windows Phone') === -1
    ) {
      return false
    }

    return window.history && typeof window.history.pushState === 'function'
  })()

/**
 * 改变状态
 * @param url
 * @param replace
 */
export function pushState (url?: string, replace?: boolean) {
  // 保存滚动的位置
  saveScrollPosition()
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    if (replace) {
      // 保留现有的历史记录状态，因为用户可以覆盖它
      // remark: H5 默认的 repalceState 是不会在history中留下记录的
      // preserve existing history state as it could be overriden by the user
      const stateCopy = extend({}, history.state)
      stateCopy.key = getStateKey()
      // 保留当前的状态。并传递给 url
      history.replaceState(stateCopy, '', url)
    } else {
      history.pushState({ key: setStateKey(genStateKey()) }, '', url)
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}

/**
 * 替换状态
 * @param url
 */
export function replaceState (url?: string) {
  pushState(url, true)
}
