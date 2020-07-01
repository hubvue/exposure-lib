import VueType, { VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
declare var __POLYFILL_PLACEHOLDER__: String
/**
 * @name vueExposure
 * @author wangchong
 * @description 基于Vue指令的可见性执行方案，当绑定元素出现在视窗内的时候，执行。单例且可支持keepAlive
 * @example <div v-exposure="handler"></div> 注：handler必须是一个方法，且当前组件实例上不能有$resetExposure属性或方法。
 */
interface ObserverOptionsType {
  delay?: number
  threshold?: number[]
  trackVisibility?: boolean
}

interface ElToMetaType {
  active: boolean
  callback: (el?: Element) => void
  context: VueType | undefined
}
interface addElToObserveType {
  (el: Element, callback: (el?: Element) => void, context: VueType): void
}

interface DirectiveHandlerType {
  (el: Element, binding: DirectiveBinding, vnode: VNode): void
}
interface InstallHandlerType {
  (_Vue: typeof VueType, options: ObserverOptionsType): void
}
// 动态替换，引入polyfill
__POLYFILL_PLACEHOLDER__

let Vue: typeof VueType
let observer: IntersectionObserver

const OBSERVER_OPTIONS: ObserverOptionsType = {
  delay: 100,
  threshold: [1],
  trackVisibility: true,
}

const elToMeta: Map<Element, ElToMetaType> = new Map()
/**
 * @description 重置监听元素的callback为可执行状态，目的是为了兼容keepAlive，将$resetExposure方法绑定到Vue实例上，
 *              在deactivated生命周期中执行。
 */
const $resetExposure = function (this: VueType, el: Element) {
  if (el && elToMeta.has(el)) {
    const config = elToMeta.get(el) as ElToMetaType
    if (config.context === this && config.active) {
      elToMeta.set(el, Object.assign(config, { active: false }))
    }
  } else {
    for (let [key, config] of elToMeta.entries()) {
      if (config.context === this && config.active) {
        elToMeta.set(key, Object.assign(config, { active: false }))
      }
    }
  }
}
// 声明合并$resetExposure函数
declare module 'vue/types/vue' {
  interface Vue {
    $resetExposure: typeof $resetExposure
  }
}
/**
 * @description 创建IntersectionObserver实例，单例。
 */
const createObserver = () => {
  if (window.IntersectionObserver && !observer) {
    observer = new window.IntersectionObserver((list, observer) => {
      for (let entry of list) {
        const { isIntersecting, target } = entry
        if (isIntersecting) {
          const config = elToMeta.get(target)
          if (config && !config.active) {
            const { visibility, height, width } = window.getComputedStyle(
              target,
              null
            )
            if (
              visibility === 'hidden' ||
              parseInt(height) === 0 ||
              parseInt(width) === 0
            ) {
              break
            }
            typeof config.callback === 'function' && config.callback(target)
            elToMeta.set(target, Object.assign(config, { active: true }))
          }
        }
      }
    }, OBSERVER_OPTIONS)
  }
  if (!observer) {
    console.warn('current browser does not support IntersectionObserve API')
  }
}
/**
 * @param {*} el 需要监听的元素
 * @param {*} callback 可执行的回调
 * @param {*} context 当前的组件实例
 * @description 监听元素，并将元素及Mate映射
 */

const addElToObserve: addElToObserveType = (el, callback, context) => {
  if (!elToMeta.has(el)) {
    elToMeta.set(el, {
      active: false,
      callback,
      context,
    })
    observer && observer.observe(el)
  }
}
/**
 * @param {*} el
 * @param {*} binding
 * @param {*} vnode
 * @description 自定义指定的bind方法， 将$resetExposure方法绑定到Vue实例上，执行addElToObserve监听el
 */

const bind: DirectiveHandlerType = (el, binding, vnode) => {
  const { value } = binding
  const { context } = vnode
  if (typeof value !== 'function') {
    console.error('directive value is not function ')
    return
  }
  if (!context) {
    return
  }
  if (context.$resetExposure && context.$resetExposure !== $resetExposure) {
    console.error('context bind $resetExposure propertyKey')
    return
  }
  !context.$resetExposure && (context.$resetExposure = $resetExposure)
  addElToObserve(el, value, context)
}
/**
 *
 * @param {*} el
 * @param {*} binding
 * @param {*} vnode
 * @description 当组件触发更新的时候，更新el映射的信息
 */
const update: DirectiveHandlerType = (el, binding, vnode) => {
  const { value } = binding
  const { context } = vnode
  if (typeof value === 'function' && elToMeta.has(el)) {
    const meta = elToMeta.get(el)
    if (!meta) {
      return
    }
    const oldCallback = meta.callback
    if (oldCallback !== value) {
      elToMeta.set(el, {
        active: false,
        callback: value,
        context,
      })
    }
  }
}
/**
 *
 * @param {*} el
 * @description 当组件销毁的时候，去订阅
 */
const unbind: DirectiveHandlerType = (el) => {
  if (elToMeta.has(el) && observer) {
    elToMeta.delete(el)
    observer.unobserve(el)
  }
}
/**
 * @description Vue全局注册自定义指令
 */
const installDirective = () => {
  Vue.directive('exposure', {
    bind,
    update,
    unbind,
  })
}
/**
 * @param {*} _Vue
 * @description Vue插件机制的install方法，创建观察者即注册指令
 */
const install: InstallHandlerType = (_Vue, options = {}) => {
  if (!Vue) {
    Vue = _Vue
  }
  Object.assign(OBSERVER_OPTIONS, options)
  createObserver()
  installDirective()
}

const Exposure = {
  install,
}

export default Exposure
