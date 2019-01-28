<template>
  <div>{{ item.CLIENT_REQUEST.request.originalUrl }}</div>
</template>

<script>
export default {
  name: 'HistoryItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">

</style>
