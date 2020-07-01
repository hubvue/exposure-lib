<template>
  <div class="home">
    <p
      @click="openPage('/base')"
      class="btn"
    >基础曝光</p>
    <p
      @click="openPage('/threshold')"
      class="btn"
    >设置threshold的曝光</p>
    <p
      @click="openPage('/keepalive')"
      class="btn"
    >keep-alive的曝光</p>
  </div>
</template>

<script>
export default {
  methods: {
    openPage(path) {
      this.$router.push({
        path
      })
    }
  }
}
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