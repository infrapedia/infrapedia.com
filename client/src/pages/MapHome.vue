<template>
  <map-overlay />
</template>

<script>
import MapOverlay from '../components/mainMap/MapOverlay'

export default {
  components: {
    MapOverlay
  },
  beforeCreate() {
    this.$emit('layout', 'map-app-layout')
  }
}
</script>
