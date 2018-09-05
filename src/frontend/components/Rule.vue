<template>
  <div class="rule">
    <div class="header" @click="open = !open">
      <span>{{ rule.method || 'ALL' }}</span>
      <span>{{ rule.path }}</span>
      <input type="checkbox" v-model="rule.disabled" @click.stop />
    </div>
    <transition name="slide">
      <div class="body" v-if="open">
        <div class="navigation">
          <span @click="activeTab = 0">General</span>
          <span @click="activeTab = 1">Request</span>
          <span @click="activeTab = 2">Response</span>
          <span @click="activeTab = 3">Source</span>
        </div>
        <div class="content">
          <!-- General Tab -->
          <template v-if="activeTab === 0">
            <div>
              <label>
                Path
                <input v-model="rule.path" type="text" />
              </label>
              <label>
                Method
                <select v-model="selectedMethod">
                  <option v-for="method in methods">{{ method }}</option>
                </select>
              </label>
              <label>
                Status Code
                <input v-model.number="rule.statusCode" type="number" />
              </label>
              <label>
                Syntax Highlighting
                <select v-model="selectedSyntax">
                  <option v-for="syntax in syntaxTypes">{{ syntax }}</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" v-model="rule.skipApi" />
                Skip API
              </label>
              <label>
                <input type="checkbox" v-model="rule.interceptRequest" />
                Intercept Request
              </label>
              <label>
                <input type="checkbox" v-model="rule.interceptResponse" />
                Intercept Response
              </label>
            </div>
          </template>

          <!-- Source Tab -->
          <AceEditor v-if="activeTab === 3" v-model="editorSource" lang="json" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash'

import AceEditor from './AceEditor'

export default {
  name: 'rule',
  components: {
    AceEditor
  },
  props: {
    initialRule: {
      type: Object,
      required: true,
      validator(value) {
        return value.hasOwnProperty('path')
      }
    }
  },
  data() {
    return {
      open: false,
      activeTab: 0,
      rule: cloneDeep(this.initialRule),
      syntaxTypes: ['json', 'text', 'xml'],
      methods: ['ALL', 'GET', 'POST', 'PUT', 'DELETE'],
      lastEmitted: null
    }
  },
  computed: {
    selectedMethod: {
      get() {
        return this.rule.method || 'ALL'
      },

      set(val) {
        this.$set(this.rule, 'method', val)
      }
    },
    selectedSyntax: {
      get() {
        return this.rule.syntax || 'json'
      },

      set(val) {
        this.$set(this.rule, 'syntax', val)
      }
    },
    editorSource: {
      get() {
        return JSON.stringify(this.rule, null, 2)
      },

      set(val) {
        try {
          this.rule = JSON.parse(val)
        } catch (e) {
          // Invalid data in editor, do nothing
        }
      }
    }
  },
  watch: {
    initialRule: {
      handler(newVal) {
        if (!isEqual(this.lastEmitted, newVal)) {
          this.rule = cloneDeep(newVal)
        }
      },
      deep: true
    },
    rule: {
      handler() {
        this.lastEmitted = cloneDeep(this.rule)
        this.$emit('change', this.lastEmitted)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.rule {
  width: 100%;
  margin-top: 10px;

  .header {
    input {
      float: right;
    }
  }

  .body {
    overflow: hidden;
    width: 100%;
  }

  .content {
    display: flex;

    & > div {
      flex-basis: 50%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      &:not(:first-of-type) {
        margin-left: 20px;
      }

      select, input:not([type="checkbox"]) {
        float: right;
        box-sizing: border-box;
        width: 50%;
      }

      label {
        font-weight: 600;

        &:not(:first-of-type) {
          margin-top: 10px;
        }
      }
    }
  }

  .slide-enter-active, .slide-leave-active {
    transition: max-height 1s;
    max-height: 500px;
  }

  .slide-enter, .slide-leave-to {
    max-height: 0;
  }
}
</style>
