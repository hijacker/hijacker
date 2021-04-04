<template>
  <div class="history-item">
    <div class="body">
      <div class="navigation">
        <RequestPath :items="tabs" @item-click="setActiveTab" />
      </div>
      <div class="section">
        <h3>General</h3>
        <div class="details">
          <div class="item">
            Date: {{ item.CLIENT_REQUEST.reqTime }}
          </div>
          <div class="item">
            Path: {{ item.CLIENT_REQUEST.request.originalUrl }}
          </div>
          <div class="item">
            Method: {{ item.CLIENT_REQUEST.request.method }}
          </div>
        </div>
      </div>
      <div class="section">
        <ObjectDisplay title="Headers" :item="item.CLIENT_REQUEST.request.headers" />
      </div>
      <div class="section">
        <ObjectDisplay title="Body" :item="item.CLIENT_REQUEST.request.body" />
      </div>
      <!-- <div v-if="activeTab === 0">
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
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import * as types from '@/store/types'

import RequestPath from './RequestPath'
import ObjectDisplay from './ObjectDisplay'

export default {
  name: 'HistoryItem',
  components: {
    RequestPath,
    ObjectDisplay
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      activeTab: 0,
      showHeaders: false,
      tabs: [
        { text: "Client Request", value: 0 },
        { text: "Intercept Request", value: 1 },
        { text: "Intercept Response", value: 2 },
        { text: "Client Response", value: 3 }
      ]
    }
  },
  computed: {
    interceptReq: {
      get () {
        return this.formatJson(this.item.INTERCEPT_REQUEST)
      },
      set (val) {
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
      get () {
        return this.formatJson(this.item.INTERCEPT_RESPONSE)
      },
      set (val) {
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
    formatJson (val) {
      return JSON.stringify(val, null, 2)
    },
    setActiveTab (tab) {
      this.activeTab = tab
    }
  }
}
</script>

<style lang="scss" scoped>
  h3, h4 {
    margin: 5px 0;
  }

  h4 {
    opacity: 0.8;
  }
</style>
