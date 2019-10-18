<template>
  <div class="application" :class="{ dark, light: !dark }">
    <router-view />
    <i-footer />
  </div>
</template>

<script>
import IFooter from './components/Footer'

export default {
  name: 'App',
  components: {
    IFooter
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
