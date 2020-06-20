/**
 * 将b对象的键值对扩展到a上，会覆盖对象值
 * @param a
 * @param b
 * @returns {*}
 */
export function extend (a, b) {
  for (const key in b) {
    a[key] = b[key]
  }
  return a
}
