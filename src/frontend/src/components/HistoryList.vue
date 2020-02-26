<template>
  <div class="history-list">
    <div
      v-for="item in history"
      :key="item.id" class="history-item"
      @click="$emit('input', item.id)"
    >
      <span>{{ item.CLIENT_REQUEST.reqTime | date }}</span>
      <span class="method">{{ item.CLIENT_REQUEST.request.method }}</span>
      <span>{{ item.CLIENT_REQUEST.request.originalUrl }}</span>
    </div>
    <div v-if="!history.length" class="no-history">
      No History
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  name: 'HistoryList',
  filters: {
    date (val) {
      return DateTime.fromMillis(val).toFormat('yyyy/MM/d HH:mm:ss')
    }
  },
  props: {
    history: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      default: undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.history-item {
  padding: 5px;
  cursor: pointer;

  &:not(:last-of-type) {
    border-bottom: 1px solid #EFF0EC;
  }

  .method {
    font-weight: bold;
    color: #3179B4;

    // TODO: Method Colors
  }
}

.history-list {
  border: 1px solid #EFF0EC;
}

.no-history {
  padding: 5px;
  text-align: center;
}
</style>
