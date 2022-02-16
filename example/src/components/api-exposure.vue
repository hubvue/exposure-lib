<template>
  <div class="exposure-test">
    <div
      ref="top"
      class="top"
    ></div>
    <div
      ref="middle"
      class="middle"
    ></div>
    <div
      ref="bottom"
      class="bottom"
    ></div>
  </div>
</template>

<script>
import { createExposureObserver } from '../../../dist/exposure'
export default {
  name: 'BaseExposure',
  data() {
    return {
      handler: {
        observe: null
        // enter() {
        //   alert('enter')
        // },
        // leave() {
        //   alert('leave')
        // }
      }
    }
  },
  deactivated() {
    this.$resetExposure()
  },
  created() {
    this.observe = createExposureObserver({
      context: this
    })
  },
  mounted() {
    if (this.observe) {
      this.observe(this.$refs.top, this.handlerTop)
      this.observe(this.$refs.middle, this.handlerMiddle)
    }
    console.log('refs1', this.$refs)
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
      console.log('this.handlerBottom', this.handlerBottom)
      this.observe(this.$refs.bottom, this.handlerBottom)
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
