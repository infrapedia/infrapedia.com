<template>
  <div class="application" :class="{ dark, light: !dark }" role="main">
    <i-navbar role="navigation" />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <i-footer role="contentinfo" />
  </div>
</template>

<script>
import INavbar from './components/Navbar'
import IFooter from './components/Footer'

export default {
  name: 'App',
  components: {
    IFooter,
    INavbar
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  }
}
</script>
<style lang="sass">
@import './assets/scss/main.scss'
</style>
