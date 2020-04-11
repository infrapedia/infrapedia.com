<template>
  <map-overlay />
</template>

<script>
import MapOverlay from '../components/mainMap/MapOverlay'
import { checkCookie } from '../helpers/cookies'

export default {
  components: {
    MapOverlay
  },
  beforeCreate() {
    if (!checkCookie('auth0.is.authenticated')) {
      this.$auth.loginWithRedirect()
    }
    this.$emit('layout', 'map-app-layout')
  }
}
</script>
<style lang="scss">
@import '../assets/scss/pages/home-styles.scss';
</style>
