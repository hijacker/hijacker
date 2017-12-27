<template>
  <div class="rule" :class="[rule.method ? rule.method.toLowerCase() : '', { 'disabled': rule.disabled }]">
    <span class="method">{{ rule.method || 'ALL' }}</span>
    <span class="path" @click="toggle">{{ rule.name ? `${rule.name} - ` : '' }} {{ rule.path }}</span>
    <div class="collapse" v-show="open">
      <div class="tabs">
        <span class="tab" @click="tab = 0" :class="{ 'active': tab === 0 }">Editor</span>
        <span class="tab" @click="tab = 1" :class="{ 'active': tab === 1 }">Source</span>
      </div>
      <div v-if="tab === 0">
        <div class="category">Quick Settings</div>
        <div class="row">
          <div class="two columns">
            <input type="checkbox" :checked="rule.disabled" @click="toggleRuleDisabled" /> Disabled
          </div>
          <div class="two columns">
            <input type="checkbox" :checked="rule.skipApi" @click="toggleRuleSkipApi" /> Skip API
          </div>
          <div class="three columns">
            <input type="checkbox" :checked="rule.interceptRequest" @click="toggleRuleIntReq" /> Intercept Request
          </div>
          <div class="four columns">
            <input type="checkbox" :checked="rule.interceptResponse" @click="toggleRuleIntRes" /> Intercept Response
          </div>
        </div>
        <div class="category">Response</div>
        <div class="item" v-if="rule.status">
          <div class="item-title">Status</div>
          <div class="item-content json">{{ rule.status }}</div>
        </div>
        <div class="item" v-if="rule.body">
          <div class="item-title">Body</div>
          <JSONEditor :json="rule.body" @change="updateRuleBody" class="item-content"></JSONEditor>
        </div>
        <div class="category">Parameters</div>
      </div>
      <div v-if="tab === 1">
        <JSONEditor :json="rule" @change="updateRule" class="source"></JSONEditor>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '../store/types'

import JSONEditor from './JSONEditor.vue'

export default {
  name: 'Rule',
  props: {
    rule: {
      type: Object,
      required: true,
      validator(value) {
        return value.hasOwnProperty('path')
      }
    }
  },
  components: {
    JSONEditor
  },
  data() {
    return {
      open: false,
      tab: 0
    }
  },
  methods: {
    updateRule(val) {
      this.$store.commit(types.UPDATE_RULE, val)
    },

    updateRuleBody(val) {
      this.$store.commit(types.UPDATE_RULE, {
        ...this.rule,
        body: val
      })
    },

    toggleRuleDisabled() {
      this.$store.commit(types.UPDATE_RULE, {
        ...this.rule,
        disabled: !this.rule.disabled
      })
    },

    toggleRuleSkipApi() {
      this.$store.commit(types.UPDATE_RULE, {
        ...this.rule,
        skipApi: !this.rule.skipApi
      })
    },

    toggleRuleIntReq() {
      this.$store.commit(types.UPDATE_RULE, {
        ...this.rule,
        interceptRequest: !this.rule.interceptRequest
      })
    },

    toggleRuleIntRes() {
      this.$store.commit(types.UPDATE_RULE, {
        ...this.rule,
        interceptResponse: !this.rule.interceptResponse
      })
    },

    toggle() {
      this.open = !this.open
    }
  }
}
</script>

<style lang="scss" scoped>
  .rule {
    width: 100%;
    margin: 5px 0;
    padding: 5px;
    background-color: #ebf3fb;
    border: 1px solid #61affe;
    box-sizing: border-box;

    & > .method {
      text-align: center;
      display: inline-block;
      background-color: #61affe;
      padding: 3px 3px;
      width: 75px;
      box-sizing: border-box;
      color: #ffffff;
      font-weight: 600;
    }

    & > .path {
      color: #3d3d3d;
      font-weight: 600;
      margin-left: 5px;
    }

    .tab {
      background-color: #61affe;
    }

    & > .collapse {
      overflow-y: hidden;

      -webkit-transition: max-height 0.5s ease-in-out;
      -moz-transition: max-height 0.5s ease-in-out;
      -o-transition: max-height 0.5s ease-in-out;
      transition: max-height 0.5s ease-in-out;

      &.opened {
        -webkit-transition: max-height 0.5s ease-in-out;
        -moz-transition: max-height 0.5s ease-in-out;
        -o-transition: max-height 0.5s ease-in-out;
        transition: max-height 0.5s ease-in-out;
      }

      & > .tabs {
        margin: 10px 0;
        cursor: default;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;

        -o-user-select: none;
        user-select: none;

        .tab {
          cursor: pointer;
          color: #ffffff;
          padding: 5px 10px;
          opacity: .5;


          &.active {
            opacity: 1;
          }
        }
      }

      .category {
        background-color: rgba(255, 255, 255, .7);
        padding: 5px;
        margin: 5px 0;
      }

      .category:last-child {
        margin-bottom: 0;
      }

      .source {
        margin-top: 5px;
      }
    }

    &.get {
      background-color: #e8f6f0;
      border-color: #49cc90;

      & > .method, .tab {
        background-color: #49cc90;
      }
    }

    &.post {
      background-color: #fbf1e6;
      border-color: #fca130;

      & > .method, .tab {
        background-color: #fca130;
      }
    }

    &.put {
      background-color: #f4e7fd;
      border-color: #b346ff;

      & > .method, .tab {
        background-color: #b346ff;
      }

    }

    &.patch {
      background-color: #fddef5;
      border-color: #ff4dd1;

      & > .method, .tab {
        background-color: #ff4dd1;
      }
    }

    &.delete {
      background-color: #fbe7e7;
      border-color: #f93e3e;

      & > .method, .tab {
        background-color: #f93e3e;
      }
    }

    &.disabled {
      background-color: #f9f9f9;
      border-color: #f0f0f0;

      & > .method, .tab {
        background-color: #f0f0f0;
      }

      & > .path {
        color: #828590;
        text-decoration: line-through;
      }
    }
  }

  .item {
    overflow-y: hidden;
  }

  .item-title {
    width: 50%;
    font-weight: 600;
    display: inline-block;
  }

  .item-content {
    width: 50%;
    float: right;
    display: inline-block;

    &.json {
      font-family: monospace;
      white-space: pre-wrap;
    }
  }

</style>
