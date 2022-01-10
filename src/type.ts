import VueType, { VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'

export interface ObserverOptionsType {
  delay?: number
  threshold?: number[]
  trackVisibility?: boolean
}

export type FuncHandler = (el?: Element) => void
export type ObjectHandler = { enter: FuncHandler; leave: FuncHandler }
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
