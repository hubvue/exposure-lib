# @exposure-lib/vue

[@exposure-lib/vue 中文文档](./README.zh-CN.md)

[@exposure-lib/core](../../README.md)

Based on @exposure-lib/core, using vue directives to bind elements and execute callbacks when they appear in the viewport, supporting `Vue 3.x`.

## Quick Start

### Install

```shell
pnpm add @exposure-lib/vue
```

If the required browser environment does not support the `InterfaceObserver API`, then `ployfill` can be introduced for normal use

```shell
pnpm add @exposure-lib/polyfill
```

**Introducing the package**

```js
import '@exposure-lib/polyfill'
import Exposure from '@exposure-lib/vue'
```

### Using Plugin

The @exposure-lib/vue callback function is executed by default when all areas of the element are displayed in the viewport.

```js
createApp(App).use(Exposure).mount('#app')
```


### In Component

@exposure-lib/vue is based on the vue directive wrapper, making it easier to develop components such as the one below.

```vue
<template>
  <div class="exposure-test">
    <div class="top" v-exposure="handlerTop"></div>
    <div class="middle" v-exposure="handlerMiddle"></div>
    <div class="bottom" v-exposure="handlerBottom"></div>
  </div>
</template>

<script>
export default {
  name: 'ExposureText',
  data() {
    return {
      handlerBottom: {
        enter() {
          console.log('bottom enter')
        },
        leave() {
          console.log('bottom leave')
        }
      }
    }
  }
  methods: {
    handlerMiddle() {
      alert('middle')
    },
    handlerTop() {
      alert('top')
    },
  },
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

Scrolls the interface and triggers the callback function when the element appears in the viewport.


#### Handler
For details, see[exposure-lib](../../README.md)
#### threshold

By default, the execution of the exposure callback waits for the entire bound element to be fully wrapped before it is executed. If you have a need to expose an element when a certain percentage of it appears, the
you can set the threshold, using the following two methods.

##### Golbal threshold

@exposure-lib/vue supports global threshold settings.

```js
Vue.use(Exposure, {
  threshold: 0.2,
})
```

As shown in the code above, the callback function is executed when the exposure ratio of the element reaches 0.2.

##### Element threshold

If you want the exposure ratio of an element to be different from that of other elements, you can set the threshold for the element separately.

```vue
<template>
  <div class="exposure-test">
    <div class="top" v-exposure:[0.1]="handlerTop"></div>
    <div class="middle" v-exposure:[0.5]="handlerMiddle"></div>
    <div class="bottom" v-exposure:[threshold]="handlerBottom"></div>
  </div>
</template>

<script>
export default {
  name: 'ExposureText',
  data() {
    return {
      threshold: 0.8,
    }
  },
}
</script>
```

Using Vue dynamic directive parameters for directives, the value passed must be a value between `[0,1]` so that the exposure will be in proportion to the value passed when listening to the exposure.

> Needs attention: Golbal threshold > Element threshold

### useResetExposure

Exposure callbacks are executed in a single instance, which means that once an exposure has been made and the callback executed, the callback function will not be executed again after another exposure.

There is a KeepAlive scenario in Vue components, where the exposure callback is not re-executed when the KeepAlive component is switched. In this case, if you want to re-execute it, you need to use the `useResetExposure` API to reset the element state.

```js
export default defineComponent({
  name: 'KeepaliveExposure',
  setup (props, context) {
    onDeactivated(() => {
      useResetExposure()
    })
  }
})
```

When calling `useResetExposure()` without passing any arguments, it will reset the execution state of all the listened elements in the current instance. If you need to reset the execution state of only one element, you need to pass in the current element.

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
