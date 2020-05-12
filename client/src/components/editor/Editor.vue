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
      :type="type"
      :creation-form="form"
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
import {
  EDITOR_LOAD_DRAW,
  EDITOR_SET_FEATURES,
  EDITOR_FILE_CONVERTED
} from '../../events/editor'
import { fCollectionFormat } from '../../helpers/featureCollection'
import { editorMapConfig } from '../../config/editorMapConfig'
import getBoundsCoords from '../../helpers/getBoundsCoords'

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
    type: {
      type: String,
      default: () => ''
    },
    form: {
      type: Object,
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
    this.controls.resetScene(false)
    if (this.scene.features.list.length) {
      this.handleRecreateDraw()
    }

    this.handleSetMapSources()
    bus.$on(`${EDITOR_LOAD_DRAW}`, this.handleRecreateDraw)
    bus.$on(`${EDITOR_FILE_CONVERTED}`, this.handleFileConverted)
    bus.$on(`${EDITOR_SET_FEATURES}`, this.handleMapFormFeatureSelection)
  },
  beforeDestroy() {
    if (this.scene.features.list.length) {
      this.controls.resetScene(true)
    }
  },
  methods: {
    handleSetMapSources() {
      let vm = this
      this.map.on('load', function() {
        for (let source of editorMapConfig.sources) {
          vm.map.addSource(source, {
            type: 'geojson',
            data: fCollectionFormat()
          })
        }
        vm.addMapLayers(vm.map)
      })
    },
    addMapLayers(map) {
      for (let layer of editorMapConfig.layers) {
        map.addLayer(layer)
      }
    },
    async handleFileConverted(fc) {
      if (!fc.features.length) return

      await this.draw.set(fc)
      await this.handleZoomToFeature(fc)
      return await this.$store.dispatch('editor/setList', fc.features)
    },
    async handleMapFormFeatureSelection({ t, fc, removeLoadState }) {
      if (!this.map) return
      await setTimeout(async () => {
        const source = this.map.getSource(
          `${t == 'subsea' || t == 'terrestrials' ? 'cables' : t}-source`
        )

        if (!fc.features) {
          fc = fCollectionFormat(fc)
        }

        if (source) await source.setData(fc)
        if (removeLoadState) {
          await this.$store.dispatch('editor/toggleMapFormLoading', false)
        }
      }, 10)
    },
    async handleZoomToFeature(fc) {
      if (fc.features.length <= 0) return
      let coords = []

      // Need to differentiate between points features
      // And Lines,Polygons for getting the right bbox coords
      {
        let fCollection = Array.from(fc.features)
        const isPoint = this.type == 'cls' || this.type == 'facilities'
        if (isPoint) {
          coords = fCollection[0].geometry.coordinates
        } else {
          coords = fCollection.flatMap(ft => ft.geometry.coordinates)
        }
      }

      const bbox = getBoundsCoords(coords)
      const zoomLevel = this.type == 'facilities' ? 16.8 : 4

      await this.map.fitBounds(bbox, {
        zoom: zoomLevel,
        animate: true,
        speed: 1.75,
        padding: 90,
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

      this.dialog.mode == 'create'
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
        maxZoom: 17.8,
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
        type: this.type,
        scene: this.scene,
        $dispatch: this.$store.dispatch,
        handleEditFeatureProperties: feat => {
          this.dialog.mode = 'edit'
          this.dialog.visible = true
          this.dialog.selectedFeature = feat
        },
        handleBeforeFeatureCreation: feat => {
          this.dialog.selectedFeature = feat
          feat.geometry.type !== 'Point'
            ? (this.dialog.visible = true)
            : this.handleDialogData({ name: '' })
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
    async handleRecreateDraw(feats) {
      // Deleting everything in case there's something already drawn that could be repeted
      await this.draw.trash()
      const featuresCollection = fCollectionFormat(
        JSON.parse(JSON.stringify(this.scene.features.list))
      )
      const featuresID = this.draw.set(featuresCollection)

      if (
        featuresCollection.features.length > 0 &&
        !featuresCollection.features[0].id
      ) {
        this.$store.dispatch(
          'editor/setList',
          this.setFeaturesID(featuresCollection, featuresID)
        )
      }

      return await this.handleZoomToFeature(
        feats ? fCollectionFormat(feats) : featuresCollection
      )
    },
    setFeaturesID(fc, ids = []) {
      return fc.features.map((ft, i) => {
        if (ids.length > 0) {
          ft.id = ids[i]
        }
        return ft
      })
    },
    handleDrawSelectionChange(e) {
      if (e.features.length <= 0) return
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
      return this.map.setStyle(dark ? mapConfig.darkBasemap : mapConfig.default)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/editor-styles.scss';
</style>
