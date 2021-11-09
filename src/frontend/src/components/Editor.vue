<template>
  <div ref="elem"></div>
</template>

<script>
import * as monaco from 'monaco-editor'

export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null,
      bindedVal: this.value,
    }
  },
  watch: {
    value(newVal) {
      if (newVal !== this.bindedVal) {
        this.editor.getModel().setValue(newVal)
      }
    },

    bindedVal(newVal) {
      if (newVal !== this.value) {
        this.$emit('input', newVal)
      }
    }
  },
  mounted() {
    this.editor = monaco.editor.create(this.$refs.elem, {
      value: this.value,
      language: 'json',
      minimap: { enabled: false },
      contextmenu: false,
      tabSize: 2,
      readOnly: this.readOnly,
      scrollBeyondLastLine: !this.readOnly,
    })

    this.editor.onDidChangeModelContent(() => {
      this.bindedVal = this.editor.getValue()
    })
  }
}
</script>

<style lang="scss" scoped>
div {
  height: 300px;
}
</style>