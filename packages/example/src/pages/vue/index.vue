<template>
  <div class="container">
    <div class="block count">{{count}}</div>
    <div class="block top" v-exposure="topHandler">top</div>
    <div class="block middle" v-exposure="middleHandler">middle</div>
    <div class="block bottom" v-exposure="bottomHandler">bottom</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const topHandler = () => {
  count.value++
}

const middleHandler = {
  enter: () => {
    count.value++
  },
  leave: () => {
    count.value++
  }
}

const bottomHandler = () => {
  count.value++
}

</script>
<style>
</style>
