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

const exposure = createExposure(0.5)

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
</style>
