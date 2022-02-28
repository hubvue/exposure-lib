import Vue from 'vue'
import App from './App.vue'
import ExposurePlugin from '@exposure-lib/vue2'
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
