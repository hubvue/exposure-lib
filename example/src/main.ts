import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Exposure from '../../dist/exposure'

createApp(App).use(store).use(router).mount('#app')
