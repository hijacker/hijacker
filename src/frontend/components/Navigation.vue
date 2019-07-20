<template>
  <div class="navigation">
    <router-link :to="{ name: 'home' }">Home</router-link>
    <router-link :to="{ name: 'history' }">History</router-link>
  </div>
</template>

<script>
export default {
  name: 'Navigation'
}
</script>

<style lang="scss" scoped>

</style>
