<template>
  <div class="map-editor-wrapper">
    <div id="map" />
    <div class="absolute coords-box z-index20 p2 w25">
      <p class="m0"><strong>Lat:</strong> {{ infoBox.lat }}</p>
      <p class="m0 mt1"><strong>Lng:</strong> {{ infoBox.lng }}</p>
      <p class="m0 mt1"><strong>Zoom:</strong> {{ infoBox.zoom }}</p>
    </div>
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
    infoBox: {
      lat: mapConfig.center[1],
      lng: mapConfig.center[0],
      zoom: mapConfig.zoom
    },
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
      if (!fc.features.length) return

      const { map, draw, $store } = this

      await $store.dispatch('editor/setList', fc.features)
      draw.set(fc)
      let bbox = []
      let coords = []

      // Calculation of bounds for cables
      if (fc.features[0].geometry.type !== 'Point') {
        coords = [
          fc.features[0].geometry.coordinates[0],
          fc.features[fc.features.length - 1].geometry.coordinates[0]
        ]
        bbox = coords.reduce(
          (bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        )
      } else {
        // Calculation of bounds for points
        coords = [
          fc.features[0].geometry.coordinates,
          fc.features[fc.features.length - 1].geometry.coordinates
        ]
        bbox = coords.reduce(
          (bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        )
      }

      map.fitBounds(bbox, {
        padding: 90,
        animate: true,
        speed: 1.75,
        pan: {
          duration: 25
        }
      })
    },
    handleDialogData(data) {
      this.dialog.visible = false
      const feature = { ...this.dialog.selectedFeature }

      feature.properties = {
        ...feature.properties,
        ...data
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
      const scaleCtrl = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      })

      map.addControl(scaleCtrl, 'top-left')
      map.addControl(new mapboxgl.NavigationControl())
      map.addControl(new mapboxgl.FullscreenControl())
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
        map.on('mousemove', function(e) {
          const coords = e.lngLat.wrap()
          vm.infoBox.lat = coords.lat.toFixed(5)
          vm.infoBox.lng = coords.lng.toFixed(5)
        })
        map.on('zoom', function() {
          vm.infoBox.zoom = map.getZoom().toFixed(5)
        })
      })
      return map
    },
    handleRecreateDraw() {
      // Deleting everything in case there's something already drawn that could be repeted
      this.draw.trash()
      for (let feat of this.scene.features.list) {
        this.draw.add(feat)
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

<style lang="scss" scoped>
@import '../../assets/scss/components/editor-styles.scss';
</style>
