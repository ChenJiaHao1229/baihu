// 删除value为false null undefined的key
export const removeNullValue = (json: { [key: string | symbol]: any }) => {
  // 而不是Object.keys  Object.keys无法遍历到Symbol
  Reflect.ownKeys(json).forEach((item) => {
    if (!(json[item] || json[item] === 0)) {
      delete json[item]
      // 判断子元素
    } else if (typeof json[item] === 'object') {
      removeNullValue(json[item])
    }
  })
  return json
}
