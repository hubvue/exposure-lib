<template>
  <div class="exposure-test">
    <div class="top" v-exposure="handlerTop" ></div>
    <div class="middle" v-exposure="handlerMiddle" ></div>
    <div class="bottom" v-exposure="handlerBottom" ></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BaseExposure',
  setup () {
    const handlerTop = () => {
      alert('top')
    }
    const handlerMiddle = () => {
      alert('middle')
    }
    const handlerBottom = () => {
      alert('bottom')
    }

    return {
      handlerTop,
      handlerMiddle,
      handlerBottom
    }
  }
})
</script>

<style scoped>
div {
  height: 100px;
}
.top {
  background-color: red;
  margin-bottom: 1000px;
}
.middle {
  background-color: yellowgreen;
}
.bottom {
  background-color: blue;
  margin-top: 1000px;
}
</style>
