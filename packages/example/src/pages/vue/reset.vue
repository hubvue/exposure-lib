<template>
  <div class="container">
    <div class="block count">{{count}}</div>
    <div class="block top" v-exposure="topHandler">top</div>
    <div class="block middle" v-exposure="middleHandler" ref="middleEl">middle</div>
    <div class="block bottom" v-exposure="bottomHandler">bottom</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useResetExposure } from '@exposure-lib/vue'

const count = ref(0)
const middleEl = ref<HTMLElement | undefined>()

const topHandler = () => {
  count.value++
  useResetExposure(middleEl.value)
}

const middleHandler = () => {
  count.value++
}

const bottomHandler = () => {
  count.value++
  useResetExposure()
}

</script>
<style>
</style>
