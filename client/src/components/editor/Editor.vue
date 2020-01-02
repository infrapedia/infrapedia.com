<template>
  <div id="map" />
</template>

<script>
import { mapConfig } from '../../config/mapConfig'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

export default {
  data: () => ({
    map: null
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  watch: {
    dark(bool) {
      return this.toggleDarkMode(bool)
    }
  },
  mounted() {
    this.map = this.addMapEvents(this.createMap())
    this.toggleDarkMode(this.dark)
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

      map.addControl(new mapboxgl.NavigationControl())
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: false,
          point: true,
          trash: true,
          line_string: true
        }
      })

      map.addControl(draw, 'top-right')
      return map
    },
    addMapEvents(map) {
      const vm = this
      map.on('load', function() {
        map.on('click', vm.handleMapClick)
      })
      return map
    },
    handleMapClick(e) {
      console.log(e, 'click map')
    },
    toggleDarkMode(dark) {
      const style = dark ? mapConfig.darkBasemap : mapConfig.default
      this.map.setStyle(style)
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
