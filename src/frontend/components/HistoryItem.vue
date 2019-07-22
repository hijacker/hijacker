<template>
  <div class="history-item">
    <div class="path">{{ item.CLIENT_REQUEST.request.originalUrl }}</div>
    <div class="body">
      <div class="navigation">
        <span v-if="item.CLIENT_REQUEST" @click="activeTab = 0">Client Request</span>
        <span v-if="item.INTERCEPT_REQUEST" @click="activeTab = 1">Intercept Request</span>
        <span v-if="item.INTERCEPT_RESPONSE" @click="activeTab = 4">Intercept Response</span>
        <span v-if="item.CLIENT_RESPONSE" @click="activeTab = 5">Client Response</span>
      </div>
      <div v-if="activeTab === 0">
        <Editor :value="formatJson(item.CLIENT_REQUEST)" :read-only="true" />
      </div>
      <div v-if="activeTab === 1">
        <Editor v-model="interceptReq" :read-only="item.intReqDone" />
        <button v-if="!item.intReqDone" @click="completeReqInt(item)">Continue</button>
      </div>
      <div v-if="activeTab === 4">
        <Editor v-model="interceptRes" :read-only="item.intResDone" />
        <button v-if="!item.intResDone" @click="completeResInt(item)">Continue</button>
      </div>
      <div v-if="activeTab === 5">
        <Editor :value="formatJson(item.CLIENT_RESPONSE)" :read-only="true" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import * as types from '@/store/types'
import Editor from './Editor'

export default {
  name: 'HistoryItem',
  components: {
    Editor
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTab: 0
    }
  },
  computed: {
    interceptReq: {
      get() {
        return this.formatJson(this.item.INTERCEPT_REQUEST)
      },
      set(val) {
        try {
          this.addHistoryItem({
            stage: 'INTERCEPT_REQUEST',
            item: JSON.parse(val)
          })
        } catch (e) {
          // Invalid data in editor, do nothing
        }
      }
    },

    interceptRes: {
      get() {
        return this.formatJson(this.item.INTERCEPT_RESPONSE)
      },
      set(val) {
        try {
          this.addHistoryItem({
            stage: 'INTERCEPT_RESPONSE',
            item: JSON.parse(val)
          })
        } catch (e) {
          // Invalid data in editor, do nothing
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      completeReqInt: types.COMPLETE_REQ_INTERCEPT,
      completeResInt: types.COMPLETE_RES_INTERCEPT,
      addHistoryItem: types.ADD_HISTORY_ITEM
    }),
    formatJson(val) {
      return JSON.stringify(val, null, 2)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
