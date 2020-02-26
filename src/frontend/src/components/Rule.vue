<template>
  <div class="rule-container">
    <div
      class="rule"
      :class="[rule.method ? rule.method.toLowerCase() : '', { 'disabled': rule.disabled }]"
    >
      <div class="header" @click="open = !open">
        <span class="method">{{ rule.method || 'ALL' }}</span>
        <span class="path">{{ rule.path }}</span>
        <input v-model="rule.disabled" type="checkbox" @click.stop />
      </div>
      <transition name="slide">
        <div v-if="open" class="body">
          <div class="navigation">
            <span :class="{ 'active': activeTab === 0 }" @click="activeTab = 0">General</span>
            <span :class="{ 'active': activeTab === 1 }" @click="activeTab = 1">Request</span>
            <span :class="{ 'active': activeTab === 2 }" @click="activeTab = 2">Response</span>
            <span :class="{ 'active': activeTab === 3 }" @click="activeTab = 3">Source</span>
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
                    <option v-for="method in methods" :key="method">{{ method }}</option>
                  </select>
                </label>
                <label>
                  Status Code
                  <input v-model.number="rule.statusCode" type="number" />
                </label>
                <label>
                  Syntax Highlighting
                  <select v-model="selectedSyntax">
                    <option v-for="syntax in syntaxTypes" :key="syntax">{{ syntax }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  <input v-model="rule.skipApi" type="checkbox" />
                  Skip API
                </label>
                <label>
                  <input v-model="rule.interceptRequest" type="checkbox" />
                  Intercept Request
                </label>
                <label>
                  <input v-model="rule.interceptResponse" type="checkbox" />
                  Intercept Response
                </label>
              </div>
            </template>

            <!-- Source Tab -->
            <Editor v-if="activeTab === 3" v-model="editorSource" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash'

import Editor from './Editor'

export default {
  name: 'Rule',
  components: {
    Editor
  },
  props: {
    initialRule: {
      type: Object,
      required: true,
      validator (value) {
        return Object.prototype.hasOwnProperty.call(value, 'path')
      }
    }
  },
  data () {
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
      get () {
        return this.rule.method || 'ALL'
      },

      set (val) {
        this.$set(this.rule, 'method', val)
      }
    },
    selectedSyntax: {
      get () {
        return this.rule.syntax || 'json'
      },

      set (val) {
        this.$set(this.rule, 'syntax', val)
      }
    },
    editorSource: {
      get () {
        return JSON.stringify(this.rule, null, 2)
      },

      set (val) {
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
      handler (newVal) {
        if (!isEqual(this.lastEmitted, newVal)) {
          this.rule = cloneDeep(newVal)
        }
      },
      deep: true
    },
    rule: {
      handler () {
        this.lastEmitted = cloneDeep(this.rule)
        this.$emit('change', this.lastEmitted)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/scss/mixins';

$default-color: #fff;
$default-border: #3179B4;
$get-color: #e8f6f0;
$get-border: #2D8643;
$post-color: #fbf1e6;
$post-border: #E69624;
$put-color: #f4e7fd;
$put-border: #b346ff;
$delete-color: #fbe7e7;
$delete-border: #D93A3A;
$disabled-color: #f9f9f9;
$disabled-border: #f0f0f0;

.rule-container {
  border: 1px solid #EFF0EC;
  border-left: 0;
  //     background: linear-gradient(to right,#39aa56 0,#39aa56 10px,#fff 10px,#fff 100%) no-repeat;
}

.rule {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: $default-color;
  border-left: 8px solid $default-border;

  @include http-method('get', $get-color, $get-border);
  @include http-method('post', $post-color, $post-border);
  @include http-method('put', $put-color, $put-border);
  @include http-method('delete', $delete-color, $delete-border);
  @include http-method('disabled', $disabled-color, $disabled-border);

  .method {
    color: $default-border;
    font-weight: bold;
    margin-right: 5px;
  }

  .header {
    padding: 5px 0;
    cursor: pointer;

    input {
      float: right;
    }
  }

  .body {
    overflow: hidden;
    width: 100%;
  }

  .navigation {
    margin: 5px 0 10px;

    span {
      display: inline-block;
      cursor: pointer;

      &:not(:last-of-type) {
        margin-right: 15px;
      }

      &.active {
        font-weight: 500;
      }
    }
  }

  .content {
    display: flex;
    position: relative;

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
