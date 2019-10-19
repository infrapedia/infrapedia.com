<template>
  <div class="filter-btn-wrapper relative">
    <el-popover placement="bottom-end" width="200" trigger="click">
      <el-card class="p0 no-border" shadow="never">
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </el-card>
      <el-button slot="reference" class="circle w7 h7 p0 vertical-align">
        <fa :icon="['fas', 'filter']" class="xsm-icon" />
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'IFilter',
  data: () => ({
    isMenuFilter: false
  }),
  methods: {
    toggleFilterVisiblity() {
      this.isMenuFilter = !this.isMenuFilter
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/filter-styles.scss';
</style>
