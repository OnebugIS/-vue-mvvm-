# -vue-mvvm-
模仿vue数据劫持，实现mvvm框架

### 运行
打开index.html即可 


模仿vue的mvvm实现方式，实现数据渲、改变data以及v-model
```
  script src="Tvue.js"></script>
  <body>
    <div id="app">
      {{message}}
      <p>{{message}}</p>
    </div>
  </body>
  <script>
    let vm = new Tvue({
      el: "#app",
      data: {
        message: '测试'
      }
    })
  </script>
```
先实现数据替换功能
```
  class Tvue {
  constructor(options) {  // new Tvue里的值
    this.$options = options
    this._data = options.data  // 参考源码，避免与data重名
    this.compile(options.el)  // 查找替换
  }
  compile(el) {
    //  作用域 范围内查找   
    let element = document.querySelector(el)  // 获取<div id="app"></div>
    let childNodes = element.childNodes  // 获取子节点
    Array.from(childNodes).forEach((node) => {
      // console.log(node, 'nodeType 属性可用来区分不同类型的节点，比如 元素, 文本 和 注释。')
      if (node.nodeType === 3) {
        // 文本替换
        let nodeContent = node.textContent
        let reg = /\{\{\s*(\S*)\s*\}\}/  // 考虑插值表达式的前后空格
        if (reg.test(nodeContent)) {  
          node.textContent = this._data[RegExp.$1]
        }
      } else {
        
      }
    })
  }
}
```
打开浏览器mvvm模式已经实现，有个问题是<p>{{message}}</p>还没有被替换，还需要使用递归实现多层嵌套查找替换

![](https://user-gold-cdn.xitu.io/2019/6/5/16b27196c13f3161?w=171&h=96&f=png&s=3492)
```
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
        }
      } else if (node.nodeType === 1) {  // 处理标签

      }
      if (node.childNodes.length > 0) {
        this.compileNode(node)
      }
    })
  }
```
OK,截止目前可以实现多层数据嵌套

![](https://user-gold-cdn.xitu.io/2019/6/5/16b272b620ee8e3c?w=140&h=84&f=png&s=1740)
接下来实现v-model
```
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
```

![](https://user-gold-cdn.xitu.io/2019/6/5/16b2858c7ae70b7f?w=612&h=274&f=png&s=13194)
