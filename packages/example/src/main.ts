import { createApp } from 'vue'
import App from './App.vue'
import ExposurePlugin from '../../vue/src'
import { router } from './router'

const app = createApp(App)

app.use(router)
app.use(ExposurePlugin)

app.mount('#app')
