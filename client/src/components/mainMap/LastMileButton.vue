<template>
  <div class="relative">
    <el-button
      circle
      type="primary"
      class="w11 h11"
      title="Last Mile Tool"
      @click="activateLMT"
    >
      <fa :icon="['fas', 'wave-square']" />
    </el-button>
  </div>
</template>

<script>
export default {
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    activateLMT() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/print-button-styles.scss';
</style>
