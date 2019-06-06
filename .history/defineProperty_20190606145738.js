<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="">
  </head>
  <body>
  </body>
</html>
<script>
  let obj = Object.defineProperty({}, "name", {
    configurable: true,  // 可修改
    enumerable: true, // 可枚举
    get:() =>{
      console.log('get')
      // return "张三"
    },
    set:(newValue) => {
      console.log('set', newValue)
    }
  })
obj.name // 一旦目标属性被访问就会调回此方法， 并将此方法的运算结果返回用户
obj.name = "李四" // 一旦目标属性被赋值， 就会调回此方法
</script>