<template>
  <div id="rules">
    <div class="row">
      <div class="twelve columns">
        <card>
          <h2>Rules<div class="add-on" @click="modals.newRule = true">Add Rule</div></h2>
          <rule v-for="rule in rules" :rule="rule" :key="rule.path"></rule>
        </card>
      </div>
    </div>
    <div class="row" v-if="intercepted.length">
      <div class="twelve columns">
        <card>
          <h2>Intercepted</h2>
          <intercept v-for="intercept in intercepted" :intercept="intercept" :key="intercept.intercept.id"></intercept>
        </card>
      </div>
    </div>
    <modal :open="modals.newRule" @closeBtn="cancelNewRule" @success="addRule">
      <h4>New Rule</h4>
      <form class="new-rule">
        <div class="row">
          <div class="six columns">
            <label for="path">Path*</label>
            <input
              class="u-full-width"
              type="text"
              v-model="path"
            />
          </div>
          <div class="three columns">
            <label>Method</label>
            <select
              class="u-full-width"
              v-model="method"
            >
              <option v-for="method in methods" :value="method">{{ method }}</option>
            </select>
          </div>
          <div class="three columns">
            <label>Status</label>
            <input
              class="u-full-width"
              type="text"
              v-model="status"
            />
          </div>
        </div>
        <label>Body</label>
        <JSONEditor :json="body" :options="editorOptions" @change="updateBody" @error="bodyError" class="source"></JSONEditor>
      </form>
    </modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { mapModels } from '../util/customStateMaps'

import Card from '../components/Card.vue'
import Rule from '../components/Rule.vue'
import Modal from '../components/Modal.vue'
import Intercept from '../components/Intercept.vue'
import JSONEditor from '../components/JSONEditor.vue'

import * as types from '../store/types'

export default {
  name: 'rules',
  data() {
    return {
      methods: ['ALL', 'POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
      modals: {
        newRule: false
      },
      editorOptions: {
        mode: 'code',
        modes: []
      }
    }
  },
  components: {
    Card,
    Rule,
    Modal,
    Intercept,
    JSONEditor
  },
  methods: {
    addRule() {
      this.$store.commit('ADD_NEW_RULE')
      this.cancelNewRule()
    },
    updateBody(val) {
      this.$store.commit(types.UPDATE_BODY, val)
    },
    bodyError() {
      this.$store.commit(types.UPDATE_BODY, undefined)
    },
    cancelNewRule() {
      this.modals.newRule = false
      this.$store.commit(types.CLEAR_NEW_RULE)
    }
  },
  computed: {
    ...mapModels({
      path: ['newRule.path', types.UPDATE_PATH],
      method: ['newRule.method', types.UPDATE_METHOD],
      status: ['newRule.status', types.UPDATE_STATUS]
    }),
    ...mapGetters({
      rules: 'getRules'
    }),
    ...mapState({
      intercepted: 'intercepts'
    }),
    body() {
      return this.$store.state.newRule.body || {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
