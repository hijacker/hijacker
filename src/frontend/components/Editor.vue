<template>
  <div style="width: 100%; height: 200px;"></div>
</template>

<script>
import CodeFlask from 'codeflask'

export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      required: true
    },
    lang: String
  },
  data() {
    return {
      editor: null,
      contentBackup: ''
    }
  },
  watch: {
    value(val) {
      if (this.contentBackup !== val)  {
        this.editor.updateCode(val)
        // Remove when CodeFlask update published
        this.editor.setLineNumber()
        this.contentBackup = val
      }
    },
    lang(val) {
      this.editor.updateLanguage(val)
    }
  },
  mounted() {
    const self = this
    const lang = this.lang || 'text'

    self.editor = new CodeFlask(this.$el, {
      language: lang,
      lineNumbers: true
    })

    self.editor.updateCode(self.value)
    // Remove when CodeFlask update published
    self.editor.setLineNumber()
    self.contentBackup = self.value

    self.editor.onUpdate((code) => {
      self.$emit('input', code)
      self.contentBackup = code
    })
  }
}
</script>

<style lang="scss">

</style>
