# vue-exposure

![npm](https://img.shields.io/npm/v/vue-exposure) ![npm bundle size](https://img.shields.io/bundlephobia/min/vue-exposure) ![npm](https://img.shields.io/npm/dm/vue-exposure) ![NPM](https://img.shields.io/npm/l/vue-exposure)

[中文简体](./README.zh-CN.md)

[Support Vue 2.x Document](https://github.com/hubvue/vue-exposure)

Based on the `InterfaceObserver` API, the vue directive is used to bind the element and execute callback functions when the element appears in the viewport.

## Quick Start

### Install

> npm install vue-exposure --save

Since `InterfaceObserver` API compatibility is still not well supported in some lower versions of browsers, `vue-exposure` released two packages: `normal` and `with polyfill`.

**import normal package**

```js
import Exposure from '@vue-exposure/next'
```

**import polyfill package**

```js
import Exposure from '@vue-exposure/polyfill'
```

### Use Plugin

By default, vue-exposure executes the callback function only when all areas of the element are displayed in the viewport.

```js
createApp(App).use(Exposure).mount('#app')
```

### Use in component

vue-exposure is based on the vue directive wrapper, making it easier to develop, components such as the following.

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
    const handlerMiddle = () => {
      alert('middle')
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

Scroll through the interface, triggering the callback function when the element appears in the viewport.

#### threshold

By default, exposure callbacks are not executed until the entire bound element is wrapped. If you have a need when a certain percentage of the element is exposed, the threshold can be set in the following two ways.

##### Global threshold

vue-exposure supports global threshold setting.

```js
createApp(App)
  .use(Exposure, {
    threshold: 0.2,
  })
  .mount('#app')
```

As shown in the above code, the callback function is executed when the exposure ratio of the element reaches 0.2.

##### Element threshold

If you want an element to have a different exposure ratio than other elements, you can set the threshold for the element separately.

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

The directive is parameterized using Vue's dynamic directive parameters, which must be passed as a value between `[0,1]` so that the exposure is scaled to the passed value when listening to the exposure.

> Note: Element threshold > Global threshold.

### useResetExposure

The execution of the exposure callback is single-case, which means that when exposed once and the callback is executed, the callback function is not executed when exposed again.

In the case of a KeepAlive scenario in a Vue component, the exposure callback is not re-executed when the KeepAlive component is switched. In this case, you need to use the `useResetExposure` API to reset the element state if you want to re-execute it.

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

When `useResetExposure()` is called without any arguments, it resets the execution state of all listener elements in the current instance. If you need to reset the execution state of just one element, you need to pass in the current element.

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

#### Caution

vue-exposure listens on elements in strict mode, and does not listen on elements whose `visibility` is `hidden` or whose `width` is `0` or whose `height` is `0`.
