<template>
  <div id="app">
    <div class="header"></div>
    <div class="sidebar"></div>
    <div class="content">
      <div class="main container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
  @import '../../node_modules/vuetify/dist/vuetify.min.css';

  @import './scss/globals';

  body {
    background-color: #F5F6FA;
  }

  .header {
    width: 100%;
    height: 80px;
    background-color: #3d3d3d;
    -webkit-box-shadow: 0 5px 5px 0px #f2f2f2;
              box-shadow: 0 5px 5px 0px #f2f2f2;
  }

  .sidebar {
    position: fixed;
    top: 80px;
    bottom: 0;
    width: 200px;
    background-color: #ffffff;
    -webkit-box-shadow: 5px 0 5px -2px #f2f2f2;
              box-shadow: 5px 0 5px -2px #f2f2f2;
  }

  .content {
    margin-left: 200px;
  }

  .main {
    max-width: 1000px;
    width: 90%;
  }

  .row {
    margin-top: 10px;
  }
</style>
