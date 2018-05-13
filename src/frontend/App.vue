<template>
  <div class="app">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'hijacker',
  data () {
    return {
      title: "Hello World"
    }
  }
}
</script>

<style lang="scss">
.app {
  background-color: red;
  color: white;
}
</style>
