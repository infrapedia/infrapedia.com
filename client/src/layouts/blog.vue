<template>
  <el-container class="vph-full">
    <navbar />
    <transition name="fade" mode="out-in"><router-view /></transition>

    <i-theme-toggler @click="toggleTheme" />
  </el-container>
</template>

<script>
import IThemeToggler from '../components/ThemeToggler'
import { TOGGLE_DARK } from '../store/actionTypes'
import Navbar from '../components/blog/Navbar'

export default {
  components: {
    Navbar,
    IThemeToggler
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    imageURL() {
      return this.dark
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    }
  },
  methods: {
    toggleTheme() {
      this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
      console.warn('TOGGLING THEME FROM BLOG LAYOUT!!')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/blog.scss';
</style>
