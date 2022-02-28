import { elementContextMap } from './exposure'
import {
  genThreshold,
  isFuncHandler,
  isObjectHandler,
  isVisibleElement,
} from './utils'

interface ObserverOptions {
  delay?: number
  threshold?: number[]
  trackVisibility?: boolean
}

const OBSERVER_OPTIONS: ObserverOptions = {
  delay: 100,
  threshold: genThreshold(),
  trackVisibility: true,
}

/**
 * @description create an instance of IntersectionObserver, single instance mode.
 */
export const createObserver = () => {
  if (!window.IntersectionObserver) {
    return null
  }
  const intersectionObserver = new window.IntersectionObserver((list) => {
    for (let entry of list) {
      const { isIntersecting, target, intersectionRatio } = entry
      const config = elementContextMap.get(target)
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
        elementContextMap.set(target, config)
      }
    }
  }, OBSERVER_OPTIONS)

  return intersectionObserver
}
