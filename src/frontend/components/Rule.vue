<template>
  <div>
    {{ rule.path }}
    <input type="checkbox" v-model="rule.disabled" />
  </div>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash'

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
      rule: cloneDeep(this.initialRule),
      lastEmitted: null
    }
  },
  watch: {
    initialRule: {
      handler(newVal) {
        if (!isEqual(this.lastEmitted, newVal)) {
          this.rule = cloneDeep(newVal)
        }
      },
      deep: true
    },
    rule: {
      handler() {
        this.lastEmitted = cloneDeep(this.rule)
        this.$emit('change', this.lastEmitted)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">

</style>
