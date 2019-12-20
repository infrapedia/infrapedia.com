<template>
  <el-container class="vph-full no-overflow">
    <i-navbar role="navigation" :is-user-navbar="true" />

    <transition name="fade" mode="out-in"><router-view /></transition>

    <i-theme-toggler @click="toggleTheme" />
  </el-container>
</template>

<script>
import IThemeToggler from '../components/ThemeToggler'
import { TOGGLE_DARK } from '../store/actionTypes'
import INavbar from '../components/Navbar'
import { bus } from '../helpers/eventBus'
import { TOGGLE_THEME } from '../events'

export default {
  components: {
    INavbar,
    IThemeToggler
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    toggleTheme() {
      bus.$emit(`${TOGGLE_THEME}`)
      this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
      console.warn('TOGGLING THEME FROM CREATE LAYOUT!!')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/create-styles.scss';
</style>
