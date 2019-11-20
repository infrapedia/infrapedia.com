<template>
  <footer
    class="absolute h8 ml5 mr5 flex align-items-center"
    :class="{ dark, light: !dark }"
  >
    <div
      class="bgcolor-inherit flex justify-content-space-around wrap align-items-center"
    >
      <span>&copy; 2019 Copyright, All Rights Reserved by Infrapedia</span>
      <span
        tabindex="0"
        class="ml6 mr2 cursor-pointer hidden-sm-and-down"
        @click="toggleDrawerVisibility"
        @keyup.enter="toggleDrawerVisibility"
        >Trusted by</span
      >
      <el-divider direction="vertical" class="hidden-sm-and-down" />
      <bottom-sheet
        :visibility="isDrawerOpen"
        @close="toggleDrawerVisibility"
      />
      <router-link class="ml2 mr2 mt2 color-inherit" to="/terms-and-conditions"
        >Terms & Conditions</router-link
      >
      <el-divider direction="vertical" class="hidden-sm-and-down" />
      <router-link class="ml2 mr2 mt2 color-inherit" to="/privacy-policy"
        >Privacy Policy</router-link
      >
    </div>
  </footer>
</template>

<script>
export default {
  name: 'IFooter',
  components: {
    'bottom-sheet': () => import('./BottomSheet')
  },
  data: () => ({
    isDrawerOpen: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    toggleDrawerVisibility() {
      this.isDrawerOpen = !this.isDrawerOpen
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/footer-styles.scss';
</style>
