type eventBusType = {
  evnetList: { callbackFun: (obj: any) => void; name: string }[]
  $on: (name: string, callbackFun: (obj: any) => void) => void
  $emit: (name: string, obj: any) => void
  $remove: (name: string) => void
}

// 事件总线对象
const eventBus: eventBusType = {
  evnetList: [],
  // 监听事件
  $on(name, callbackFun) {
    // 同名事件 过滤
    if (this.evnetList.length > 0 && this.evnetList.find((i) => i.name === name)) {
      this.evnetList = this.evnetList.filter((i) => i.name !== name)
    }
    this.evnetList = [...this.evnetList, { name, callbackFun }]
  },
  // 触发事件
  $emit(name, obj) {
    if (name) {
      this.evnetList.forEach((item) => {
        if (name === item.name) {
          item.callbackFun(obj)
        }
      })
    }
  },
  // 取消事件监听
  $remove(name) {
    this.evnetList = [...this.evnetList.filter((i) => i.name !== name)]
  }
}
export default eventBus
