/* @flow */

import { warn } from './warn'

// url 的正则表达式库
// 参见：https://github.com/pillarjs/path-to-regexp#readme

import Regexp from 'path-to-regexp'

// $flow-disable-line
/**
 * 缓存下来 regexp 的编译结果
 * @type {any}
 */
const regexpCompileCache: {
  [key: string]: Function
} = Object.create(null)

/**
 * 填充参数
 * @param path
 * @param params
 * @param routeMsg
 * @returns {*}
 */
export function fillParams (
  path: string,
  params: ?Object,
  routeMsg: string
): string {
  params = params || {}
  try {
    // 获取 path 对应的编译的值
    const filler = regexpCompileCache[path] || (regexpCompileCache[path] = Regexp.compile(path))

    // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
    // and fix #3106 so that you can work with location descriptor object having params.pathMatch equal to empty string
    if (typeof params.pathMatch === 'string') params[0] = params.pathMatch

    return filler(params, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      // Fix #3072 no warn if `pathMatch` is string
      warn(typeof params.pathMatch === 'string', `missing param for ${routeMsg}: ${e.message}`)
    }
    return ''
  } finally {
    // delete the 0 if it was added
    delete params[0]
  }
}
