<template>
  <div class="history-item">
    <div class="body">
      <div class="navigation">
        <div v-if="item.CLIENT_REQUEST" @click="setActiveTab(0)">Client Request</div>
        <div v-if="item.INTERCEPT_REQUEST" @click="setActiveTab(1)">Intercept Request</div>
        <div v-if="item.INTERCEPT_RESPONSE" @click="setActiveTab(4)">Intercept Response</div>
        <div v-if="item.CLIENT_RESPONSE" @click="setActiveTab(5)">Client Response</div>
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
        <h4>Headers</h4>
        <div class="details">
          <div
            v-for="[key, val] in Object.entries(item.CLIENT_REQUEST.request.headers)"
            :key="key"
            class="item"
          >
            <strong>{{ key }}:</strong> {{ val }}
          </div>
        </div>
      </div>
      <div class="section">
        <h4>Body</h4>
        <div class="details">
          <div
            v-for="[key, val] in Object.entries(item.CLIENT_REQUEST.request.body)"
            :key="key"
            class="item"
          >
            <strong>{{ key }}:</strong> {{ val }}
          </div>
        </div>
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
// import Editor from './Editor'

export default {
  name: 'HistoryItem',
  components: {
    // Editor
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      activeTab: 0
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
