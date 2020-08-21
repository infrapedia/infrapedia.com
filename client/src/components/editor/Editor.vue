<template>
  <div
    :class="{ dnd: drag.hover, 'custom-map': type == 'map' }"
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
      :feature="dialog.selectedFeature"
      @close="$emit(`properties-dialog-close-${dialog.mode}`, $event)"
    />
  </div>
</template>

<script>
import { bus } from '../../helpers/eventBus'
import EditorControls from './editorControls'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
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
import {
  zoomToFeature,
  toggleDarkMode,
  setFeatureEditorID,
  setFeaturesIntoDataSource,
  updateDrawnFeatureDataSource,
  setFeaturesIntoDrawnDataSource
} from './index'
import Dictionary from '../../lib/Dictionary'
import { categoriesDictionary } from '../userCreationForms/fields/dictionary'
import { getGeometries } from '../../services/api'

const onlyOneFeatureAllowed = ['cls', 'ixps']

export default {
  components: {
    PropertiesDialog: () => import('./propertiesDialog')
  },
  data: () => ({
    map: null,
    draw: null,
    sceneDictionary: null,
    categoriesDictionary: null,
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
      layerFiltered: null,
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
    dark(dark) {
      toggleDarkMode({ dark, map: this.map })
    },
    scene: {
      handler(scene) {
        this.controls.updateControls(scene)
      },
      deep: true
    }
  },
  created() {
    this.sceneDictionary = new Dictionary()
    this.categoriesDictionary = categoriesDictionary

    bus.$on(`${EDITOR_SET_FEATURES_LIST}`, this.handleSetFeaturesList)
    bus.$on(`${EDITOR_LOAD_DRAW}`, this.handleRecreateDraw)
    bus.$on(`${EDITOR_FILE_CONVERTED}`, this.handleFileConverted)
    bus.$on(`${EDITOR_SET_FEATURES}`, this.handleMapFormFeatureSelection)
    bus.$on(`${EDITOR_GET_FEATURES_LIST}`, this.handleGetFeatures)
    // CATEGORIES RELATED EVENTS
    {
      bus.$on('category-removed', this.handleCategoryRemoved)
      this.$on('drawn-features-dnd', this.handleDragAndDropGeojsonFiles)
      this.categoriesDictionary.on(
        'storage--changed',
        this.handleCategoriesChange
      )
      this.categoriesDictionary.on(
        'storage--item-added',
        this.handleCategoryChange
      )
      this.categoriesDictionary.on(
        'storage--item-updated',
        this.handleCategoryChange
      )
    }
  },
  async mounted() {
    this.map = this.handleSetMapSources(
      this.addMapEvents(await this.createMap())
    )
    toggleDarkMode({ dark: this.dark, map: this.map })
    this.controls.resetScene()

    // if (this.scene.list.length > 0) {
    //   this.handleGetFeatures()
    // }
  },
  beforeDestroy() {
    this.sceneDictionary.reset()
    this.categoriesDictionary.reset()

    bus.$off(`${EDITOR_SET_FEATURES_LIST}`, this.handleSetFeaturesList)
    bus.$off(`${EDITOR_LOAD_DRAW}`, this.handleRecreateDraw)
    bus.$off(`${EDITOR_FILE_CONVERTED}`, this.handleFileConverted)
    bus.$off(`${EDITOR_SET_FEATURES}`, this.handleMapFormFeatureSelection)
    bus.$off(`${EDITOR_GET_FEATURES_LIST}`, this.handleGetFeatures)

    // CATEGORIES RELATED EVENTS
    {
      bus.$off('category-removed', this.handleCategoryRemoved)
      this.$off('drawn-features-dnd', this.handleDragAndDropGeojsonFiles)
      this.categoriesDictionary.off(
        'storage--changed',
        this.handleCategoriesChange
      )
      this.categoriesDictionary.off(
        'storage--item-added',
        this.handleCategoryChange
      )
      this.categoriesDictionary.off(
        'storage--item-updated',
        this.handleCategoryChange
      )
    }
  },
  methods: {
    async handleDragAndDropGeojsonFiles(fc) {
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
        list.push(setFeatureEditorID(feature))
      }

      cat = null
      this.handleSetFeaturesList([
        ...this.sceneDictionary.getCollectionList(),
        ...list
      ])

      if (categories.length > 0) {
        this.handleCategoriesChange(categories)
      } else {
        this.handleRecreateDraw(fc.features, false)
      }
    },
    onDrop(e) {
      this.drag.hover = false
      if (this.type != 'map') return

      const fr = new FileReader()
      let vm = this
      fr.onload = function() {
        const file = { ...JSON.parse(fr.result) }
        vm.$emit('drawn-features-dnd', file)
      }
      if (e.dataTransfer.files.length > 0) {
        fr.readAsText(e.dataTransfer.files[0])
      }
    },
    async handleCategoryRemoved(categoryID) {
      const sourceName = `${categoryID}--source`
      if (this.map.getSource(sourceName)) {
        this.map.getSource(sourceName).setData(fCollectionFormat())
      }
    },
    async handleCategoryChange(category) {
      this.$store.dispatch('editor/toggleMapFormLoading', true)
      try {
        let userID = await this.$auth.getUserID()
        let updateDrawnFeatures = false
        const features = []
        let res = null

        for (let key in category.data) {
          if (!key.includes('custom')) {
            let ids = Object.keys(category.data[key])
            console.log(ids)
            if (ids.length > 0) {
              res = await getGeometries(key, ids, userID)
              if (res && res.features) {
                features.push(res.features)
              }
            }
          } else if (Object.keys(category.data[key]).length > 0) {
            updateDrawnFeatures = true
          }
        }

        await this.handleSetCategorySource({
          _id: category._id,
          name: category.name,
          color: category.color,
          data: fCollectionFormat(features.flat())
        })

        for (let t of category.types) {
          if (!Object.keys(category.data[t]).length) continue
          this.handleSetCategoryLayers({ ...category, t })
        }

        if (updateDrawnFeatures) {
          await updateDrawnFeatureDataSource(
            this.map,
            this.sceneDictionary.getCollectionList()
          )
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.$store.dispatch('editor/toggleMapFormLoading', false)
      }
    },
    async handleCategoriesChange(data) {
      for await (let category of data) {
        await this.handleCategoryChange(category)
      }
    },
    async handleSetCategorySource(category) {
      if (this.map && this.map.loaded()) {
        const sourceName = `${category._id}--source`
        if (!this.map.getSource(sourceName)) {
          this.map.addSource(sourceName, {
            type: 'geojson',
            data: category.data
          })
        } else {
          this.map.getSource(sourceName).setData(category.data)
        }
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
          type = 'points'
          colorProp = 'circle-color'
          layerName = layerName + '-' + type
          break
        case 'custom points':
          type = 'points'
          colorProp = 'circle-color'
          layerName = layerName + '-' + type
          break
        case 'custom polygons':
          type = 'points'
          colorProp = 'circle-color'
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

      if (category.t.includes('custom')) {
        map.on('click', layer.id, function(e) {
          vm.handleFeatureSelection({
            e,
            map,
            drawn: true,
            layerID: layer.id
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
    },
    handleGetFeatures() {
      this.$emit(
        'features-list-change',
        this.sceneDictionary.getCollectionList()
      )
    },
    handleSetFeaturesList(list) {
      let r = {}
      for (let item of list) {
        r[item._id ? item._id : item.__editorID] = item
      }
      this.sceneDictionary.set(r)
    },
    async handleFileConverted(fc) {
      if (!fc.features.length) return

      try {
        const fc_final = fCollectionFormat([
          ...fc.features,
          ...this.sceneDictionary.getCollectionList()
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
    // And then ask for each featureCollection
    async handleMapFormFeatureSelection({ t, fc }) {
      if (!this.map) return

      console.log(t)

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
    async setPropertiesDialogEditMode() {
      this.dialog.mode = 'edit'
      this.scene.edition = true
      this.scene.creation = null
      this.dialog.visible = true
      this.$once(
        `properties-dialog-close-${this.dialog.mode}`,
        await this.handleDialogData
      )
    },
    async handleDialogData(data) {
      this.dialog.visible = false
      if (data) {
        const featuresSelected = this.draw.getSelected().features
        if (featuresSelected && featuresSelected.length) {
          const feature = {
            ...JSON.parse(JSON.stringify(featuresSelected[0]))
          }
          feature.properties = { ...data }
          // This adds the __editorID property with which I keep track of it
          const ftWithMetadata =
            this.dialog.mode == 'create'
              ? setFeatureEditorID(feature)
              : this.updateSceneDictionaryFeature(feature)
          // Then I do can add it into the dictionary
          if (this.dialog.mode == 'create') {
            this.sceneDictionary.add(ftWithMetadata.__editorID, ftWithMetadata)
          }

          await this.handleUpdateMapSourcesData(
            ftWithMetadata,
            this.sceneDictionary.getCollectionList()
          )
        }
      }

      await this.handleResetScene({
        reset: false,
        removeFilter: this.dialog.mode != 'create'
      })
      this.dialog = {
        visible: false,
        mode: 'create',
        selectedFeature: {}
      }
    },
    async handleUpdateMapSourcesData(feature, list) {
      if (!feature || !feature.properties.category) {
        await updateDrawnFeatureDataSource(this.map, list)
        return
      }

      /// THIS PART IS FOR DRAWN FEATURES THAT ARE BEING ASSIGNED A CATEGORY
      const category = this.categoriesDictionary.get(
        typeof feature.properties.category == 'string'
          ? feature.properties.category
          : feature.properties.category._id
      )
      const featureType = feature.geometry.type.toLowerCase()
      const types = category
        ? category.types.filter(t => t.includes('custom'))
        : []
      const customType = `custom ${
        featureType == 'linestring'
          ? 'lines'
          : featureType == 'building'
          ? 'polygons'
          : featureType == 'point'
          ? 'points'
          : featureType
      }`

      if (types.includes(customType)) {
        category.data[customType][feature.properties.__editorID] = feature
        this.categoriesDictionary.update(category._id, category)
        this.handleCategoryChange(category)
      }
    },
    async createMap() {
      mapboxgl.accessToken = mapConfig.mapToken

      const map = new mapboxgl.Map({
        container: 'map',
        maxZoom: 17.8,
        zoom: mapConfig.zoom,
        center: mapConfig.center,
        style: mapConfig.default
      })

      const scaleCtrl = await new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      })
      map.addControl(scaleCtrl, 'top-left')
      map.addControl(new mapboxgl.NavigationControl())
      map.addControl(new mapboxgl.FullscreenControl())

      this.draw = await new MapboxDraw({
        displayControlsDefault: false
      })

      this.controls = await new EditorControls({
        map: map,
        draw: this.draw,
        type: this.type,
        scene: this.scene
      })

      this.controls.on('confirm', this.handleConfirmAction)
      this.controls.on('draw', () => (this.scene.creation = true))
      this.controls.on('reset-scene', await this.handleResetScene)
      this.controls.on('delete-feature', await this.handleDeleteFeature)
      this.controls.on('update-feature', await this.handleFeatureEdition)
      this.controls.on(
        'update-feature-properties',
        await this.setPropertiesDialogEditMode
      )

      map.addControl(this.controls)
      map.addControl(this.draw)
      return map
    },
    async handleBeforeCreateFeature(feature) {
      this.dialog.selectedFeature = feature

      if (feature.geometry.type != 'Point') {
        this.dialog.visible = true
        this.$once(
          `properties-dialog-close-${this.dialog.mode}`,
          await this.handleDialogData
        )
      } else await this.handleDialogData({ name: '' })
    },
    handleConfirmAction(features) {
      if (!features) return

      const { creation } = this.scene
      if (!creation && this.scene.edition) {
        this.handleFeatureEdition({ ...features[0] })
      } else {
        if (features && features.length > 0) {
          if (
            onlyOneFeatureAllowed.includes(this.type) &&
            this.dictionary.getLength() > 0
          ) {
            return
          }

          this.handleBeforeCreateFeature({ ...features[0] })
        }
      }
    },
    async handleResetScene({ reset, removeFilter }) {
      this.draw.changeMode(this.draw.modes.SIMPLE_SELECT)
      this.draw.set(fCollectionFormat())
      this.scene = {
        layerFiltered: this.scene.layerFiltered,
        edition: null,
        creation: null
      }

      if (reset) {
        this.sceneDictionary.reset()
        if (this.type == 'map') {
          bus.$emit('categories-field-reset-datasets')
        }
        await this.handleUpdateMapSourcesData(false, [])
      }

      if (removeFilter && this.scene.layerFiltered) {
        const layerFiltered = this.scene.layerFiltered
        this.map.setFilter(layerFiltered.name, layerFiltered.filter)
        this.scene.layerFiltered = null
      }
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
        const drawnLayers = editorMapConfig.layers.filter(
          t => !t.id.includes('nondrawn')
        )
        for (let layer of drawnLayers) {
          map.on('click', layer.id, function(e) {
            vm.handleFeatureSelection({
              e,
              map,
              layerID: layer.id
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
        JSON.parse(JSON.stringify(this.sceneDictionary.getCollectionList()))
      )
      await setFeaturesIntoDrawnDataSource({
        map: this.map,
        feature: this.type,
        isCustomMap: custom,
        list: feats ? feats : this.sceneDictionary.getCollectionList()
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
    handleFeatureSelection: debounce(function setFeatureSelection({
      e,
      layerID,
      map
    }) {
      if (layerID.includes('label')) return

      const featureSelected = map.queryRenderedFeatures(e.point, {
        layers: [layerID]
      })[0]

      if (this.scene.edition) {
        this.controls.resetScene({ reset: false, removeFilter: true })
      }

      if (featureSelected) {
        const idProp = featureSelected.properties.__editorID
          ? '__editorID'
          : '_id'
        const featureID = featureSelected.properties[idProp]
        const feature = this.sceneDictionary.get(featureID)

        if (feature) {
          try {
            let layerType = layerID.includes('--')
              ? layerID.split('--')[1].split('-')[1]
              : layerID.split('-')[1]
            switch (layerType.toLowerCase()) {
              case 'ixps':
                layerType = 'points'
                break
              case 'cls':
                layerType = 'points'
                break
              case 'facilities':
                layerType = 'points'
                break
              default:
                layerType = 'cables'
                break
            }

            let filter = [
              'all',
              customMapLayerTypes[layerType].filter,
              ['!=', `${idProp}`, featureID]
            ]

            map.setFilter(layerID, filter)
            this.scene.layerFiltered = {
              name: layerID,
              filter: customMapLayerTypes[layerType].filter
            }

            this.scene.edition = true
            this.scene.creation = false
            this.dialog.selectedFeature = JSON.parse(JSON.stringify(feature))
            this.draw.changeMode('simple_select', {
              featureIds: this.draw.add(feature)
            })
          } catch (err) {
            console.error(err)
          }
        }
      }
    },
    320),
    updateSceneDictionaryFeature(feature) {
      const idProp = feature.properties.__editorID ? '__editorID' : '_id'
      this.sceneDictionary.update(feature.properties[idProp], feature)
      return feature
    },
    async handleFeatureEdition(feature) {
      const ftUpdated = this.updateSceneDictionaryFeature(feature)
      await this.handleUpdateMapSourcesData(
        ftUpdated,
        this.sceneDictionary.getCollectionList()
      )
      await this.handleResetScene({
        reset: false,
        removeFilter: this.scene.edition
      })
    },
    async handleDeleteFeature(features) {
      for (let feature of features) {
        this.sceneDictionary.remove(feature.properties.__editorID)
        await this.handleUpdateMapSourcesData(
          feature,
          this.sceneDictionary.getCollectionList()
        )
        await this.handleResetScene({
          reset: false,
          removeFilter: this.scene.edition
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/editor-styles.scss';
</style>
