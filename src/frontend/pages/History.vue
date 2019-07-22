<template>
  <div>
    <button @click="clearHistory">Clear</button>
    <div class="container">
      <div class="history-list">
        <HistoryList v-model="activeItemId" :history="items" />
      </div>
      <div class="active-item">
        <HistoryItem v-if="activeItem" :item="activeItem" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import * as types from '@/store/types'
import HistoryItem from '@/components/HistoryItem'
import HistoryList from '@/components/HistoryList'

export default {
  name: 'History',
  components: {
    HistoryItem,
    HistoryList
  },
  data() {
    return {
      activeItemId: undefined
    }
  },
  computed: {
    ...mapGetters({
      items: types.GET_HISTORY
    }),
    activeItem() {
      if (this.activeItemId) {
        return this.items.find(x => x.id === this.activeItemId)
      }

      return false
    }
  },
  methods: {
    ...mapMutations({
      clearHistory: types.CLEAR_HISTORY
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto;
  grid-template-areas: "list active";
  grid-column-gap: 10px;

  .history-list {
    grid-area: list;
  }

  .active-item {
    grid-area: active;
  }
}

</style>
