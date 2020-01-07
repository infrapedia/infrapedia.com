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
    interactions: null
  }),
  props: {
    isCls: {
      type: Boolean,
      default: () => false
    },
    propertiesDialogForm: {
      type: Object,
      required: true
    },
    isDialogDone: {
      type: Boolean,
      required: true
    }
  },
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
    isDialogDone(bool) {
      if (!bool) return

      const { features } = this.scene
      const feature = {
        id: features.selected[0].id,
        feature: { ...features.selected[0] },
        type: features.selected[0].geometry.type
      }
      feature.feature.properties = {
        ...feature.feature.properties,
        ...this.propertiesDialogForm
      }
      if (this.scene.creation) {
        return this.handleCreateFeature(feature)
      } else if (this.scene.edition) {
        return this.handleEditFeatureProperties()
      }
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
  beforeDestroy() {
    if (this.scene.features.list.length) {
      this.controls.resetScene(true)
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
      this.draw = new MapboxDraw({ displayControlsDefault: false })

      this.controls = new EditorControls({
        draw: this.draw,
        scene: this.scene,
        isCLS: this.isCls,
        $dispatch: this.$store.dispatch,
        handleEditFeatureProperties: this.handleEditFeatureProperties,
        handleBeforeFeatureCreation: this.handleBeforeFeatureCreation
      })

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
    async handleBeforeFeatureCreation(type) {
      return await this.$emit('open-properties-dialog', type)
    },
    handleCreateFeature(feat) {
      this.$store.dispatch('editor/confirmCreation', feat)
      return this.controls.resetScene()
    },
    async handleEditFeatureProperties(feat) {
      await this.$prompt('Please input a valid name', 'Edit ...', {
        confirmButtonText: 'OK',
        showClose: false,
        roundButton: true,
        showCancelButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputValue: feat.feature.properties.name,
        inputValidator: val => val !== '',
        inputErrorMessage: 'Invalid name'
      }).then(({ value }) => (feat.feature.properties.name = value))
      return feat
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
