<template>
  <div id="map" />
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import { mapConfig } from '../../config/mapConfig'

export default {
  data: () => ({
    map: null
  }),
  mounted() {
    this.map = this.createMap()
  },
  methods: {
    createMap() {
      mapboxgl.accessToken = mapConfig.mapToken

      const map = new mapboxgl.Map({
        container: 'map',
        zoom: mapConfig.zoom,
        center: mapConfig.center,
        style: mapConfig.default
      })

      window.mapboxgl = mapboxgl

      return map
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>
