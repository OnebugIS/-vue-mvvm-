
  // 继承了Array本身的原型方法，然后又做了劫持修改，可以发出通知。Vue在observer数据阶段会判断如果是数组的话，则修改数组的原型，这样的话，后面对数组的任何操作都可以在劫持的过程中控制
  var arrayMethod = Object.create(Array.prototype);
  ['push', 'shift'].forEach(function (method) {
    Object.defineProperty(arrayMethod, method, {
      value: function () {
        var i = arguments.length
        var args = new Array(i)
        while (i--) {
          args[i] = arguments[i]
        }
        var original = Array.prototype[method];
        var result = original.apply(this, args);
        console.log(result, 'reslut');
        return result;
      },
      enumerable: true,
      writable: true,
      configurable: true
    })
  })
  var bar = [1, 2];
  bar.__proto__ = arrayMethod;
  // bar.shift()
  bar.push(3);
