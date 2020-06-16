import VueType from 'vue';
/**
 * @name vueExposure
 * @author wangchong
 * @description 基于Vue指令的可见性执行方案，当绑定元素出现在视窗内的时候，执行。单例且可支持keepAlive
 * @example <div v-exposure="handler"></div> 注：handler必须是一个方法，且当前组件实例上不能有$resetExposure属性或方法。
 */
interface ObserverOptionsType {
    delay?: number;
    threshold?: number[];
    trackVisibility?: boolean;
}
interface InstallHandlerType {
    (_Vue: typeof VueType, options: ObserverOptionsType): void;
}
/**
 * @description 重置监听元素的callback为可执行状态，目的是为了兼容keepAlive，将$resetExposure方法绑定到Vue实例上，
 *              在deactivated生命周期中执行。
 */
declare const $resetExposure: (this: Vue) => void;
declare module 'vue/types/vue' {
    interface Vue {
        $resetExposure: typeof $resetExposure;
    }
}
declare const Exposure: {
    install: InstallHandlerType;
};
export default Exposure;
