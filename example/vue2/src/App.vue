<template>
  <div id="app">
    <keep-alive :include="includeKeepAlive">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      includeKeepAlive: ['KeepaliveExposure']
    }
  }
}
</script>

<style>
</style>
