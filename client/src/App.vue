<template>
  <div class="application" :class="{ dark, light: !dark }">
    <i-navbar />
    <router-view />
    <i-footer />
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
