<template>
  <div class="keepalive-exposure">
    <p
      @click="openPage"
      class="btn"
    >跳转进入基础曝光</p>
    <p class="tip">曝光回调的执行是单例的，也就是当执行过一次之后就不会再执行。当项目中如果有keep-alive的页面的时候，曝光回调执行之后切换页面再回来就不会执行，这样就会丢失数据，所以需要在deactivated声明周期中使用$resetExposure方法来重置曝光。</p>
    <div
      class="box"
      ref="box"
      v-exposure="handler"
    ></div>
    <div
      class="box1"
      v-exposure="handler1"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'KeepaliveExposure',
  methods: {
    openPage() {
      this.$router.push({
        path: '/base'
      })
    },
    handler() {
      alert('第一个盒子执行曝光')
    },
    handler1() {
      alert('第二个盒子执行曝光')

    }
  },
  deactivated() {
    // this.$resetExposure(this.$refs.box)
    this.$resetExposure()
  }
}
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