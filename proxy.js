  function proxy(vm, key) {
    if (!isReserved(key)) {
      Object.defineProperty(vm, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter() {
          console.log(vm._data[key], 'vm._data[key]')
          return vm._data[key]
        },
        set: function proxySetter(val) {
          console.log(val, 'val')
          vm._data[key] = val;
        }
      });
    }
  }

  // 操作vm.data = 'x' 实际上还是执行的是vm_data.data = 'x'