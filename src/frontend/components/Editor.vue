<template>
  <div class="wrapper">
    <textarea ref="el"/>
  </div>
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
      defaultOptions: {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'neat'
      }
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
    readOnly(newValue) {
      this.editor.setOption('readOnly', newValue)
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
    console.log(this.$refs);
    this.editor = CodeMirror.fromTextArea(this.$refs.el, {
      ...this.defaultOptions,
      ...this.options,
      readOnly: this.readOnly
    })

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

<style lang="scss" scoped>
@import '~codemirror/lib/codemirror.css';
@import '~codemirror/theme/neat.css';

.wrapper {
  position: relative;
  height: 300px;

  /deep/ .CodeMirror {
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    height:100%;
  }
}


</style>
