import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Exposure from '@vue-exposure/next'

createApp(App).use(store).use(router).use(Exposure).mount('#app')
