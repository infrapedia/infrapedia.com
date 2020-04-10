<template>
  <div>
    <component :is="currentView" />
  </div>
</template>

<script>
import MapOverlay from '../components/MapOverlay'
import HomePage from '../components/homepage/HomePage'

export default {
  components: {
    MapOverlay,
    HomePage
  },
  computed: {
    isRegistered() {
      return this.$auth.isAuthenticated
    },
    currentView() {
      return this.isRegistered ? MapOverlay : HomePage
    }
  }
}
</script>

<style></style>
