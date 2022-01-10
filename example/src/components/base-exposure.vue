<template>
  <div class="exposure-test">
    <div
      class="top"
      v-exposure="handlerTop"
    ></div>
    <div
      class="middle"
      v-exposure="handler"
    ></div>
    <div
      class="bottom"
      v-exposure:[1]="handler"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'BaseExposure',
  data() {
    return {
      handler: {
        enter() {
          alert('enter')
        },
        leave() {
          alert('leave')
        }
      }
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
