# vue-exposure

基于 InterfaceObserver API，当绑定元素出现在视窗内的时候执行回调。

## Quick Start

### Install

> npm install vue-exposure --save

```js
//vue main.js
import Exposure from 'vue-exposure'
import Vue from 'vue'

Vue.use(Exposure)
```

```js
//test.vue
<template>
  <div class="test">
    <div class="top" v-exposure="handlerTop"></div>
    <div class="middle" v-exposure="handlerMiddle"></div>
    <div class="bottom" v-exposure="handlerBottom"></div>
  </div>
</template>

<script>
export default {
  name: 'Test',
  methods: {
    handlerMiddle() {
      console.log('middle')
    },
    handlerBottom() {
      console.log('bottom')
    },
    handlerTop() {
      console.log('top')
    }
  }
}
</script>

<style scoped>
.top {
  background-color: red;
  margin-bottom: 1000px;
}
.middle {
  background-color: yellowgreen;
}
.bottom {
  background-color: blue;
  margin-top: 1000px;
}
</style>
```

> 回调的执行是单例的，也就是执行过一次之后内部会将此监听元素标记为已执行，如果想要重新执行，例如 Keep-Alive 的场景，当从别的页面回到 Keep-Alive 的页面的时候想要重新执行。就需要下面这段逻辑。

```js
deactivated() {
  this.$resetExposure()
}
```

Exposure 内部向 Vue 实例上绑定`$resetExposure`方法，用于重置监听元素的状态，重置之后，元素再次出现再视窗中依然会执行。
