<template>
  <div class="threshold-exposure">
    <div class="tip">使用threshold必须将main.js中的注释打开，当蓝色盒子出现区域占全部区域的一半的时候就会触发曝光回调，并且值是可设置的。</div>
    <div
      class="box"
      v-exposure="handler"
    ></div>
  </div>
</template>

<script>
export default {
  name:"ThresholdExposure",
  methods: {
    handler() {
      alert('触发曝光')
    }
  }
}
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