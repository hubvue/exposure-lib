import Router from 'vue-router'
import Vue from 'vue'
import BaseExposure from '../components/base-exposure'
import ThresholdExposure from '../components/threshold-exposure'
import KeepaliveExposure from '../components/keepAlive-exposure'
import ApiExposure from '../components/api-exposure'
import Home from '../components/home'
Vue.use(Router)
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/base',
    name: 'BaseExposure',
    component: BaseExposure,
  },
  {
    path: '/api',
    name: 'ApiExposure',
    component: ApiExposure
  },
  {
    path: '/threshold',
    name: 'ThresholdExposure',
    component: ThresholdExposure,
  },
  {
    path: '/keepalive',
    name: 'KeepaliveExposure',
    component: KeepaliveExposure,
  },
]

const router = new Router({
  routes,
})

export default router
