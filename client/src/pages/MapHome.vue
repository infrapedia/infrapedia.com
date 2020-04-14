<template>
  <map-overlay />
</template>

<script>
import MapOverlay from '../components/mainMap/MapOverlay'

export default {
  components: {
    MapOverlay
  },
  head: {
    title: 'Infrapedia | Global Internet Infrastructure Map',
    meta: [
      {
        name: 'application-name',
        content: 'Infrapedia | Global Internet Infrastructure Map'
      },
      {
        name: 'keywords',
        content:
          'custom maps, fiber optics maps, internet infrastructure map, live map, consulting, data center, sponsorship, ads, telecommunications'
      },
      {
        name: 'description',
        content:
          'Navigate through the World’s Largest Live Map of the Global Internet Infrastructure. All the data you need for free in a crowd-sourced platform.'
      }
    ]
  },
  beforeCreate() {
    this.$emit('layout', 'map-app-layout')
  }
}
</script>
