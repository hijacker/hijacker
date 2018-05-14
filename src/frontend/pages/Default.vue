<template>
  <div id="default">
    Testing
  </div>
</template>

<script>
/**
 * Default Page
 * Dashboard for viewing/modifying/adding rules
 *
 */

import { mapGetters } from 'vuex'

import * as types from '@/store/types'

export default {
  name: 'default',
  computed: {
    ...mapGetters({
      rules: types.GET_ALL_RULES
    })
  }
}
</script>

<style lang="scss">

</style>
