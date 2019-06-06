class Tvue {
  constructor(options) {  // new Tvue里的值
    this.$options = options
    this._data = options.data // 参考源码，避免与data重名
    // 增加修改数据功能 进行数据劫持 数据劫持依赖发布订阅者模式
    this.observer(this._data)
    this.compile(options.el)  // 查找替换
  }
  observer(data) {
    Object.keys(data).forEach(key => {
      let value = data[key]
      let dep = new Dep() // 实例化发不器
      Object.defineProperty(data, key, {
        configurable: true,  // 可配置
        enumerable: true, // 可枚举
        get() { //一旦目标属性被访问就会调回此方法， 并将此方法的运算结果返回用户。
          if (Dep.target) {  
            dep.addSub(Dep.target)  // 注册
          }
          return value;
        },
        set(newValue) { //一旦目标属性被赋值， 就会调回此方法。 
          console.log("set", newValue)
          if (newValue !== value)
          value = newValue
          dep.notify(newValue)
        }
      })
    })
  }
  compile(el) {
    //  作用域 范围内查找  
    let element = document.querySelector(el)  // 获取<div id="app"></div>
    this.compileNode(element)
  }
  compileNode(element) { // 递归实现多层嵌套查找替换
    let childNodes = element.childNodes // 获取子节点
    Array.from(childNodes).forEach((node) => {
      // console.log(node, 'nodeType 属性可用来区分不同类型的节点，比如 元素, 文本 和 注释。')
      if (node.nodeType === 3) {
        // 文本替换
        let nodeContent = node.textContent
        let reg = /\{\{\s*(\S*)\s*\}\}/ // 考虑插值表达式的前后空格
        if (reg.test(nodeContent)) {
          node.textContent = this._data[RegExp.$1]
          // 初次渲染会有数据 数据渲染进行通知
          new Watcher(this, RegExp.$1, newValue => {
            node.textContent = newValue
          }) // 传参触发get

        }
      } else if (node.nodeType === 1) {  // 处理标签 实现v-model
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
          let attrName = attr.name;
          let attrValue = attr.value;
          if (attrName.indexOf("t-") == 0) {
              attrName = attrName.substr(2);
              if (attrName == "model") {
                  node.value = this._data[attrValue];
              }
              node.addEventListener("input", e => {
                  this._data[attrValue] = e.target.value;
              })
              new Watcher(this, attrValue, newValue => {
                  node.value = newValue;
              });
          }
        })

      }
      if (node.childNodes.length > 0) {
        this.compileNode(node)
      }
    })
  }
}
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  notify(newValue) {
    this.subs.forEach((v) => {
      v.updata(newValue)
    })
  }
}

class Watcher {
  constructor(vm,exp,cb) {
    console.log(vm._data, 'vm')
    console.log(exp, vm._data[exp], 'exp') // message 测试
    Dep.target = this // 判断watch是不是重复添加  dep.target = this  有没有watch
    vm._data[exp]  // 执行调取get vm=this
    this.cb = cb  // 挂载
    Dep.target = null // 阻止重复添加
  }
  updata(newValue) {
    console.log('更新', newValue) // 进行视图更新  修改
    // 只通知更新 不处理
    this.cb(newValue)
  }
}