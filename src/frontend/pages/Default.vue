<template>
  <div id="default">
    <rule
      v-for="rule in rules"
      :initial-rule="rule"
      :key="rule.id"
      @change="updateRule">
    </rule>
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
  name: 'default',
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
