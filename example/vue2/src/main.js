import Vue from 'vue'
import App from './App.vue'
// import Exposure from '../../../packages/vue2/dist/index.mjs'
import ExposurePlugin from '@exposure-lib/vue'
import router from './router/router'
Vue.config.productionTip = false

console.log('Exposure', ExposurePlugin)
Vue.use(ExposurePlugin, {
  threshold: 0.2,
})

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
