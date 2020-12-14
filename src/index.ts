import { App, VNode, DirectiveBinding, Plugin } from 'vue'
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
  threshold: number
}
interface addElToObserveType {
  (el: Element, arg: number, callback: (el?: Element) => void): void
}

interface DirectiveHandlerType {
  (el: Element, binding: DirectiveBinding, vnode: VNode): void
}
interface InstallHandlerType {
  (_Vue: App, options?: { threshold?: number }): void
}
// Dynamic Substitution，import polyfill
__POLYFILL_PLACEHOLDER__

let Vue: App
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
export const useResetExposure = function (el?: Element) {
  if (el && elToMeta.has(el)) {
    const config = elToMeta.get(el) as ElToMetaType
    elToMeta.set(el, Object.assign(config, { active: false }))
  } else {
    for (let [key, config] of elToMeta.entries()) {
      if (config.active) {
        elToMeta.set(key, Object.assign(config, { active: false }))
      }
    }
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

const addElToObserve: addElToObserveType = (el, threshold, callback) => {
  if (!elToMeta.has(el)) {
    elToMeta.set(el, {
      active: false,
      callback,
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
 *              execute addElToObserve to listen to the el.
 */

const mounted: DirectiveHandlerType = (el, binding, vnode) => {
  let { value, arg } = binding
  let threshold: number
  if (typeof value !== 'function') {
    Logger.error('directive value is not function ')
    return
  }
  threshold = Number(arg)
  if ((arg && typeof arg !== 'number') || !arg) {
    arg && Logger.error('element arguments  must be number type')
    threshold = GLOBAL_THERSHOLD || 1
  }
  addElToObserve(el, threshold, value)
}
/**
 *
 * @param {*} el
 * @description unsubscribe when components are destroyed
 */
const beforeUnmount: DirectiveHandlerType = (el) => {
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
    mounted,
    beforeUnmount,
  })
}
/**
 * @param {*} _Vue
 * @description the install method of the Vue plugin mechanism to create an observer, i.e. a registration directive.
 */
const install: InstallHandlerType = (_Vue: App, options) => {
  if (!Vue) {
    Vue = _Vue
  }
  if (options && options.threshold) {
    GLOBAL_THERSHOLD = options.threshold
  }
  createObserver()
  installDirective()
}

const Exposure: Plugin = {
  install,
}

export default Exposure
