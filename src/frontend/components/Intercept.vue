<template>
  <div class="intercept" @click="resumeIntercept(intercept)">
    <span class="type">{{ intercept.intercept.type === 'request' ? 'REQ' : "RES" }}</span>
    <span class="path">{{ intercept.rule.path }}</span>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import * as types from '../store/types'

export default {
  name: 'Intercept',
  props: {
    intercept: {
      type: Object,
      required: true,
      validator(value) {
        return value.hasOwnProperty('intercept')
      }
    }
  },
  data() {
    return {
      open: false,
      editor: null
    }
  },
  mounted() {
    // let container = this.$refs.jsoneditor
    // let options = {
    //   search: false,
    //   modes: ['tree', 'code'],
    //   onChange: this.updateRuleBody,
    //   history: false
    // }
    // this.editor = new JSONEditor(container, options)
    // this.editor.set(this.rule.body)
  },
  methods: {
    ...mapMutations({
      resumeIntercept: types.RESUME_INTERCEPT
    })
  }
}
</script>

<style lang="scss" scoped>
  .intercept {
    width: 100%;
    margin: 5px 0;
    padding: 5px;
    background-color: #ebf3fb;
    border: 1px solid #61affe;
    box-sizing: border-box;

    & > .type {
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
  }
</style>
