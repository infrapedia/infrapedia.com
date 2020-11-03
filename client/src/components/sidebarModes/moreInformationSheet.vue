<template>
  <transition
    tag="div"
    mode="out-in"
    name="animated faster3x"
    enter-active-class="slideInUp"
    leave-active-class="slideOutDown"
  >
    <div
      v-if="isVisible"
      class="el-drawer p8"
      :class="{ dark, light: !dark }"
      aria-labelledby="el-drawer-title"
      aria-label="More Information"
      role="dialog"
      tabindex="-1"
    >
      <header id="el-drawer-title" class="flex justify-content-space-between">
        <span role="heading" tabindex="0" title="I am the title">
          More Information
        </span>
        <el-button
          circle
          :class="{ dark }"
          aria-label="close more information"
          class="no-border"
          icon="el-icon-close"
          @click="handleClose"
        />
      </header>
      <el-divider class="transparent mt2 mb2" />
      <div class="drawer-body">
        Here is where the fields go
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MoreInformationSheet',
  data: () => ({}),
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    direction() {
      return 'btt' // bottom to top
    },
    dialogCustomClass() {
      return this.dark ? 'dark' : 'light'
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/more-information-sheet-styles.scss';
</style>
