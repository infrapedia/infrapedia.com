<template>
  <div class="filter-btn-wrapper relative">
    <el-button
      class="circle w4"
      type="warning"
      @click="toggleFilterVisiblity"
    ><fa :icon="['fas', 'filter']" /></el-button>
    <div v-if="isMenuFilter" class="absolute">
      <li>
        1
      </li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IFilter',
  data:() => ({
    isMenuFilter: false
  }),
  methods: {
    toggleFilterVisiblity() {
      this.isMenuFilter = !this.isMenuFilter
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/filter-styles.scss';
</style>
