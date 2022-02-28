export type FuncHandler = (el?: Element) => void
export type ObjectHandler = { enter?: FuncHandler; leave?: FuncHandler }
export type ExposureHandler = FuncHandler | ObjectHandler

/**
 * @description determines if the value is an ObjectHandler.
 * @param value
 * @returns
 */
export const isObjectHandler = (value: any): value is ObjectHandler => {
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

/**
 * @description determine if an element is visible or not
 * @param el Element
 * @returns boolean
 */
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

/**
 * @description generate an array of element exposure thresholds
 * @param count number
 * @param unit number
 * @returns number[]
 */
export const genThreshold = (count = 0, unit = 0.1) => {
  let threshold: number[] = []
  while (count <= 1) {
    threshold.push(count)
    count = Number((count + unit).toFixed(2))
  }
  return threshold
}
