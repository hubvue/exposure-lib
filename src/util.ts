import { ExposureHandler, FuncHandler, ObjectHandler } from './type'

/**
 * @description determines if the value is an ObjectHandler.
 * @param value
 * @returns
 */
export const isObjectHandler = (value: any): value is ObjectHandler => {
  if (
    value &&
    typeof value === 'object' &&
    typeof value.enter === 'function' &&
    typeof value.leave === 'function'
  ) {
    return true
  }
  return false
}

/**
 * @description determines if the value is a FunctionHandler.
 * @param value
 * @returns
 */
export const isFuncHandler = (value: any): value is FuncHandler => {
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
export const isExposureHandler = (value: any): value is ExposureHandler => {
  return isObjectHandler(value) || isFuncHandler(value)
}

export const isVisibleElement = (el: Element) => {
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
