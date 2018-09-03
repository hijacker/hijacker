<template>
  <div class="rule">
    <div class="header" @click="open = !open">
      <span>{{ rule.method || 'ALL' }}</span>
      <span>{{ rule.path }}</span>
      <input type="checkbox" v-model="rule.disabled" @click.stop />
    </div>
    <transition name="slide">
      <div class="body" v-if="open">
        <div class="navigation">Section Headers here</div>
        <div class="content">
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
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash'

export default {
  name: 'rule',
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
  },
  methods: {
    alert () {
      console.log('testing')
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
  }

  .content {
    display: flex;

    div {
      flex-basis: 50%;
      display: flex;
      flex-direction: column;

      select, input:not([type="checkbox"]) {
        float: right;
        box-sizing: border-box;
        width: 50%;
      }

      label {
        font-weight: 600;
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
