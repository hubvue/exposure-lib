import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import BaseExposure from '../pages/base-exposure.vue'
import ThresholdExposure from '../pages/threshold-exposure.vue'
import KeepaliveExposure from '../pages/keepAlive-exposure.vue'
import Home from '../pages/home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/base',
    name: 'BaseExposure',
    component: BaseExposure
  },
  {
    path: '/threshold',
    name: 'ThresholdExposure',
    component: ThresholdExposure
  },
  {
    path: '/keepalive',
    name: 'KeepaliveExposure',
    component: KeepaliveExposure
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
