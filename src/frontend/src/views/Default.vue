<template>
  <div id="default">
    <Rule
      v-for="rule in rules"
      :key="rule.id"
      :initial-rule="rule"
      @change="updateRule"
    />
  </div>
</template>

<script>
/**
 * Default Page
 * Dashboard for viewing/modifying/adding rules
 *
 */

import { mapGetters, mapMutations } from 'vuex'

import * as types from '@/store/types'
import Rule from '@/components/Rule'

export default {
  name: 'Default',
  components: {
    Rule
  },
  computed: {
    ...mapGetters({
      rules: types.GET_RULES
    })
  },
  methods: {
    ...mapMutations({
      updateRule: types.UPDATE_RULE
    })
  }
}
</script>

<style lang="scss">

</style>
