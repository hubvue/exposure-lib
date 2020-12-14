<template>
  <div class="threshold-exposure">
    <div class="tip">
      For the directive parameter, when the blue box appears in the half of the entire area,
      the exposure callback will be triggered, and the value can be set.
    </div>
    <div
      class="box"
      v-exposure:[0.5]="handler"
    ></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ThresholdExposure',
  setup () {
    const handler = () => {
      alert('trigger exposure')
    }
    return {
      handler
    }
  }
})
</script>

<style scoped>
.tip {
  padding: 16px;
  background: yellowgreen;
  font-size: 15px;
  color: #666;
}
.box {
  height: 400px;
  margin-top: 1500px;
  margin-bottom: 500px;
  background-color: blue;
}
</style>
