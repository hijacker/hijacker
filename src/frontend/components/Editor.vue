<template>
  <textarea />
</template>

<script>
import CodeMirror from 'codemirror'

// Support JS and XML
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'

export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({
        lineNumbers: true,
        mode: 'javascript',
        theme: 'neat'
      })
    }
  },
  data() {
    return {
      editor: null
    }
  },
  watch: {
    options: {
      deep: true,
      handler(options) {
        for (const key in options) {
          this.editor.setOption(key, options[key])
        }
      }
    },
    value(newVal) {
      const editorVal = this.editor.getValue()

      if (newVal !== editorVal) {
        const scrollInfo = this.editor.getScrollInfo()
        this.editor.setValue(newVal)
        this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
      }
    },
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$el, this.options)
    this.editor.setValue(this.value)

    this.editor.on('change', cm => {
      this.$emit('input', cm.getValue())
    })

    this.$emit('ready', this.editor)

    this.$nextTick(() => {
      this.editor.refresh()
    })
  },
  beforeDestroy() {
    // TODO: Find a better way to destroy to work with animations
    const element = this.editor.doc.cm.getWrapperElement()
    element.remove
    element.remove()
  }
}
</script>

<style lang="scss">
  @import '~codemirror/lib/codemirror.css';
  @import '~codemirror/theme/neat.css';
</style>
