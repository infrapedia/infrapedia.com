<template>
  <div class="relative">
    <el-button
      circle
      type="primary"
      class="w11 h11"
      title="Last Mile Tool"
      @click="findPath"
    >
      <fa :icon="['fas', 'wave-square']" />
    </el-button>
  </div>
</template>

<script>
import lastMileTool from './gri-tool'

export default {
  data: () => ({
    griTool: null
  }),
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  mounted() {
    if (this.map) this.initTool()
  },
  methods: {
    initTool() {
      this.griTool = new lastMileTool({ map: this.map })
    },
    findPath() {
      this.$emit('activate-gri-tool', this.griTool)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/print-button-styles.scss';
</style>
