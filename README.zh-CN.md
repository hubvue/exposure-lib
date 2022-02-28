# exposure-lib

基于 InterfaceObserver API，监听元素是否可见，当元素出现在视窗内的时候执行回调函数。

## Quick Start

### Install

> npm install @exposure-lib/core --save

由于 InterfaceObserver API 的兼容性在一些低版本浏览器上支持的还是不怎么好，可以事先引入polyfill至于`@exposure-lib/core`正常使用。

> npm install @exposure-lib/polyfill --save

**引入包**

```ts
import '@exposure-lib/polyfill'
import * as Exposure from '@exposure-lib/core'
```

> 注意：polyfill包一定要在core包之前引入

### Usage

使用`exposure`来监听元素是否出现在可视区内非常简单，只需要两步即可。

1. 首先需要创建一个`Exposure`用来监听元素，它通过`createExposure`方法创建。

```ts
import { createExposure } from '@exposure-lib/core'
const exposure = createExposure()
```

2. 然后调用`Exposure`的`observe`方法监听元素

```ts
const el = document.getElementById('el')
exposure.observe(el, () => {
  console.log('exposure')
})
```
`exposure.observe`方法至少接受两个参数，第一个参数为Element类型的元素，第二个参数为Handler，当监测元素出现在可视区内执行Handler，第三个参数为监听阈值(可选)。


#### threshold

默认情况下，曝光回调的执行是等待整个绑定元素全部包裹后才会执行。如果您有需求当元素出现一定比例是曝光，
可以设置 threshold，使用下面两种方式。

##### Exposure threshold

每次调用`createExposure`方法创建`Exposure`支持传入threshold用于当前`Exposure`作用域下的元素使用。

```ts
const exposure = createExposure(0.2)
```

如上面代码所示，当元素的曝光比例达到 0.2 的时候，就会执行回调函数。

##### Element threshold

如果你想要某个元素的曝光比例与其他元素的不同，可单独为元素设置 threshold，

```ts
const el = document.getElementById('el')
const exposure = createExposure(0.2)

exposure.observe(el, () => {
  console.log('exposure')
}, 0.8)

```

> 需要注意：Element threshold > Exposure threshold


#### Handler
Handler 也就是指令的值，有两种类型：函数或对象

**函数**

函数类型是比较普遍的写法, 函数Handler只会在元素进入曝光且符合`threshold`情况下触发一次。

**对象**

对象类型的Handler需要有`enter`和`leave`属性其一，且`enter`和`leave`属性的值为函数类型。

- enter: enter Handler 会在元素进入曝光且符合`threshold`情况下触发一次；
- leave: leave Handler 会在 enter Handler 触发后，元素彻底离开可视区域后触发一次；


#### resetExposure

曝光回调的执行是单例的，也就是说当曝光过一次并且回调执行后，再次曝光就不会再执行回调函数。如果需要再次曝光则需要调用`resetExposure`来重置。

```ts
import { resetExposure } from '@exposure-lib/core'
// 重置所有元素
resetExposure()
// 重置el元素
const el = document.getElementById('el')
resetExposure(el)
```

#### unobserve

当页面销毁需要将当前页面内监听元素取消，调用`exposure.unobserve`方法取消监听元素

```ts
const el = document.getElementById('el')
const exposure = createExposure(0.2)

exposure.observe(el, () => {
  console.log('exposure')
}, 0.8)

// 页面销毁
destory(() => {
  exposure.unobserve(el)
})
```
### 注意事项

vue-exposure 监听元素是严格模式的，当一个元素的`visibility`为`hidden`或者`width`为`0`或者`height`为`0`都不会去监听。
