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

export interface Exposure {
  threshold: number
  observe(el: Element, handler: ExposureHandler, threshold?: number): void
  unobserve(el: Element): void
}

const Logger = console
let Observer: IntersectionObserver | null
export const elementContextMap = new Map<Element, ElementContext>()

/**
 * @description resets the callback of a listening element to an executable state.
 * @param el? Element
 */
export const resetExposure = (el?: Element) => {
  if (el && elementContextMap.has(el)) {
    const context = elementContextMap.get(el)
    if (context) {
      context.active.enter = false
      context.active.leave = false
      elementContextMap.set(el, context)
    }
  } else {
    for (let [el, context] of elementContextMap.entries()) {
      context.active.enter = false
      context.active.leave = false
      elementContextMap.set(el, context)
    }
  }
}

/**
 * @description create exposure instance
 * @param threshold? number
 * @returns Exposure
 */
export const createExposure = (golablThreshold = 1): Exposure => {
  if (!Observer) {
    Observer = createObserver()
  }
  if (!Observer) {
    Logger.warn(
      '[WARN]:current browser does not support IntersectionObserve API'
    )
  }
  function observe(el: Element, handler: ExposureHandler, threshold?: number) {
    if (!isExposureHandler(handler)) {
      Logger.error(
        `[ERROR]: handler is not ExposureHandler. 
         ExposureHandler type:
          - function: (el?: Element) => void
          - object: {enter?: (el?: Element) => void, leave?: (el?: Element) => void}
         `
      )
      return
    }
    if (!Observer) {
      Logger.warn('[WRAN]: IntersectionObserver not initialised')
      return
    }
    let th = threshold
    if (!th) {
      th = golablThreshold
    }
    if (!elementContextMap.has(el)) {
      elementContextMap.set(el, {
        active: {
          enter: false,
          leave: false,
        },
        handler,
        threshold: th,
      })
      Observer.observe(el)
    }
  }
  function unobserve(el: Element) {
    if (elementContextMap.has(el) && Observer) {
      elementContextMap.delete(el)
      Observer.unobserve(el)
    }
  }
  return {
    threshold: golablThreshold,
    observe,
    unobserve,
  }
}
