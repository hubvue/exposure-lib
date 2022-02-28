import { createObserver } from './observer'
import { ExposureHandler, isExposureHandler } from './utils'

interface ElementContext {
  active: {
    enter: boolean
    leave: boolean
  }
  handler: ExposureHandler
  threshold: number
}

interface Exposure {
  threshold: number
  observe(el: Element, handler: ExposureHandler): void
}

const Logger = console
let IntersectionObserver: IntersectionObserver
export const elementContextMap = new Map<Element, ElementContext>()

/**
 * @description resets the callback of a listening element to an executable state.
 * @param el? Element
 */
export const resetExposure = (el?: Element) => {
  const resetActiveContext = {
    active: {
      enter: false,
      leave: false,
    },
  }
  if (el && elementContextMap.has(el)) {
    const context = elementContextMap.get(el)
    elementContextMap.set(el, Object.assign(context, resetActiveContext))
  } else {
    for (let [el, context] of elementContextMap.entries()) {
      elementContextMap.set(el, Object.assign(context, resetActiveContext))
    }
  }
}

/**
 * @description create exposure instance
 * @param threshold? number
 * @returns Exposure
 */
export const createExposure = (golablThreshold = 1): Exposure => {
  if (!IntersectionObserver) {
    IntersectionObserver = createObserver()
  }
  if (!IntersectionObserver) {
    Logger.warn('current browser does not support IntersectionObserve API')
  }
  function observe(el: Element, handler: ExposureHandler, threshold?: number) {
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
    if (!IntersectionObserver) {
      return
    }
    const th = typeof threshold === undefined ? golablThreshold : threshold
    if (!elementContextMap.has(el)) {
      elementContextMap.set(el, {
        active: {
          enter: false,
          leave: false,
        },
        handler,
        threshold: th,
      })
      IntersectionObserver.observe(el)
    }
  }
  return {
    threshold: golablThreshold,
    observe,
  }
}
