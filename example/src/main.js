import Vue from 'vue'
import App from './App.vue'
// import Exposure from '../../dist/exposure'
import Exposure from 'vue-exposure/dist/exposure-polyfill'
import router from './router/router'
Vue.config.productionTip = false

Vue.use(Exposure, {
  // threshold: [0.5],
})

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
