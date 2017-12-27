<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style lang="scss" scoped>
  .card {
    width: 100%;
    background-color: #ffffff;
    -webkit-box-shadow: 1px 1px 1px 1px #f2f2f2;
              box-shadow: 1px 1px 1px 1px #f2f2f2;
    padding: 5px;
    border: 1px solid #e5e5e5;
    box-sizing: border-box;

    & > h2 {
      color: #3d3d3d;
      font-size: 25px;
      margin: 0;
      border-bottom: 1px solid #e5e5e5;

      & > .add-on {
        float: right;
        font-size: 16px;
        line-height: 30px;
      }
    }
  }
</style>
