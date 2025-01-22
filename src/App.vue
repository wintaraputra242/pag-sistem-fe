<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @font-face {
    font-family: Lato;
    src: url(assets/font/lato-regular.woff);
  }
  #app {
    font-family: Lato;
  }
</style>
