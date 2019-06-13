<template>
  <div>
    {{count}}
    <!-- <button @click="onAdd">add</button> -->
  </div>
</template>

<script>
  import store from './tstore';
  export default {
    computed: {
      count(){  // 由于暂时没有实现mapState的方法，只能使用当前
        return store.state.count;
      }
    },
    methods: {
      onAdd() {
        store.dispatch('add')
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>