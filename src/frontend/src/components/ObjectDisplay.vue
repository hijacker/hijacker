<template>
  <div>
    <h4 @click="showValues = !showValues">{{ title }}</h4>
    <div class="details" v-if="showValues">
      <div
        v-for="[key, val] in Object.entries(item)"
        :key="key"
        class="item"
      >
        <strong>{{ key }}:</strong> {{ val }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ObjectDisplay',
  props: {
    title: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showValues: true
    }
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0 0 5px;
}

.item {
  margin-left: 15px;
}
</style>