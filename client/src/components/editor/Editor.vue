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
    controls: null
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    scene() {
      return this.$store.state.editor.scene
    },
    isEdition() {
      return this.$store.state.editor.edition
    },
    isCreation() {
      return this.$store.state.editor.creation
    }
  },
  watch: {
    dark(bool) {
      return this.toggleDarkMode(bool)
    },
    scene: {
      handler(newState) {
        this.controls.updateControls(newState)
      },
      deep: true
    }
  },
  mounted() {
    this.map = this.addMapEvents(this.createMap())
    this.toggleDarkMode(this.dark)
    if (this.scene.features.list.length) {
      this.handleRecreateDraw()
    }
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

      this.controls = new EditorControls(
        this.draw,
        this.$store.dispatch,
        this.scene
      )
      map.addControl(this.controls)
      map.addControl(this.draw)
      return map
    },
    addMapEvents(map) {
      const vm = this
      map.on('load', function() {
        map.on('draw.selectionchange', vm.handleDrawSelectionChange)
      })
      return map
    },
    handleRecreateDraw() {
      // Deleting everything in case there's something already drawn that could be repeted
      this.draw.trash()
      for (let feat of this.scene.features.list) {
        this.draw.add(feat.feature)
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
