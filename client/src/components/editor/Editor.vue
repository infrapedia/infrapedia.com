<template>
  <div
    :class="{ dnd: drag.hover }"
    class="map-editor-wrapper transition-all"
    @drop.prevent="onDrop"
    @dragover.prevent="() => (drag.hover = true)"
    @dragleave.prevent="() => (drag.hover = false)"
  >
    <div id="map" />
    <div class="overlay" v-if="type == 'map'" :class="{ dark }">
      <span class="fs-small">
        Geojson files dropped here, will be imported into the map.
      </span>
    </div>
    <input ref="file" type="file" class="hidden" />
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
      :categories="categoriesList"
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
import debounce from '../../helpers/debounce'
import { getGeometries } from '../../helpers/getGeoms'
import {
  zoomToFeature,
  setFeaturesIntoDataSource,
  setFeaturesIntoDrawnDataSource,
  categoryDataChange
} from './index'

export default {
  components: {
    PropertiesDialog
  },
  data: () => ({
    map: null,
    draw: null,
    drag: {
      file: null,
      hover: false
    },
    infoBox: {
      lat: mapConfig.center[1],
      lng: mapConfig.center[0],
      zoom: mapConfig.zoom
    },
    scene: {
      features: {
        list: [],
        selected: null,
        layerFiltered: null
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
      default: () => '',
      validator: function(t) {
        return (
          [
            'cls',
            'map',
            'ixps',
            'subsea',
            'facilities',
            'terrestrial-network'
          ].indexOf(t) != -1
        )
      }
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
    categoriesList() {
      return this.categories.map(item => ({
        _id: item._id,
        name: item.name,
        types: item.types,
        color: item.color,
        'stroke-width': item['stroke-width'],
        'stroke-style': item['stroke-style'],
        'stroke-opacity': item['stroke-opacity']
      }))
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
    bus.$on('drawn-features-dnd', this.handleDragAndDropGeojsonFiles)
  },
  mounted() {
    this.map = this.handleSetMapSources(this.addMapEvents(this.createMap()))
    this.toggleDarkMode(this.dark)
    this.controls.resetScene()

    if (this.scene.features.list.length > 0) {
      this.handleGetFeatures()
    }
  },
  beforeDestroy() {
    if (process.env == 'production' && this.scene.features.list.length) {
      this.controls.resetScene(true)
    }
    bus.$off(`${EDITOR_SET_FEATURES_LIST}`, this.handleSetFeaturesList)
    bus.$off(`${EDITOR_LOAD_DRAW}`, this.handleRecreateDraw)
    bus.$off(`${EDITOR_FILE_CONVERTED}`, this.handleFileConverted)
    bus.$off(`${EDITOR_SET_FEATURES}`, this.handleMapFormFeatureSelection)
    bus.$off(`${EDITOR_GET_FEATURES_LIST}`, this.handleGetFeatures)
    bus.$off('categories-field-values-change', this.handleCategoriesChange)
    bus.$off('category-removed', this.handleCategoryRemoved)
    bus.$off('drawn-features-dnd', this.handleDragAndDropGeojsonFiles)
  },
  methods: {
    handleDragAndDropGeojsonFiles(fc) {
      let list = []
      let cat = null
      const categories = []

      for (let feature of fc.features) {
        for (let category of this.categories) {
          if (
            feature.properties &&
            feature.properties.category &&
            feature.properties.category._id == category._id
          ) {
            cat = { ...category }

            if (
              feature.geometry.type == 'Point' &&
              cat.types.includes('custom points')
            ) {
              cat.data['custom points'].push(feature)
            } else if (
              feature.geometry.type == 'LineString' &&
              cat.types.includes('custom lines')
            ) {
              cat.data['custom lines'].push(feature)
            } else if (
              feature.geometry.type == 'Polygon' &&
              cat.types.includes('custom polygons')
            ) {
              cat.data['custom polygons'].push(feature)
            }
            categories.push(cat)
          }
        }
        list.push(this.handleCreateFeature(feature))
      }

      cat = null
      this.handleSetFeaturesList([...this.scene.features.list, ...list])

      if (categories.length > 0) {
        this.categories.forEach((category, i) => {
          for (let cat of categories) {
            if (cat._id == category._id) {
              this.categories[i] = { ...cat }
            }
          }
        })
        this.handleCategoriesChange(this.categories)
      } else {
        this.handleRecreateDraw(fc.features, false)
      }
    },
    onDrop(e) {
      this.drag.hover = false
      if (this.type != 'map') return

      const fr = new FileReader()
      fr.onload = function() {
        const file = { ...JSON.parse(fr.result) }
        bus.$emit('drawn-features-dnd', file)
      }
      if (e.dataTransfer.files.length > 0) {
        fr.readAsText(e.dataTransfer.files[0])
      }
    },
    async handleCategoryRemoved(category) {
      const sourceName = `${category._id}--source`
      if (this.map.getSource(sourceName)) {
        this.map.getSource(sourceName).setData(fCollectionFormat())
      }
    },
    async handleCategoriesChange(list) {
      this.categories = list
      const paintCategories = async () => {
        if (list.length > 0) {
          try {
            this.$store.dispatch('editor/toggleMapFormLoading', true)
            const dataKeys = Object.keys(list[0].data)
            const data = fCollectionFormat()
            for (let category of list) {
              for (let key of dataKeys) {
                if (!category.data[key].length) continue

                if (!key.includes('custom')) {
                  let dat = await getGeometries(
                    key,
                    category.data[key].map(item => item._id),
                    await this.$auth.getUserID()
                  )
                  data.features.push(dat.features)
                } else {
                  data.features.push(category.data[key])
                }
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
          } catch (err) {
            console.error(err)
          }
        }
      }

      this.map.loaded()
        ? await paintCategories()
        : setTimeout(() => paintCategories(), 120)
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
      let vm = this
      let colorProp = ''
      const map = this.map
      let labelLayoutProp = null
      let layerName = `${category._id}--layer`
      const sourceName = layerName.replace('--layer', '--source')

      switch (category.t.toLowerCase()) {
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
        case 'custom points':
          type = 'points'
          colorProp = 'circle-color'
          layerName = layerName + '-' + type
          break
        case 'custom polygons':
          type = 'buildings'
          colorProp = 'fill-extrusion-color'
          layerName = layerName + '-' + type
          break
        default:
          type = 'cables'
          colorProp = 'line-color'
          labelLayoutProp = [
            ['symbol-placement', 'line'],
            ['text-offset', [0, -0.1]]
          ]
          layerName = layerName + '-' + type
          break
      }
      const layer = { ...customMapLayerTypes[type] }

      layer.id = layerName
      layer.source = sourceName
      layer.paint[colorProp] = category.color

      if (!map.getLayer(layerName)) {
        const labelLayer = { ...customMapLayerTypes.label }
        const labelLayerName = `${category._id}--layer--label`
        map.addLayer(layer)

        map.on('click', layer.id, function(e) {
          vm.handleFeatureSelection({
            e,
            map,
            layerID: layer.id,
            drawn: category.t.includes('custom')
          })
        })
        // eslint-disable-next-line
        map.on('mouseenter', layer.id, function(e) {
          map.getCanvas().style.cursor = 'pointer'
        })
        // eslint-disable-next-line
        map.on('mouseleave', layer.id, function(e) {
          map.getCanvas().style.cursor = ''
        })

        if (!map.getLayer(labelLayerName)) {
          labelLayer.id = labelLayerName
          labelLayer.source = sourceName
          labelLayer.filter = layer.filter

          if (labelLayoutProp) {
            labelLayer.layout[labelLayoutProp[0][0]] = labelLayoutProp[0][1]
            labelLayer.layout[labelLayoutProp[1][0]] = labelLayoutProp[1][1]
          }
          if (type == 'points') labelLayer.layout['text-field'] = '{name}'
          map.addLayer(labelLayer)
        }
      } else {
        map.setPaintProperty(layerName, colorProp, category.color)
      }
    },
    handleGetFeatures() {
      this.$emit('features-list-change', this.scene.features.list)
    },
    handleSetFeaturesList(list) {
      this.scene.features.list = list
    },
    async handleFileConverted(fc) {
      if (!fc.features.length) return

      try {
        const fc_final = fCollectionFormat([
          ...fc.features,
          ...this.scene.features.list
        ])
        setFeaturesIntoDataSource({
          list: fc_final.features,
          map: this.map
        })
        await zoomToFeature({ fc: fc_final, map: this.map, type: this.type })
      } catch (err) {
        console.error(err)
      }
    },
    // I have to create a source layer for each category
    // And then ask for the featureCollection
    async handleMapFormFeatureSelection({ t, fc }) {
      if (!this.map) return

      const sourceName = 'nondrawn-features'
      if (
        this.map.getSource(sourceName) &&
        this.map.isSourceLoaded(sourceName)
      ) {
        const source = this.map.getSource(sourceName)
        if (!fc.features) fc = fCollectionFormat(fc)

        source.setData(fc)
        this.$store.dispatch('editor/toggleMapFormLoading', false)
      } else {
        setTimeout(() => {
          this.$store.dispatch('editor/toggleMapFormLoading', true)
          this.handleMapFormFeatureSelection({ t, fc })
        }, 620)
      }
    },
    handleDialogData(data) {
      this.dialog.visible = false
      if (data) {
        const feature = {
          ...JSON.parse(JSON.stringify(this.dialog.selectedFeature))
        }

        feature.properties = {
          ...feature.properties,
          ...data
        }

        const ftWithMetadata =
          this.dialog.mode == 'create'
            ? this.handleCreateFeature(feature)
            : this.handleEditFeatProps(feature, this.scene.features.list)

        if (this.dialog.mode == 'create') {
          this.scene.features.list.push(ftWithMetadata)
        }
        this.handleCategoriesChange(
          categoryDataChange(this.categories, ftWithMetadata)
        )
      }

      this.controls.resetScene()
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
      this.draw = new MapboxDraw({
        displayControlsDefault: false
      })

      this.controls = new EditorControls({
        draw: this.draw,
        map: map,
        type: this.type,
        scene: this.scene,
        handleEditFeatureProperties: ({ feat, isGeomEdit = false }) => {
          if (isGeomEdit) {
            this.handleEditFeatProps(feat, this.scene.features.list)
            this.handleCategoriesChange(
              categoryDataChange(this.categories, feat)
            )
          } else {
            this.dialog.mode = 'edit'
            this.dialog.visible = true
            this.dialog.selectedFeature = feat
          }
        },
        handleCategoriesChange: ({ feature, isDelete }) => {
          this.handleCategoriesChange(
            categoryDataChange(this.categories, feature, isDelete)
          )
        },
        handleSetFeaturesIntoDataSource: args => {
          setFeaturesIntoDrawnDataSource(args)
          if (args.reset) setFeaturesIntoDataSource(args)
        },
        handleBeforeFeatureCreation: feat => {
          this.dialog.selectedFeature = feat
          this.dialog.visible = true
          // feat.geometry.type != 'Point'
          // ? (this.dialog.visible = true)
          // : this.handleDialogData({ name: '' })
        }
      })

      map.addControl(this.controls)
      map.addControl(this.draw)
      return map
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
    addMapEvents(map) {
      const vm = this
      map.on('load', function() {
        // ---------------------------------------------------------------------------------------
        // ---------------------------------------------------------------------------------------
        // map.on('draw.selectionchange', vm.handleDrawSelectionChange)
        // ---------------------------------------------------------------------------------------
        // ---------------------------------------------------------------------------------------
        map.on('mousemove', function(e) {
          const coords = e.lngLat.wrap()
          vm.infoBox.lat = coords.lat.toFixed(5)
          vm.infoBox.lng = coords.lng.toFixed(5)
        })

        map.on('zoom', function() {
          vm.infoBox.zoom = map.getZoom().toFixed(5)
        })

        for (let layer of editorMapConfig.layers) {
          map.on('click', layer.id, function(e) {
            vm.handleFeatureSelection({
              e,
              map,
              layerID: layer.id,
              drawn: !layer.id.includes('nondrawn')
            })
          })
          // eslint-disable-next-line
          map.on('mouseenter', layer.id, function(e) {
            map.getCanvas().style.cursor = 'pointer'
          })
          // eslint-disable-next-line
          map.on('mouseleave', layer.id, function(e) {
            map.getCanvas().style.cursor = ''
          })
        }
      })
      return map
    },
    handleRecreateDraw: debounce(async function(
      feats,
      zoomTo = true,
      custom = true
    ) {
      const featuresCollection = fCollectionFormat(
        JSON.parse(JSON.stringify(this.scene.features.list))
      )

      setFeaturesIntoDrawnDataSource({
        map: this.map,
        feature: this.type,
        isCustomMap: custom,
        list: feats ? feats : this.scene.features.list
      })

      if (zoomTo) {
        await zoomToFeature({
          fc: feats ? fCollectionFormat(feats) : featuresCollection,
          type: this.type,
          map: this.map
        })
      }
    },
    820),
    handleFeatureSelection({ e, layerID, map, drawn }) {
      const featureSelected = map.queryRenderedFeatures(e.point, {
        layers: [layerID]
      })[0]

      if (this.scene.edition) this.controls.resetScene()

      // TODO: Check againts _id coming from DB
      // Joja needs to finish this first, in order to work
      // console.log(featureSelected)

      if (featureSelected) {
        const idProp = drawn ? '__editorID' : '_id'
        const featureID = featureSelected.properties[idProp]
        const feature = this.scene.features.list.filter(
          feat => feat.properties[idProp] == featureID
        )[0]

        if (!feature) return
        try {
          this.scene.edition = true
          this.scene.features.layerFiltered = layerID
          map.setFilter(layerID, ['!=', ['get', idProp], featureID])
          this.controls.handleDrawSelectionChange(
            JSON.parse(JSON.stringify(feature))
          )
        } catch (err) {
          console.error(err)
        }
      }
    },
    handleCreateFeature(feat) {
      const feature = { ...feat }
      let id = `${feat.properties.name}.${Date.now() + Math.random() * 1.52}`
      feature.__editorID = id
      feature.properties.__editorID = id
      return feature
    },
    handleEditFeatProps(feature, list) {
      for (let i = 0; i < list.length; i++) {
        let feat = list[i]
        if (
          feat.__editorID == feature.properties.__editorID ||
          feat.properties.__editorID == feature.properties.__editorID
        ) {
          this.scene.features.list[i] = { ...feature }
          break
        }
      }
      return feature
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
