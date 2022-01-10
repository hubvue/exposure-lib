import { App, VNode, DirectiveBinding } from 'vue'

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
  threshold: number
}

export interface DirectiveHandlerType {
  (el: Element, binding: DirectiveBinding, vnode: VNode): void
}
export interface InstallHandlerType {
  (_Vue: App, options?: { threshold?: number }): void
}
