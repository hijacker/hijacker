<template>
  <div class="app">
    <Navigation />
    <router-view />
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'

export default {
  name: 'Hijacker',
  components: {
    Navigation
  }
}
</script>

<style lang="scss">
html, body {
  font-family: 'Roboto', sans-serif;
  color: #666;
}

input {
  padding: 5px;
  font-family: 'Roboto', sans-serif;
}

select {
  padding: 5px 2px;
  font-family: 'Roboto', sans-serif;
}

.center {
  text-align: center !important;
}
</style>
