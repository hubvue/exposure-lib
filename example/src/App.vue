<template>
  <div id="app">
      <router-view v-slot="{ Component }">
        <keep-alive include="KeepaliveExposure">
          <component :is="Component" />
        </keep-alive>
      </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App'
})
</script>
<style>
</style>
