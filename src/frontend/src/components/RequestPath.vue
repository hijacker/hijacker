<template>
  <ul>
    <li 
      v-for="item in items"
      :key="item.value"
      @click="$emit('item-click', item.value)"
    >
      {{ item.text }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  display: inline-block;
  background-color: lightgrey;
  padding: 2px 10px;
  cursor: pointer;

  & + & {
    margin-left: 10px;
  }
}
</style>