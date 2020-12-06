import { App, VNode, DirectiveBinding } from 'vue'
const Logger = console
declare var __POLYFILL_PLACEHOLDER__: String
/**
 * @name vueExposure
 * @author wangchong
 * @description Vue-based directive visibility scheme that executes when a bound element appears in the viewport.
 *              Single instance and support for keepAlive.
 * @example <div v-exposure="handler"></div>
 *          Note: The handler must be a method, and the current component instance
 *                cannot have a $resetExposure attribute or method on it.
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
  threshold: number
}
interface addElToObserveType {
  (
    el: Element,
    arg: number,
    callback: (el?: Element) => void,
    context: VueType
  ): void
}

interface DirectiveHandlerType {
  (el: Element, binding: DirectiveBinding, vnode: VNode): void
}
interface InstallHandlerType {
  (_Vue: App, options?: { threshold?: number }): void
}
// Dynamic Substitution，import polyfill
__POLYFILL_PLACEHOLDER__

let Vue: typeof VueType
let GLOBAL_THERSHOLD: number
let observer: IntersectionObserver
let count = 0
const unit = 0.1
let threshold: number[] = []
while (count <= 1) {
  threshold.push(count)
  count = Number((count + unit).toFixed(2))
}

const OBSERVER_OPTIONS: ObserverOptionsType = {
  delay: 100,
  threshold: threshold,
  trackVisibility: true,
}

const elToMeta: Map<Element, ElToMetaType> = new Map()
/**
 * @description Resets the callback of a listening element to an executable state.
 *              The purpose is to be compatible with keepAlive,
 *              Bind the $resetExposure method to a Vue instance and execute it in the deactivated lifecycle.
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
// statement Merging  $resetExposure method
declare module 'vue/types/vue' {
  interface Vue {
    $resetExposure: typeof $resetExposure
  }
}
/**
 * @description Create an instance of IntersectionObserver, single instance mode.
 */
const createObserver = () => {
  if (window.IntersectionObserver && !observer) {
    observer = new window.IntersectionObserver((list, observer) => {
      for (let entry of list) {
        const { isIntersecting, target, intersectionRatio } = entry
        if (isIntersecting) {
          const config = elToMeta.get(target)
          if (
            config &&
            !config.active &&
            intersectionRatio >= config.threshold
          ) {
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
    Logger.warn('current browser does not support IntersectionObserve API')
  }
}
/**
 * @param {*} el listening element
 * @param {*} callback executable callbacks
 * @param {*} context current component instance
 * @description listens to the element and maps the element to Mate.
 */

const addElToObserve: addElToObserveType = (
  el,
  threshold,
  callback,
  context
) => {
  if (!elToMeta.has(el)) {
    elToMeta.set(el, {
      active: false,
      callback,
      context,
      threshold,
    })
    observer && observer.observe(el)
  }
}
/**
 * @param {*} el
 * @param {*} binding
 * @param {*} vnode
 * @description customize the directive bind method,
 *              bind the $resetExposure method to a Vue instance,
 *              execute addElToObserve to listen to the el.
 */

const bind: DirectiveHandlerType = (el, binding, vnode) => {
  let { value, arg } = binding
  let threshold: number
  const { context } = vnode
  if (typeof value !== 'function') {
    Logger.error('directive value is not function ')
    return
  }
  if (!context) {
    return
  }
  threshold = Number(arg)
  if ((arg && typeof arg !== 'number') || !arg) {
    arg && Logger.error('element arguments  must be number type')
    threshold = GLOBAL_THERSHOLD || 1
  }
  if (context.$resetExposure && context.$resetExposure !== $resetExposure) {
    Logger.error('context bind $resetExposure propertyKey')
    return
  }
  !context.$resetExposure && (context.$resetExposure = $resetExposure)
  addElToObserve(el, threshold, value, context)
}
/**
 *
 * @param {*} el
 * @description unsubscribe when components are destroyed
 */
const unbind: DirectiveHandlerType = (el) => {
  if (elToMeta.has(el) && observer) {
    elToMeta.delete(el)
    observer.unobserve(el)
  }
}
/**
 * @description Vue global registration of custom directives
 */
const installDirective = () => {
  Vue.directive('exposure', {
    bind,
    unbind,
  })
}
/**
 * @param {*} _Vue
 * @description the install method of the Vue plugin mechanism to create an observer, i.e. a registration directive.
 */
const install: InstallHandlerType = (_Vue, options) => {
  if (!Vue) {
    Vue = _Vue
  }
  if (options && options.threshold) {
    GLOBAL_THERSHOLD = options.threshold
  }
  createObserver()
  installDirective()
}

const Exposure = {
  install,
}

export default Exposure
