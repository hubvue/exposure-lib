<template>
  <div class="container">
    <div class="block count">{{count}}</div>
    <div class="block top" ref="topEl">top</div>
    <div class="block middle" ref="middleEl">middle</div>
    <div class="block bottom" ref="bottomEl">bottom</div>
  </div>
</template>
<script setup lang="ts">
import { createExposure } from '@exposure-lib/core'
import { ref, watch, onBeforeUnmount } from 'vue'

const exposure = createExposure()

const count = ref(0)
const topEl = ref<HTMLElement | undefined>()
const middleEl = ref<HTMLElement | undefined>()
const bottomEl = ref<HTMLElement | undefined>()

watch(topEl, (el) => {
  if (el) {
    exposure.observe(el, () => {
      count.value++
    })
  }
})

watch(middleEl, (el) => {
  if (el) {
    exposure.observe(el, () => {
      count.value++
    })
  }
})

watch(bottomEl, (el) => {
  if (el) {
    exposure.observe(el, () => {
      count.value++
    })
  }
})

onBeforeUnmount(() => {
  if (topEl.value) {
    exposure.unobserve(topEl.value)
  }
  if (middleEl.value) {
    exposure.unobserve(middleEl.value)
  }
  if (bottomEl.value) {
    exposure.unobserve(bottomEl.value)
  }
})

</script>
<style>
.container {
  height: 2000px;
  position: relative;
  padding: 0 20px;
}

.block {
  width: calc(100% - 40px);
  box-sizing: border-box;
  border-radius: 12px;
  background: yellowgreen;
  text-align: center;
  padding: 10px;
  font-size: 20px;
  color: #000;
}

.count {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  border-radius: 0;
}

.top {
  position: absolute;
  top: 400px;
  height: 100px;
}

.middle {
  position: absolute;
  top: 1000px;
  height: 100px;
}

.bottom {
  position: absolute;
  top: 2000px;
  height: 100px;
}
</style>
