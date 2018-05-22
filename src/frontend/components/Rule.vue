<template>
  <div>
    {{ rule.path }}
    <input type="checkbox" v-model="rule.disabled" />
  </div>
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
  },
  watch: {
    initialRule: {
      handler() {
        // TODO: Update rule if different from initialRule
        // Update properties only if different
        console.log("TEST")
      },
      deep: true
    },
    rule: {
      handler() {
        this.$emit('change', this.rule)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">

</style>
