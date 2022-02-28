import { App, VNode, DirectiveBinding, Plugin } from 'vue'

import { createExposure, resetExposure, Exposure } from '@exposure-lib/core'

export interface DirectiveHandlerType {
  (el: Element, binding: DirectiveBinding, vnode: VNode): void
}
export interface InstallHandlerType {
  (_Vue: App, options?: { threshold?: number }): void
}

let Vue: App
let exposure: Exposure
const Logger = console

/**
 * @description Resets the callback of a listening element to an executable state.
 *              The purpose is to be compatible with keepAlive,
 *              Bind the $resetExposure method to a Vue instance and execute it in the deactivated lifecycle.
 *              If the project is built with Vue 2 + composition-api, you can use useResetExposure to reset the exposure.
 */
export const useResetExposure = resetExposure

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
  if (!exposure) {
    Logger.error('exposure is not initialized, please use Vue.use(Exposure)')
    return
  }

  threshold = Number(arg)
  if ((arg && typeof arg !== 'number') || !arg) {
    arg && Logger.error('element arguments  must be number type')
    threshold = exposure.threshold
  }
  exposure.observe(el, value, threshold)
}

/**
 *
 * @param {*} el
 * @description unsubscribe when components are destroyed
 */
const beforeUnmount: DirectiveHandlerType = (el) => {
  if (!exposure) {
    Logger.error('exposure is not initialized, please use Vue.use(Exposure)')
    return
  }
  exposure.unobserve(el)
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
  let golablThreshold
  if (options && options.threshold) {
    golablThreshold = options.threshold
  }
  if (!exposure) {
    exposure = createExposure(golablThreshold)
  }
  installDirective()
}

const ExposurePLugin: Plugin = {
  install,
}

export default ExposurePLugin
