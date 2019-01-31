<template>
  <div>
    <button @click="clearHistory">Clear</button>
    <HistoryItem v-for="item in items" :key="item.id" :item="item" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import * as types from '@/store/types'
import HistoryItem from '@/components/HistoryItem'

export default {
  name: 'History',
  components: {
    HistoryItem
  },
  computed: {
    ...mapGetters({
      items: types.GET_HISTORY
    })
  },
  methods: {
    ...mapMutations({
      clearHistory: types.CLEAR_HISTORY
    })
  }
}
</script>

<style lang="scss">

</style>
