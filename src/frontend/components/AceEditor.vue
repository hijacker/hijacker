<template>
  <div style="width: 100%; height: 200px;"></div>
</template>

<script>
import ace from 'brace'

import 'brace/mode/json'
import 'brace/mode/xml'
import 'brace/theme/chrome'

export default {
  name: 'AceEditor',
  props: {
    value: {
      type: String,
      required: true
    },
    lang: String,
    options: Object
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
        this.editor.setValue(val, 1)
        this.contentBackup = val
      }
    },
    lang(val) {
      this.editor.getSession().setMode(`ace/mode/${val}`)
    },
    options(val) {
      this.editor.setOptions(val)
    }
  },
  beforeDestroy() {
    this.editor.destroy()
    this.editor.container.remove()
  },
  mounted() {
    const self = this
    const lang = this.lang || 'text'

    self.editor = ace.edit(this.$el)

    self.editor.$blockScrolling = Infinity
    self.editor.getSession().setMode(`ace/mode/${lang}`)
    self.editor.setTheme('ace/theme/chrome')
    self.editor.setValue(this.value, 1)
    self.contentBackup = self.value

    self.editor.on('change', () => {
      const val = self.editor.getValue()

      self.$emit('input', val)
      self.contentBackup = val
    })

    if (self.options) {
      self.editor.setOptions(self.options)
    }
  }
}
</script>

<style lang="scss">

</style>
