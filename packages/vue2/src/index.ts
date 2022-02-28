import VueType, { VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
import { createExposure, resetExposure, Exposure } from '@exposure-lib/core'

interface DirectiveHandlerType {
  (el: Element, binding: DirectiveBinding, vnode: VNode): void
}
interface InstallHandlerType {
  (_Vue: typeof VueType, options?: { threshold?: number }): void
}

// statement Merging  $resetExposure method
declare module 'vue/types/vue' {
  interface Vue {
    $resetExposure: typeof useResetExposure
  }
}

let Vue: typeof VueType
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
 *              bind the $resetExposure method to a Vue instance,
 *              execute addElToObserve to listen to the el.
 */
const bind: DirectiveHandlerType = (el, binding, vnode) => {
  let { value, arg } = binding
  let threshold: number
  const { context } = vnode
  if (!context) {
    return
  }
  if (!exposure) {
    Logger.error('exposure is not initialized, please use Vue.use(Exposure)')
    return
  }
  threshold = Number(arg)
  if ((arg && typeof arg !== 'number') || !arg) {
    arg && Logger.error('element arguments  must be number type')
    threshold = exposure.threshold
  }
  if (context.$resetExposure && context.$resetExposure !== useResetExposure) {
    Logger.error('context bind $resetExposure propertyKey')
    return
  }
  !context.$resetExposure && (context.$resetExposure = useResetExposure)
  exposure.observe(el, value, threshold)
}
/**
 *
 * @param {*} el
 * @description unsubscribe when components are destroyed
 */
const unbind: DirectiveHandlerType = (el) => {
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
  let golablThreshold
  if (options && options.threshold) {
    golablThreshold = options.threshold
  }
  if (!exposure) {
    exposure = createExposure(golablThreshold)
  }
  installDirective()
}

const ExposurePLugin = {
  install,
}

export default ExposurePLugin
