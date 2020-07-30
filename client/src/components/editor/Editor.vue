<template>
  <div class="map-editor-wrapper">
    <div id="map" />
    <div class="absolute coords-box z-index20 p2 w25">
      <p class="m0"><strong>Lat:</strong> {{ infoBox.lat }}</p>
      <p class="m0 mt1"><strong>Lng:</strong> {{ infoBox.lng }}</p>
      <p class="m0 mt1"><strong>Zoom:</strong> {{ infoBox.zoom }}</p>
    </div>
    <div
      class="absolute information-box z-index20 p2 ml5 text-left"
      :class="{ dark }"
    >
      <p class="m0" v-if="oneClickMessage.length == 1">
        {{ oneClickMessage[0] }}
      </p>
      <template v-else-if="oneClickMessage.length == 2">
        <p class="m0" v-html="oneClickMessage[0]" />
        <p class="m0 mt1 inline-block" v-html="oneClickMessage[1]" />
      </template>
      <p class="m0 mt1" v-if="type != 'facilities'">
        {{ doubleClickMessage[0] }}
      </p>
      <span class="inline-block ml1" v-else>
        {{ doubleClickMessage[0] }}
      </span>
    </div>
    <properties-dialog
      :mode="dialog.mode"
      :type="type"
      :creation-form="form"
      :is-visible="dialog.visible"
      :categories="categories"
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
  EDITOR_FILE_CONVERTED,
  EDITOR_GET_FEATURES_LIST,
  EDITOR_SET_FEATURES_LIST
} from '../../events/editor'
import { fCollectionFormat } from '../../helpers/featureCollection'
import {
  editorMapConfig,
  customMapLayerTypes
} from '../../config/editorMapConfig'
import bbox from '@turf/bbox'
import debounce from '../../helpers/debounce'
import { getGeometries } from '../../helpers/getGeoms'

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
    scene: {
      features: {
        list: [],
        selected: null
      },
      creation: null,
      edition: null
    },
    controls: null,
    categories: [],
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
    oneClickMessage() {
      let msg = []
      switch (this.type) {
        case 'ixps':
          msg = [
            'Click once to edit the properties of the IXP or change its position'
          ]
          break
        case 'cls':
          msg = [
            'Click once to edit the properties of the CLS or change its position'
          ]
          break
        case 'facilities':
          msg = [
            '<strong>Points:</strong> Click once to edit the properties of the Facility or change its position',
            '<strong>Polygons:</strong> Click once to edit the properties of a segment.'
          ]
          break
        default:
          msg = ['Click once to edit the properties of a segment.']
          break
      }
      return msg
    },
    doubleClickMessage() {
      let msg = []
      switch (this.type) {
        case 'subsea':
          msg = ['Click twice to edit the shape of a segment.']
          break
        case 'terrestrial-network':
          msg = ['Click twice to edit the shape of a segment.']
          break
        default:
          msg = []
          break
      }
      return msg
    }
  },
  watch: {
    dark(bool) {
      this.toggleDarkMode(bool)
    },
    scene: {
      handler(newState) {
        this.controls.updateControls(newState)
      },
      deep: true
    },
    'scene.features.list'(list) {
      this.$emit('features-list-change', list)
    }
  },
  created() {
    bus.$on(`${EDITOR_SET_FEATURES_LIST}`, this.handleSetFeaturesList)
    bus.$on(`${EDITOR_LOAD_DRAW}`, this.handleRecreateDraw)
    bus.$on(`${EDITOR_FILE_CONVERTED}`, this.handleFileConverted)
    bus.$on(`${EDITOR_SET_FEATURES}`, this.handleMapFormFeatureSelection)
    bus.$on(`${EDITOR_GET_FEATURES_LIST}`, this.handleGetFeatures)
    bus.$on('categories-field-values-change', this.handleCategoriesChange)
    bus.$on('category-removed', this.handleCategoryRemoved)
  },
  mounted() {
    this.map = this.handleSetMapSources(this.addMapEvents(this.createMap()))
    this.toggleDarkMode(this.dark)
    this.controls.resetScene(false)

    if (this.scene.features.list.length > 0) {
      this.handleGetFeatures()
    }
  },
  beforeDestroy() {
    if (this.scene.features.list.length) {
      this.controls.resetScene(true)
    }
    bus.$off(`${EDITOR_SET_FEATURES_LIST}`, this.handleSetFeaturesList)
    bus.$off(`${EDITOR_LOAD_DRAW}`, this.handleRecreateDraw)
    bus.$off(`${EDITOR_FILE_CONVERTED}`, this.handleFileConverted)
    bus.$off(`${EDITOR_SET_FEATURES}`, this.handleMapFormFeatureSelection)
    bus.$off(`${EDITOR_GET_FEATURES_LIST}`, this.handleGetFeatures)
    bus.$off('categories-field-values-change', this.handleCategoriesChange)
    bus.$off('category-removed', this.handleCategoryRemoved)
  },
  methods: {
    async handleCategoryRemoved(category) {
      const sourceName = `${category._id}--source`
      if (this.map.getSource(sourceName)) {
        this.map.getSource(sourceName).setData(fCollectionFormat())
      }
    },
    async handleCategoriesChange(list) {
      this.categories = list
      // Agregando la data de features collection primero
      // Y luego llamar a setCategoryLayers para crear los layers por color de categoria
      if (list.length > 0) {
        this.$store.dispatch('editor/toggleMapFormLoading', true)
        const dataKeys = Object.keys(list[0].data)
        const data = fCollectionFormat()
        for (let category of list) {
          for (let key of dataKeys) {
            if (!category.data[key].length) continue
            let dat = await getGeometries(
              key,
              category.data[key].map(item => item._id),
              await this.$auth.getUserID()
            )
            data.features.push(dat.features)
          }

          await this.handleSetCategorySource({
            _id: category._id,
            name: category.name,
            color: category.color,
            data: { type: data.type, features: data.features.flat() }
          })
          data.features = []

          for (let type of category.types) {
            if (!category.data[type].length) continue
            this.handleSetCategoryLayers({ ...category, t: type })
          }
        }
        this.$store.dispatch('editor/toggleMapFormLoading', false)
      }
    },
    async handleSetCategorySource(category) {
      const sourceName = `${category._id}--source`
      if (!this.map.getSource(sourceName)) {
        this.map.addSource(sourceName, {
          type: 'geojson',
          data: category.data
        })
      } else {
        this.map.getSource(sourceName).setData(category.data)
      }
    },
    async handleSetCategoryLayers(category) {
      let type = ''
      let colorProp = ''
      let layerName = `${category._id}--layer`
      const sourceName = layerName.replace('--layer', '--source')

      if (category.t == 'subsea cables') {
        category.t = 'subsea_cables'
      }
      switch (category.t) {
        case 'cls':
          type = 'points'
          colorProp = 'circle-color'
          layerName = layerName + '-' + type
          break
        case 'ixps':
          type = 'points'
          colorProp = 'circle-color'
          layerName = layerName + '-' + type
          break
        case 'facilities':
          type = 'buildings'
          colorProp = 'fill-extrusion-color'
          layerName = layerName + '-' + type
          break
        default:
          type = 'cables'
          colorProp = 'line-color'
          layerName = layerName + '-' + type
          break
      }
      const layer = { ...customMapLayerTypes[type] }

      layer.id = layerName
      layer.source = sourceName
      layer.paint[colorProp] = category.color

      !this.map.getLayer(layerName)
        ? this.map.addLayer(layer)
        : this.map.setPaintProperty(layerName, colorProp, category.color)
    },
    handleGetFeatures() {
      this.$emit('features-list-change', this.scene.features.list)
    },
    handleSetFeaturesList(list) {
      this.scene.features.list = list
    },
    handleSetMapSources(map) {
      let vm = this
      map.on('load', function() {
        for (let source of editorMapConfig.sources) {
          map.addSource(source, {
            type: 'geojson',
            data: fCollectionFormat()
          })
        }
        vm.addMapLayers(vm.map)
      })
      return map
    },
    addMapLayers(map) {
      for (let layer of editorMapConfig.layers) {
        map.addLayer(layer)
      }
    },
    async handleFileConverted(fc) {
      if (!fc.features.length) return

      try {
        const fc_final = fCollectionFormat([
          ...fc.features,
          ...this.scene.features.list
        ])
        this.draw.set(fc_final)
        this.scene.features.list = [
          ...this.draw.getAll().features,
          ...this.scene.features.list
        ]
        await this.handleZoomToFeature(fc_final)
      } catch (err) {
        console.error(err)
      }
    },
    // I have to create a source layer for each category
    // And then ask for the featureCollection
    async handleMapFormFeatureSelection({ t, fc, categoryColor }) {
      if (!this.map) return

      const sourceName = `${
        t == 'subsea cables' || t == 'terrestrials' ? 'cables' : t
      }-source`
      const sourceLayer = sourceName.replace('source', 'layer')
      const source = this.map.getSource(sourceName)

      if (!fc.features) fc = fCollectionFormat(fc)
      {
        let circles = ['ixps', 'cls']
        let cables = ['subsea cables', 'terrestrials']

        if (circles.includes(t)) {
          this.map.setPaintProperty(sourceLayer, 'circle-color', categoryColor)
        } else if (cables.includes(t)) {
          this.map.setPaintProperty(sourceLayer, 'line-color', categoryColor)
        } else {
          this.map.setPaintProperty(
            sourceLayer,
            'fill-extrusion-color',
            categoryColor
          )
        }
      }

      source.setData(fc)
      this.$store.dispatch('editor/toggleMapFormLoading', false)
    },
    async handleZoomToFeature(fc) {
      if (fc.features.length <= 0) return

      const bounds = bbox(fc)
      const boundsConfig = {
        animate: true,
        speed: 1.75,
        padding: 90,
        pan: {
          duration: 25
        }
      }
      const zoomLevels = {
        facilities: 16.8,
        ixps: 12.8,
        cls: 14.52
      }

      zoomLevels[this.type] ? (boundsConfig.zoom = zoomLevels[this.type]) : null
      await this.map.fitBounds(bounds, boundsConfig)
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
        // $dispatch: this.$store.dispatch,
        handleEditFeatureProperties: feat => {
          this.dialog.mode = 'edit'
          this.dialog.visible = true
          this.dialog.selectedFeature = feat
        },
        handleBeforeFeatureCreation: feat => {
          this.dialog.selectedFeature = feat
          feat.geometry.type != 'Point'
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
    handleRecreateDraw: debounce(async function(feats, zoomTo = true) {
      // Deleting everything in case there's something already drawn that could be repeted
      // if (this.scene.features.list.length <= 0) return
      await this.draw.trash()
      const featuresCollection = fCollectionFormat(
        JSON.parse(JSON.stringify(this.scene.features.list))
      )
      const featuresID = this.draw.set(featuresCollection)

      if (
        featuresCollection.features.length > 0 &&
        !featuresCollection.features[0].id
      ) {
        this.scene.features.list = this.setFeaturesID(
          featuresCollection,
          featuresID
        )
      }

      if (zoomTo) {
        await this.handleZoomToFeature(
          feats ? fCollectionFormat(feats) : featuresCollection
        )
      }
    }, 820),
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
        feat => feat.id == e.features[0].id
      )
      this.scene.edition = true
      this.controls.handleDrawSelectionChange(featureSelected)
    },
    handleCreateFeature(feat) {
      this.scene.features.list.push(feat)
      this.controls.resetScene()
    },
    handleEditFeatProps(feats) {
      this.scene.features.list.forEach((feat, i) => {
        for (let featEdit of feats) {
          if (feat.id == featEdit.id) {
            this.scene.features.list[i] = { ...featEdit }
          }
        }
      })
      this.controls.resetScene()
    },
    toggleDarkMode(dark) {
      this.map.setStyle(dark ? mapConfig.darkBasemap : mapConfig.default)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/editor-styles.scss';
</style>
