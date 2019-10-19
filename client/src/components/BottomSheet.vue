<template>
  <el-drawer
    :modal="false"
    :show-close="false"
    size="8%"
    :visible.sync="visibility"
    :before-close="emitClose"
    :modal-append-to-body="false"
    append-to-body
    direction="btt"
  >
    <div class="flex justify-content-space-around h-fit-full mr9 ml9 align-items-center">
      <h1 class="title text-center">Trusted by</h1>
      <el-image
        v-for="(src, i) in sponsors"
        :key="i"
        :src="src"
        fit="contain"
        class="sponsor-img w20 h16 no-selectable"
      />
    </div>
  </el-drawer>
</template>

<script>
import sponsors from '../data/sponsors'

export default {
  props: {
    visibility: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    sponsors
  }),
  methods: {
    emitClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/bottom-sheet-styles.scss';
</style>
