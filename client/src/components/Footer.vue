<template>
  <footer
    class="absolute h8 ml5 mr5 flex align-items-center"
    :class="{ dark, light: !dark }"
  >
    <div
      class="bgcolor-inherit flex justify-content-space-around wrap align-items-center"
    >
      <span
        >©️ {{ year }} Copyright, All Rights Reserved by Infrapedia Inc.</span
      >
      <p class="fs-small m0 ml2">- v {{ packageVersion }}</p>
      <router-link
        class="link ml2 mr2 mt2 color-inherit"
        to="/terms-and-conditions"
        >Terms & Conditions</router-link
      >
      <el-divider direction="vertical" class="hidden-sm-and-down" />
      <router-link class="link ml2 mr2 mt2 color-inherit" to="/privacy-policy"
        >Privacy Policy</router-link
      >
    </div>
  </footer>
</template>

<script>
import currentYear from '../helpers/currentYear'
import pkg from '../../package.json'

export default {
  name: 'IFooter',
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    year() {
      return currentYear()
    },
    packageVersion() {
      return pkg.version
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/footer-styles.scss';
</style>
