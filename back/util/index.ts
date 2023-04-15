// 删除value为0 false null undefined "" 的key
export const removeFalseValue = (json: { [key: string | symbol]: any }) => {
  // 而不是Object.keys  Object.keys无法遍历到Symbol
  Reflect.ownKeys(json).forEach((item) => {
    if (!json[item]) {
      delete json[item]
      // 判断子元素
    } else if (typeof json[item] === 'object') {
      removeFalseValue(json[item])
    }
  })
  return json
}

// 删除value为null undefined "" 的key
export const removeNullValue = (json: { [key: string | symbol]: any }) => {
  // 而不是Object.keys  Object.keys无法遍历到Symbol
  Reflect.ownKeys(json).forEach((item) => {
    if (!(json[item] || json[item] === 0 || json[item] === false)) {
      delete json[item]
      // 判断子元素
    } else if (typeof json[item] === 'object') {
      removeNullValue(json[item])
    }
  })
  return json
}

export const getFileType = (path: string) => {
  const sub = path.lastIndexOf('.')
  return sub !== -1 ? path.toLowerCase().substring(sub + 1) : 'unknown'
}
