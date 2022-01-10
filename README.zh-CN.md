# vue-exposure

![npm](https://img.shields.io/npm/v/vue-exposure) ![npm bundle size](https://img.shields.io/bundlephobia/min/vue-exposure) ![npm](https://img.shields.io/npm/dm/vue-exposure) ![NPM](https://img.shields.io/npm/l/vue-exposure)

[支持 Vue 2.x 文档](https://github.com/hubvue/vue-exposure)

基于 InterfaceObserver API，采用 vue 指令的方式绑定元素，当元素出现在视窗内的时候执行回调函数。

## Quick Start

### Install

> npm install vue-exposure --save

由于 InterfaceObserver API 的兼容性在一些低版本浏览器上支持的还是不怎么好，于是 vue-exposure 推出两个包：正常包、带有 polyfill 的包。

**引入正常包**

```js
import Exposure from '@vue-exposure/next'
```

**引入带有 polyfill 包**

```js
import Exposure from '@vue-exposure/polyfill'
```

### 使用插件

vue-exposure 默认当元素全部区域都展示在视窗时才会执行回调函数。

```js
createApp(App).use(Exposure).mount('#app')
```

### 在组件中使用

vue-exposure 基于 vue 指令封装，使得在开发过程中更加方便，例如下面这个组件。

```vue
<template>
  <div class="exposure-test">
    <div class="top" v-exposure="handlerTop"></div>
    <div class="middle" v-exposure="handlerMiddle"></div>
    <div class="bottom" v-exposure="handlerBottom"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BaseExposure',
  setup() {
    const handlerTop = () => {
      alert('top')
    }
    
    const handlerMiddle = {
      enter() {
        alert('middle enter')
      },
      leave() {
        alert('middle leave')
      }
    }

    const handlerBottom = () => {
      alert('bottom')
    }
    return {
      handlerTop,
      handlerMiddle,
      handlerBottom,
    }
  },
})
</script>
```

滚动界面，当元素出现在视窗内的时候触发回调函数。


#### handler
handler 也就是指令的值，和计算属性(computed)的类似，有两种类型：函数或对象

##### 函数

函数类型是比较普遍的写法, 函数handler只会在元素进入曝光且符合threshold情况下触发一次。

##### 对象

对象类型的handler需要有enter和leave属性其一，且enter和leave属性的值为函数类型。

enter: enter handler 会在元素进入曝光且符合threshold情况下触发一次；
leave: leave handler 会在 enter handler 触发后，元素彻底离开可视区域后触发一次；

#### threshold

默认情况下，曝光回调的执行是等待整个绑定元素全部包裹后才会执行。如果您有需求当元素出现一定比例是曝光，
可以设置 threshold，使用下面两种方式。

##### 全局级 threshold

vue-exposure 支持全局的 threshold 设置。

```js
createApp(App)
  .use(Exposure, {
    threshold: 0.2,
  })
  .mount('#app')
```

如上面代码所示，当元素的曝光比例达到 0.2 的时候，就会执行回调函数。

##### 元素级 threshold

如果你想要某个元素的曝光比例与其他元素的不同，可单独为元素设置 threshold，

```vue
<template>
  <div class="exposure-test">
    <div class="top" v-exposure:[0.1]="handlerTop"></div>
    <div class="middle" v-exposure:[0.5]="handlerMiddle"></div>
    <div class="bottom" v-exposure:[threshold]="handlerBottom"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BaseExposure',
  setup() {
    const threshold = ref(0.8)
    const handlerTop = () => {
      alert('top')
    }
    const handlerMiddle = () => {
      alert('middle')
    }
    const handlerBottom = () => {
      alert('bottom')
    }
    return {
      threshold,
      handlerTop,
      handlerMiddle,
      handlerBottom,
    }
  },
})
</script>
```

使用 Vue 动态指令参数的方式对指令传参，所传值必须是`[0,1]`之间的数值，这样在监听曝光的时候就会按照所传值的比例进行曝光。

> 需要注意：元素级 threshold > 全局级 threshold

### useResetExposure

曝光回调的执行是单例的，也就是说当曝光过一次并且回调执行后，再次曝光就不会再执行回调函数。

在 Vue 组件中存在 KeepAlive 的场景，当 KeepAlive 组件切换的时候曝光回调也不会重新执行。这种情况下如果想要重新执行就需要使用`useResetExposure`API 去重置元素状态。

```js
export default defineComponent({
  name: 'KeepaliveExposure',
  setup (props, context) {
    onDeactivated(() => {
      useResetExposure()
    })
  }
})
</script>
```

当调用`useResetExposure()`不传入任何参数的时候讲会把当前实例中所有监听元素的执行状态全部重置。如果需要只重置某个元素的执行状态，需要传入当前元素。

```js
export default defineComponent({
  name: 'KeepaliveExposure',
  setup(props, context) {
    onDeactivated(() => {
      useResetExposure(element)
    })
  },
})
```

#### 注意事项

vue-exposure 监听元素是严格模式的，当一个元素的`visibility`为`hidden`或者`width`为`0`或者`height`为`0`都不会去监听。
