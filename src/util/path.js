/* @flow */

/**
 * 处理路径
 * @param relative
 * @param base
 * @param append
 * @returns {string}
 */
export function resolvePath (
  relative: string,
  base: string,
  append?: boolean
): string {
  // 如果路径是 / 开头，则返回当前这个 相对路径
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }

  // 如果路径已 ？或者 # 开始，则返回基础路径 =relative
  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // 如果满足以下条件，则删除尾随段：
  // -不附加
  // -追加到斜杠后面（最后一段为空）
  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

/**
 * 将url中的 ptah query hash 抽离出来
 * @param path
 * @returns {{path: string, query: string, hash: string}}
 */
export function parsePath (path: string): {
  path: string;
  query: string;
  hash: string;
} {
  let hash = ''
  let query = ''

  /**
   * 是否有 #
   * @type {number}
   */
  const hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  /**
   * 如果有 ? ，
   * @type {number}
   */
  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    path,
    query,
    hash
  }
}

/**
 * 将 //a//b 替换成 /a/b
 * @param path
 * @returns {string}
 */
export function cleanPath (path: string): string {
  return path.replace(/\/\//g, '/')
}
