<template>
  <div>{{ rule.path }}</div>
</template>

<script>

export default {
  name: 'rule',
  props: {
    initialRule: {
      type: Object,
      required: true,
      validator(value) {
        return value.hasOwnProperty('path')
      }
    }
  },
  data() {
    return {
      open: false,
      // TODO: Deep clone
      rule: {
        ...this.initialRule
      }
    }
  }
}
</script>

<style lang="scss">

</style>
