<template>
  <div id="app">
    <keep-alive :include="includeKeepAlive">
      <router-view />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  setup () {
    const includeKeepAlive = ref('KeepaliveExposure')
    return {
      includeKeepAlive
    }
  }
})
</script>

<style>
</style>
