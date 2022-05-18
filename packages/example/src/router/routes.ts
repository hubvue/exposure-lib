import CoreBase from '../pages/core/index.vue'
import CoreThreshold from '../pages/core/threshold.vue'
import CoreReset from '../pages/core/reset.vue'
import CoreUnobserve from '../pages/core/unobserve.vue'


export default [
  {
    name: "CoreBase",
    path: '/core-base',
    component: CoreBase
  },
  {
    name: "CoreThreshold",
    path: '/core-threshold',
    component: CoreThreshold
  },
  {
    name: "CoreReset",
    path: '/core-reset',
    component: CoreReset
  },
  {
    name: "CoreUnobserve",
    path: '/core-unobserve',
    component: CoreUnobserve
  }
]
