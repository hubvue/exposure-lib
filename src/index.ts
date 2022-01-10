import { App, Plugin } from 'vue'
import {
  DirectiveHandlerType,
  ElToMetaType,
  ExposureHandler,
  InstallHandlerType,
  ObserverOptionsType,
} from './type'
import {
  isExposureHandler,
  isFuncHandler,
  isObjectHandler,
  isVisibleElement,
} from './util'
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
  handler: ExposureHandler
) => {
  if (!elToMeta.has(el)) {
    elToMeta.set(el, {
      active: {
        enter: false,
        leave: false,
      },
      handler,
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
