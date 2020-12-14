<template>
  <div class="home">
    <p @click="openPage('/base')" class="btn" >基础曝光</p>
    <p @click="openPage('/threshold')" class="btn" >设置threshold的曝光</p>
    <p @click="openPage('/keepalive')" class="btn" >keep-alive的曝光</p>
  </div>
</template>

<script lang="ts" >
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const router = useRouter()
    const openPage = function (path: string) {
      console.log('router', router)
      router.push({ path })
    }
    return {
      openPage
    }
  }
})
</script>

<style scoped>
.btn {
  width: 100%;
  height: 36px;
  background-color: yellowgreen;
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  text-align: center;
  line-height: 36px;
}
</style>
