import VueType, { VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'

export interface ObserverOptionsType {
  delay?: number
  threshold?: number[]
  trackVisibility?: boolean
}

export type FuncHandler = (el?: Element) => void
export type ObjectHandler = { enter?: FuncHandler; leave?: FuncHandler }
export type ExposureHandler = FuncHandler | ObjectHandler

export interface ElToMetaType {
  active: {
    enter: boolean
    leave: boolean
  }
  handler: ExposureHandler
  context: VueType | undefined
  threshold: number
}

export interface DirectiveHandlerType {
  (el: Element, binding: DirectiveBinding, vnode: VNode): void
}
export interface InstallHandlerType {
  (_Vue: typeof VueType, options?: { threshold?: number }): void
}

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
 * @description determines if the value is an ObjectHandler.
 * @param value
 * @returns
 */
const isObjectHandler = (value: any): value is ObjectHandler => {
  if (!value || typeof value !== 'object') {
    return false
  }
  if (!value.enter && !value.leave) {
    return false
  }
  if (value.enter && typeof value.enter !== 'function') {
    return false
  }
  if (value.leave && typeof value.leave !== 'function') {
    return false
  }

  return true
}

/**
 * @description determines if the value is a FunctionHandler.
 * @param value
 * @returns
 */
const isFuncHandler = (value: any): value is FuncHandler => {
  if (typeof value === 'function') {
    return true
  }
  return false
}

/**
 * @description determines if the value is an ExposureHandler.
 * @param value
 * @returns
 */
const isExposureHandler = (value: any): value is ExposureHandler => {
  return isObjectHandler(value) || isFuncHandler(value)
}

const isVisibleElement = (el: Element) => {
  const { visibility, height, width } = window.getComputedStyle(el, null)
  if (
    visibility === 'hidden' ||
    parseInt(height) === 0 ||
    parseInt(width) === 0
  ) {
    return false
  }
  return true
}

/**
 * @description Resets the callback of a listening element to an executable state.
 *              The purpose is to be compatible with keepAlive,
 *              Bind the $resetExposure method to a Vue instance and execute it in the deactivated lifecycle.
 *              If the project is built with Vue 2 + composition-api, you can use useResetExposure to reset the exposure.
 */
export const useResetExposure = function (el: Element) {
  if (el && elToMeta.has(el)) {
    const config = elToMeta.get(el) as ElToMetaType
    elToMeta.set(
      el,
      Object.assign(config, {
        active: {
          enter: false,
          leave: false,
        },
      })
    )
  } else {
    for (let [key, config] of elToMeta.entries()) {
      elToMeta.set(
        key,
        Object.assign(config, { active: { enter: false, leave: false } })
      )
    }
  }
}
// statement Merging  $resetExposure method
declare module 'vue/types/vue' {
  interface Vue {
    $resetExposure: typeof useResetExposure
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
        const config = elToMeta.get(target)
        if (config) {
          // Skip when handler is a function and callback has been triggered
          if (isFuncHandler(config.handler) && config.active.enter) {
            break
          }
          // Skip when handler is a object and callback has been triggered
          if (
            isObjectHandler(config.handler) &&
            config.active.enter &&
            config.active.leave
          ) {
            break
          }
          if (!isVisibleElement(target)) {
            break
          }
          if (
            isIntersecting &&
            !config.active.enter &&
            intersectionRatio >= config.threshold
          ) {
            if (isFuncHandler(config.handler)) {
              config.handler(target)
            } else {
              config.handler.enter && config.handler.enter(target)
            }
            config.active.enter = true
          } else {
            if (
              isObjectHandler(config.handler) &&
              !config.active.leave &&
              config.active.enter &&
              intersectionRatio <= 0
            ) {
              config.handler.leave && config.handler.leave(target)
              config.active.leave = true
            }
          }
          elToMeta.set(target, config)
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

const addElToObserve = (
  el: Element,
  threshold: number,
  handler: ExposureHandler,
  context: VueType
) => {
  if (!elToMeta.has(el)) {
    elToMeta.set(el, {
      active: {
        enter: false,
        leave: false,
      },
      handler,
      context,
      threshold,
    })
    observer && observer.observe(el)
  }
}
interface ObserveOption {
  context: VueType
  threshold?: number
}
/**
 * @description Create Observer to listen to element exposure by means of API
 * @param option ObserveOption
 * @returns observe(el: Element, handler: ExposureHandler): void
 */
export const createExposureObserver = (option: ObserveOption) => {
  const threshold = option.threshold || GLOBAL_THERSHOLD

  return function observe(el: Element, handler: ExposureHandler) {
    if (!isExposureHandler(handler)) {
      Logger.error(
        `handler is not ExposureHandler. 
         ExposureHandler type:
          - function: (el?: Element) => void
          - object: {enter?: (el?: Element) => void, leave?: (el?: Element) => void}
         `
      )
      return
    }
    if (!elToMeta.has(el)) {
      elToMeta.set(el, {
        active: {
          enter: false,
          leave: false,
        },
        context: option.context,
        handler,
        threshold,
      })
      observer && observer.observe(el)
    }
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
  if (!isExposureHandler(value)) {
    Logger.error(
      `directive value is not ExposureHandler. 
       ExposureHandler type:
        - function: (el?: Element) => void
        - object: {enter?: (el?: Element) => void, leave?: (el?: Element) => void}
       `
    )
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
  if (context.$resetExposure && context.$resetExposure !== useResetExposure) {
    Logger.error('context bind $resetExposure propertyKey')
    return
  }
  !context.$resetExposure && (context.$resetExposure = useResetExposure)
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
