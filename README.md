# exposure-lib

[中文文档](./README.zh-CN.md)


Based on the InterfaceObserver API, listens for elements to be visible or not, and executes a callback function when the element appears in the viewport.

## Quick Start

### Install

> npm install @exposure-lib/core --save

Since the compatibility of the InterfaceObserver API is still not well supported on some low version browsers, you can introduce polyfill to `@exposure-lib/core` beforehand to use it normally.

> npm install @exposure-lib/polyfill --save

**Introducing the package**

```ts
import '@exposure-lib/polyfill'
import * as Exposure from '@exposure-lib/core'
```

> Note: the polyfill package must be introduced before the core package

### Usage

Using `exposure` to listen to whether an element appears in the visible area is very simple and requires only two steps.

1. First you need to create an `Exposure` to listen to the element, which is created by the `createExposure` method.

```ts
import { createExposure } from '@exposure-lib/core'
const exposure = createExposure()
```

2. Then call the `observe` method of `Exposure` to listen for the element

```ts
const el = document.getElementById('el')
exposure.observe(el, () => {
  console.log('exposure')
})
```
The `exposure.observe` method accepts at least two arguments, the first one is an element of type Element, the second one is a Handler, which is executed when the monitored element appears in the visible area, and the third one is a listening threshold (optional).


### threshold

By default, the execution of the exposure callback waits for the entire bound element to be fully wrapped before it is executed. If you have a need to expose an element when a certain percentage of it appears, the
you can set the threshold, using the following two methods.

#### Exposure threshold

Each call to the `createExposure` method to create an `Exposure` supports passing in a threshold for use by elements under the current `Exposure` scope.

```ts
const exposure = createExposure(0.2)
```

As shown in the code above, the callback function is executed when the exposure ratio of the element reaches 0.2.

#### Element threshold

If you want the exposure ratio of an element to be different from that of other elements, you can set the threshold for the element separately

```ts
const el = document.getElementById('el')
const exposure = createExposure(0.2)

exposure.observe(el, () => {
  console.log('exposure')
}, 0.8)

```

> Needs attention：Element threshold > Exposure threshold


### Handler
Handler has two types: function or object

**Function**

The function type is the more common way of writing, the function Handler will only be triggered once when the element is exposed and the `threshold` is met.

**Object**

A Handler of object type needs to have one of the `enter` and `leave` attributes, and the values of the `enter` and `leave` attributes are of function type.

- enter: enter Handler is triggered once when an element enters exposure and `threshold` is met.
- leave: the leave Handler is triggered once after the enter Handler is triggered and the element leaves the visible area completely.


### resetExposure

Exposure callbacks are executed in a single instance, which means that once an exposure has been made and the callback executed, the callback function will not be executed again. If you need to expose again, you need to call `resetExposure` to reset it.

```ts
import { resetExposure } from '@exposure-lib/core'
// reset all elements
resetExposure()
// reset el element
const el = document.getElementById('el')
resetExposure(el)
```

### unobserve

When the page is destroyed and the listener element in the current page needs to be unobserved, call the `exposure.unobserve` method to unobserve the listener element.

```ts
const el = document.getElementById('el')
const exposure = createExposure(0.2)

exposure.observe(el, () => {
  console.log('exposure')
}, 0.8)

// Page Destroy
destory(() => {
  exposure.unobserve(el)
})
```
### Cautions

exposure-lib listens to elements in strict mode, when an element's `visibility` is `hidden` or `width` is `0` or `height` is `0` it will not be listened to.
