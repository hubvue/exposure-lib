<template>
  <div class="exposure-test">
    <div
      class="top"
      v-exposure:[0.1]="handlerTop"
    ></div>
    <div
      class="middle"
      v-exposure:aaa="handlerMiddle"
    ></div>
    <div
      class="bottom"
      v-exposure="handlerBottom"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'BaseExposure',
  data() {
    return {
      a: 123,
    }
  },
  deactivated() {
    this.$resetExposure()
  },
  methods: {
    handlerMiddle() {
      alert('middle')
    },
    handlerBottom() {
      alert('bottom')
    },
    handlerTop() {
      alert('top')
    },
  },
}
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
