class Tvue {
  constructor(options, vm) {  // new Tvue里的值
    this.$options = options
    this._data = options.data // 参考源码，避免与data重名
    // 增加修改数据功能 进行数据劫持 数据劫持依赖发布订阅者模式
    this.observer(this._data)  // 观察者
    this.compile(options.el)  // 查找替换
    if (options.created) { // 注册使用created
      options.created.call(this)
    }
  }
  observer(data) {
    if (!data) return
    Object.keys(data).forEach(key => {
      let value = data[key]
      let dep = new Dep() // 实例化发不器   依赖收集器构造函数
      // dep与key是一一对应的关系，每个key都会生成新的watcher
      console.log(dep, 'dep---dep14')
      Object.defineProperty(data, key, {
        configurable: true,  // 可配置
        enumerable: true, // 可枚举
        get() { //一旦目标属性被访问就会调回此方法， 并将此方法的运算结果返回用户。
          if (Dep.target) {  
            console.log(Dep.target, 'Dep.target')
            dep.addDep(Dep.target)  // 注册  维护dep里的若干个watcher
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
      this.proxyData(key); // 将vm._data.message代理为vm.message
    })
  }
  proxyData(key) {
    Object.defineProperty(this, key , {
      get() {
        return this._data[key]
      },
      set(newValue) {
        this._data[key] = newValue
      }
    })
  }
  compile(el) {
    // this.$vm = vm;
    //  作用域 范围内查找  
    this.$el = document.querySelector(el)  // 获取<div id="app"></div>
    if (this.$el) {
      // 提取宿主环境中模版内容到Fragment标签，提升dom操作效率
      this.$fragment = this.node2Fragment(this.$el)
      console.log(this.$fragment, this.$el, '53---53')
      // 编译模版内容，同时进行依赖收集
      this.compileNode(this.$fragment)
      this.$el.appendChild(this.$fragment)
      // this.compileNode(this.$el)
    }
  }
  node2Fragment(el) {
    const fragment = document.createDocumentFragment()  // 创建文档片段，附加到dom树中
    console.log(fragment, 'fragment---fragment--62')
    let child;
    while(child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }
  compileNode(el) { // 递归实现多层嵌套查找替换
    let childNodes = el.childNodes // 获取子节点
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
      if (node.childNodes && node.childNodes.length > 0) {
        this.compileNode(node)
      }
    })
  }
}
class Dep {
  constructor() {
    this.deps = []
  }
  addDep(dep) {
    this.deps.push(dep)
  }
  notify(newValue) {
    this.deps.forEach((dep) => {
      dep.updata(newValue)
    })
  }
}

class Watcher {  // 订阅者
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