<template>
  <div class="keepalive-exposure">
    <p @click="openPage" class="btn" >open base-exposure page</p>
    <p class="tip">
      The execution of the exposure callback is singleton, that is it will not be executed after it is executed once.
      When there is a keep-alive page in the project, after the exposure callback is executed,
      the page will not be executed after the page is switched back and the data will be lost,
      so you need to use the useResetExposure method to reset the exposure during the onDeactivated life cycle.
    </p>
    <div class="box" ref="box" v-exposure="handler1" ></div>
    <div class="box1" v-exposure="handler2"></div>
  </div>
</template>

<script>
import { defineComponent, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { useResetExposure } from '@vue-exposure/next'
export default defineComponent({
  name: 'KeepaliveExposure',
  setup (props, context) {
    console.log('props', props, context)
    onDeactivated(() => {
      useResetExposure()
    })
    const router = useRouter()
    const openPage = () => {
      console.log('router', router)
      router.push({
        path: '/base'
      })
    }

    const handler1 = () => {
      alert('first box trigger exposure')
    }

    const handler2 = () => {
      alert('second box trigger exposure')
    }

    return {
      openPage,
      handler1,
      handler2
    }
  }
})
</script>

<style scope>
.tip {
  padding: 16px;
  background: yellowgreen;
  font-size: 15px;
  color: #666;
}
.btn {
  width: 100%;
  height: 36px;
  background-color: yellowgreen;
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  text-align: center;
  line-height: 36px;
}
.box {
  height: 200px;
  background-color: blue;
  margin-top: 1000px;
  margin-bottom: 500px;
}
.box1 {
  height: 200px;
  background-color: green;
  margin-top: 1000px;
  margin-bottom: 500px;
}
</style>
