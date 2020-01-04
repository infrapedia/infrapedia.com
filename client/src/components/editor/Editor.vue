<template>
  <div id="map" />
</template>

<script>
import { mapConfig } from '../../config/mapConfig'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import EditorControls from './editorControls'

export default {
  data: () => ({
    map: null,
    draw: null,
    controls: null,
    state: {
      scene: {
        features: {
          list: [],
          selected: null
        },
        creation: null,
        edition: null,
        oldState: null
      }
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  watch: {
    dark(bool) {
      return this.toggleDarkMode(bool)
    },
    state: {
      // eslint-disable-next-line
      handler(newState) {
        this.controls.updateControls()
      },
      deep: true
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
      this.draw = new MapboxDraw({
        displayControlsDefault: false
      })

      this.controls = new EditorControls(this.map, this.draw, this.state)
      map.addControl(this.controls)
      map.addControl(this.draw)
      return map
    },
    addMapEvents(map) {
      const vm = this
      map.on('load', function() {
        map.on('click', vm.handleMapClick)
        map.on('draw.selectionchange', vm.handleDrawSelectionChange)
      })
      return map
    },
    handleMapClick() {
      if (this.state.scene.creation || this.state.scene.edition) return

      let features = this.map.queryRenderedFeatures()
      if (features.length) {
        let feature = features[0]
        if (feature.properties.__editor) {
          this.state.scene.features.selected = feature.properties.__editor._id
        }
      } else {
        this.state.scene.features.selected = null
      }
    },
    handleDrawSelectionChange(e) {
      return this.controls.handleDrawSelectionChange(e.features)
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
