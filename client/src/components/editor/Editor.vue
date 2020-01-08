<template>
  <div class="map-wrapper">
    <div id="map" />
    <properties-dialog
      :mode="dialog.mode"
      :is-visible="dialog.visible"
      :feature="dialog.selectedFeature"
      @close="handleDialogData"
    />
  </div>
</template>

<script>
import { bus } from '../../helpers/eventBus'
import EditorControls from './editorControls'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import PropertiesDialog from './propertiesDialog'
import { mapConfig } from '../../config/mapConfig'
import { EDITOR_LOAD_DRAW, EDITOR_FILE_CONVERTED } from '../../events/editor'

export default {
  components: {
    PropertiesDialog
  },
  data: () => ({
    map: null,
    draw: null,
    controls: null,
    dialog: {
      visible: false,
      mode: 'create',
      selectedFeature: {}
    }
  }),
  props: {
    isCls: {
      type: Boolean,
      default: () => false
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
    bus.$on(`${EDITOR_LOAD_DRAW}`, this.handleRecreateDraw)
    bus.$on(`${EDITOR_FILE_CONVERTED}`, this.handleFileConverted)
  },
  beforeDestroy() {
    if (this.scene.features.list.length) {
      this.controls.resetScene(true)
    }
  },
  methods: {
    async handleFileConverted(fc) {
      await this.$store.dispatch('editor/setList', fc.features)
      return this.draw.set(fc)
    },
    handleDialogData(data) {
      this.dialog.visible = false
      const feature = { ...this.dialog.selectedFeature }

      if (feature.feature) {
        feature.feature.properties = {
          ...feature.feature.properties,
          ...data
        }
      } else {
        feature.properties = {
          ...feature.properties,
          ...data
        }
      }

      this.dialog.mode === 'create'
        ? this.handleCreateFeature(feature)
        : this.handleEditFeatProps([feature])

      this.dialog = {
        visible: false,
        mode: 'create',
        selectedFeature: {}
      }
    },
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
        handleEditFeatureProperties: feat => {
          this.dialog.mode = 'edit'
          this.dialog.visible = true
          this.dialog.selectedFeature = feat
        },
        handleBeforeFeatureCreation: feat => {
          this.dialog.visible = true
          this.dialog.selectedFeature = feat
        }
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
      if (!e.features.length) return
      const featureSelected = this.scene.features.list.filter(
        feat => feat.id === e.features[0].id
      )
      return this.controls.handleDrawSelectionChange(featureSelected)
    },
    handleCreateFeature(feat) {
      this.$store.dispatch('editor/confirmCreation', feat)
      return this.controls.resetScene()
    },
    handleEditFeatProps(feat) {
      this.$store.dispatch('editor/editFeature', feat)
      return this.controls.resetScene()
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
