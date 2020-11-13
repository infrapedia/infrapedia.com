<template>
  <div
    :class="{
      dnd: drag.hover,
      'custom-map': true
    }"
    class="map-editor-wrapper transition-all"
    @drop.prevent="onDrop"
    @dragover.prevent="() => (drag.hover = true)"
    @dragleave.prevent="() => (drag.hover = false)"
  >
    <e-header
      :type="type"
      @close-search="closeSearchMode"
      @place-selected="handleSearchPlaceSelected"
      @address-field-activated-by-form="
        $emit('address-field-activated-by-form')
      "
    />
    <div id="map" />
    <input ref="file" type="file" class="hidden" />
    <div class="absolute coords-box z-index20 p2 w25">
      <p class="m0"><strong>Lat:</strong> {{ infoBox.lat }}</p>
      <p class="m0 mt1"><strong>Lng:</strong> {{ infoBox.lng }}</p>
      <p class="m0 mt1"><strong>Zoom:</strong> {{ infoBox.zoom }}</p>
    </div>
    <properties-dialog
      :type="type"
      :mode="dialog.mode"
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
  EDITOR_SET_FEATURES,
  EDITOR_FILE_CONVERTED,
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
  sceneDictionary
} from './index'
import { getGeometries } from '../../services/api'
import { categoriesDictionary } from '../userCreationForms/fields/dictionary'
import elemntTypeValidator from '../../helpers/elemntTypeValidator'
import { booleanEqual, point, lineString, lineSlice } from '@turf/turf'

const onlyOneFeatureAllowed = ['cls', 'ixps']

export default {
  components: {
    PropertiesDialog: () => import('./propertiesDialog'),
    EHeader: () => import('./Header.vue')
  },
  data: () => ({
    map: null,
    draw: null,
    placeMarker: null,
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
      isDynamicControls: false
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
      default: () => '',
      validator: elemntTypeValidator
    },
    form: {
      type: Object,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
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
  async created() {
    sceneDictionary.on('storage--changed', this.handleDrawSceneFeatures)
    window.sceneDictionary = sceneDictionary

    this.$on('drawn-features-dnd', this.handleDragAndDropGeojsonFiles)
    bus.$on(`${EDITOR_SET_FEATURES_LIST}`, this.handleSetSceneFeaturesList)
    bus.$on(`${EDITOR_FILE_CONVERTED}`, this.handleFileConverted)
    bus.$on(`${EDITOR_SET_FEATURES}`, this.handleMapFormFeatureSelection)

    // CATEGORIES RELATED EVENTS
    if (this.type == 'map') {
      this.categoriesDictionary = categoriesDictionary

      {
        bus.$on('category-removed', this.handleCategoryRemoved)
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
    }
  },
  async mounted() {
    this.map = this.handleSetMapSources(
      this.addMapEvents(await this.createMap())
    )
    toggleDarkMode({ dark: this.dark, map: this.map })
    this.controls.resetScene()
  },
  beforeDestroy() {
    sceneDictionary.reset()
    sceneDictionary.off('storage--changed', this.handleDrawSceneFeatures)

    this.$off('drawn-features-dnd', this.handleDragAndDropGeojsonFiles)
    bus.$off(`${EDITOR_SET_FEATURES_LIST}`, this.handleSetSceneFeaturesList)
    bus.$off(`${EDITOR_FILE_CONVERTED}`, this.handleFileConverted)
    bus.$off(`${EDITOR_SET_FEATURES}`, this.handleMapFormFeatureSelection)

    // CATEGORIES RELATED EVENTS
    if (this.type == 'map') {
      this.categoriesDictionary.reset()
      bus.$off('category-removed', this.handleCategoryRemoved)
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
    async handleSearchPlaceSelected(data) {
      if (this.placeMarker) this.placeMarker.remove()
      this.placeMarker = new mapboxgl.Marker({ color: '#1e419a' })
        .setLngLat(data.center)
        .addTo(this.map)
      this.map.fitBounds(
        data.bbox ? data.bbox : [...data.center, ...data.center],
        {
          animate: true,
          zoom: 4.89
        }
      )
    },
    closeSearchMode() {
      if (this.placeMarker) {
        this.placeMarker.remove()
        this.placeMarker = null
      }
    },
    async handleDrawSceneFeatures() {
      await this.handleRecreateDraw(null, false)
      await this.$emit(
        'features-list-change',
        sceneDictionary.getCollectionList()
      )
    },
    async handleDragAndDropGeojsonFiles(fc) {
      // if (this.type != 'map') return
      await this.$store.dispatch('editor/toggleMapFormLoading', true)

      let list = []
      let cat = null
      const categories = []

      fc.features.forEach(feature => {
        if (this.type == 'map') {
          for (let category of this.categoriesDictionary.getCollectionList()) {
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
        }

        if (!feature.properties.editorID) {
          list.push(setFeatureEditorID(feature))
        } else {
          list.push(feature)
        }
      })

      cat = null
      this.handleSetSceneFeaturesList([
        ...sceneDictionary.getCollectionList(),
        ...list
      ])

      if (categories.length > 0 && this.type === 'map') {
        this.handleCategoriesChange(categories)
      } else {
        this.handleRecreateDraw(
          [...fc.features, sceneDictionary.getCollectionList()],
          false
        )
      }
      this.$store.dispatch('editor/toggleMapFormLoading', false)
    },
    onDrop(e) {
      this.drag.hover = false
      // if (this.type != 'map') return

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
          const dataKeys = Object.keys(category.data[key])
          if (!key.includes('custom')) {
            let ids = dataKeys
            if (ids.length > 0) {
              res = await getGeometries(key, ids, userID)
              if (res && res.features) {
                features.push(res.features)
              }
            }
          } else if (dataKeys) {
            // KEEPING CUSTOM ELEMENTS COLOR IN SYNC WITH THE CATEGORY
            for (let dataKey of dataKeys) {
              let customElement = category.data[key][dataKey]

              if (customElement.properties.color != category.color) {
                customElement.properties.color = category.color
                sceneDictionary.update(dataKey, customElement)
              }
            }
            updateDrawnFeatures = true
          }
        }

        await this.handleSetCategorySource({
          _id: category._id,
          name: category.name,
          color: category.color,
          data: fCollectionFormat(features.length > 0 ? features.flat() : [])
        })

        for (let t of category.types) {
          if (!Object.keys(category.data[t]).length) continue
          this.handleSetCategoryLayers({ ...category, t })
        }

        if (updateDrawnFeatures) {
          await updateDrawnFeatureDataSource(
            this.map,
            sceneDictionary.getCollectionList()
          )
        }
      } catch (err) {
        console.error(err)
      } finally {
        setTimeout(() => {
          this.$store.dispatch('editor/toggleMapFormLoading', false)
        }, 320)
      }
    },
    async handleCategoriesChange(data) {
      if (!data || typeof data == 'string' || typeof data == 'number') return

      if (Array.isArray(data)) {
        for await (let category of data) {
          await this.handleCategoryChange(category)
        }
      } else {
        for (let key in data) {
          await this.handleCategoryChange(data[key])
        }
      }
    },
    async handleSetCategorySource(category) {
      if (this.map) {
        const sourceName = `${category._id}--source`
        const source = this.map.getSource(sourceName)

        if (!source) {
          this.map.addSource(sourceName, {
            type: 'geojson',
            data: category.data
          })
        }

        if (source) source.setData(category.data)
        else this.handleSetCategorySource(category)
      }
    },
    async handleSetCategoryLayers(category) {
      let type = ''
      let vm = this
      let colorProp = ''
      const map = this.map
      let labelLayoutProp = null
      let layer = null
      let layerName = `${category._id}--layer`
      const sourceName = layerName.replace('--layer', '--source')

      switch (category.t.toLowerCase()) {
        case 'cls':
          type = 'points'
          colorProp = 'circle-color'
          layerName = layerName + '-' + type
          labelLayoutProp = { 'text-field': '{name}' }
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
          labelLayoutProp = {
            'symbol-placement': 'line',
            'text-offset': [0, -0.1]
          }
          layerName = layerName + '-' + type
          break
      }

      const manageLayers = () => {
        layer = { ...customMapLayerTypes[type] }
        layer.id = layerName
        layer.source = sourceName
        layer.paint[colorProp] = category.color

        const labelLayer = { ...customMapLayerTypes.label }
        const labelLayerName = `${category._id}--layer--label`
        labelLayer.id = labelLayerName
        labelLayer.source = sourceName
        labelLayer.filter = layer.filter

        if (labelLayoutProp) {
          labelLayer.layout = {
            ...labelLayer.layout,
            ...labelLayoutProp
          }
        }

        const mapLayer = map.getLayer(layerName)
        const mapLabelLayer = map.getLayer(labelLayerName)

        if (!mapLayer) {
          map.addLayer(layer)
        } else {
          map.setPaintProperty(layerName, colorProp, category.color)
        }

        if (!mapLabelLayer) {
          map.addLayer(labelLayer)
        } else if (mapLabelLayer && labelLayoutProp) {
          for (let prop in labelLayoutProp) {
            map.setLayoutProperty(
              `${category._id}--layer--label`,
              prop,
              labelLayoutProp[prop]
            )
          }
        }

        if (!mapLayer || !mapLabelLayer) {
          setTimeout(() => manageLayers(), 120)
        }
        return true
      }
      manageLayers()

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
    handleSetSceneFeaturesList(list) {
      let r = {}
      for (let item of list) {
        r[
          item.properties.editorID
            ? item.properties.editorID
            : item.properties._id
        ] = item
      }
      sceneDictionary.set(r)
    },
    async handleFileConverted(fc) {
      if (!fc.features.length) return

      // We are asumming that if the first feature has an editorID
      // All of them have an editorID as well
      if (!fc.features[0].properties.editorID) {
        fc.features.forEach(ft => {
          let ftWithId = setFeatureEditorID(ft)
          sceneDictionary.add(ftWithId.editorID, ftWithId)
        })
      } else {
        await sceneDictionary.setFromCollectionList(fc.features)
      }

      try {
        const fc_final = fCollectionFormat(sceneDictionary.getCollectionList())
        updateDrawnFeatureDataSource(this.map, fc_final.features)
        await zoomToFeature({ fc: fc_final, map: this.map, type: this.type })
      } catch (err) {
        console.error(err)
      }
    },
    async handleMapFormFeatureSelection({ fc }) {
      if (!this.map) return

      this.$store.dispatch('editor/toggleMapFormLoading', true)
      await setFeaturesIntoDataSource({ list: fc.features, map: this.map })
      this.$store.dispatch('editor/toggleMapFormLoading', false)
    },
    async setPropertiesDialogEditMode() {
      this.dialog.mode = 'edit'
      this.scene.isDynamicControls = true
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
          // This adds the editorID property with which I keep track of it
          const ftWithMetadata =
            this.dialog.mode == 'create'
              ? setFeatureEditorID(feature)
              : this.updateSceneDictionaryFeature(feature)

          if (this.type == 'map') {
            const ftCategory = categoriesDictionary.get(
              ftWithMetadata.properties.category
            )
            if (ftCategory) {
              // ftWithMetadata.properties.color = ftCategory.color
              let ftType = ftWithMetadata.geometry.type.toLowerCase()
              let dataType = ''

              if (ftType == 'point') {
                dataType = 'custom points'
              } else if (ftType == 'polygon') {
                dataType = 'custom polygons'
              } else if (
                ftType == 'linestring' ||
                ftType == 'multilinestring'
              ) {
                dataType = 'custom lines'
              }

              ftCategory.data[dataType][
                ftWithMetadata.properties.editorID
              ] = ftWithMetadata
              // UPDATING THE CATEGORY WITH THE FEATURE DATA
              categoriesDictionary.update(
                ftWithMetadata.properties.category,
                ftCategory
              )
            }
          }

          // Then I do can add it into the dictionary
          if (this.dialog.mode == 'create') {
            sceneDictionary.add(ftWithMetadata.editorID, ftWithMetadata)
          }

          await this.handleUpdateMapSourcesData(
            ftWithMetadata,
            sceneDictionary.getCollectionList()
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
        category.data[customType][feature.properties.editorID] = feature
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

      if (this.type != 'facilities') {
        map.addControl(new mapboxgl.FullscreenControl())
      }

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
      this.controls.on('draw', () => (this.scene.isDynamicControls = true))
      this.controls.on('reset-scene', await this.handleResetScene)
      this.controls.on('delete-feature', await this.handleDeleteFeature)
      this.controls.on('update-feature', await this.handleFeatureEdition)
      this.controls.on(
        'update-feature-properties',
        await this.setPropertiesDialogEditMode
      )
      this.controls.on(
        'delete-vertex',
        this.handleDeleteVertexFromFeatureSelected
      )
      this.controls.on('cut-feature', this.handleCutFeatureSelected)

      map.addControl(this.controls)
      map.addControl(this.draw)
      return map
    },
    async handleDeleteVertexFromFeatureSelected({ feature, geometryType }) {
      const vertexPoints = this.draw.getSelectedPoints().features
      const vertexPointSelected = vertexPoints.length ? vertexPoints[0] : null

      if (!vertexPointSelected || !vertexPointSelected) {
        this.$message("There's no vertex point selected")
        return
      }

      const id = feature.properties.editorID
        ? feature.properties.editorID
        : feature.properties._id
      const featureSelected = sceneDictionary.get(id)
      const coordinates = feature.geometry.coordinates

      if (geometryType == 'linestring') {
        if (coordinates.length <= 2) {
          this.$message("You can't delete this vertex")
          return
        }

        featureSelected.geometry.coordinates = coordinates.filter(
          coord => !booleanEqual(vertexPointSelected, point(coord))
        )
      } else if (geometryType == 'multilinestring') {
        const linestring = lineString(coordinates[0])
        const linestringCoords = linestring.geometry.coordinates

        if (linestringCoords.length <= 2) {
          this.$message("You can't delete this vertex")
          return
        }

        const linestringNewCoords = linestringCoords.filter(
          coord => !booleanEqual(vertexPointSelected, point(coord))
        )
        featureSelected.geometry.coordinates = [linestringNewCoords]
      }

      sceneDictionary.update(id, featureSelected)
      await this.handleUpdateMapSourcesData(
        null,
        sceneDictionary.getCollectionList()
      )

      const featuresId = this.draw.set(fCollectionFormat([featureSelected]))
      this.draw.changeMode('direct_select', { featureId: featuresId[0] })
    },
    async handleCutFeatureSelected({ feature, geometryType }) {
      const vertexPoints = this.draw.getSelectedPoints().features
      const vertexPointSelected = vertexPoints.length ? vertexPoints[0] : null

      if (!vertexPointSelected || !vertexPointSelected) {
        this.$message("There's no vertex point selected")
        return
      }

      const id = feature.properties.editorID
        ? feature.properties.editorID
        : feature.properties._id
      const featureSelected = sceneDictionary.get(id)
      const coordinates = feature.geometry.coordinates
      let originalSegment
      let cuttedSegment
      let pStart
      let pStop
      let pEnd

      function setProperties(original, clone, props) {
        let cuttedTimes = !props.cutTimes
          ? (props.cutTimes = 1)
          : props.cutTimes++

        let cuttedSegmentName

        if (props.cutTimes >= 1 && props.name.includes('.cut')) {
          let name = props.name.split('.cut')[0]
          cuttedSegmentName = `${name}.cut(${props.cutTimes})`
        } else {
          cuttedSegmentName =
            props.name && props.name !== ''
              ? `${props.name}.cut(${cuttedTimes}) `
              : 'default-name.'
        }

        original.properties = { ...props }
        clone.properties = {
          ...props,
          name: cuttedSegmentName,
          editorID: clone.editorID
        }
        // Deleting this property is necessary for filtering the map correctly
        delete clone.properties._id

        return {
          clone,
          original
        }
      }

      if (geometryType == 'linestring') {
        pStart = point(coordinates[0])
        pStop = point(vertexPointSelected.geometry.coordinates)
        pEnd = coordinates[coordinates.length - 1]

        originalSegment = lineSlice(pStart, pStop, feature)
        cuttedSegment = setFeatureEditorID(lineSlice(pStop, pEnd, feature))
      } else if (geometryType == 'multilinestring') {
        let indx = -1

        for (let i = 0; i < coordinates.length; i++) {
          for (let co of coordinates[i]) {
            if (
              co[0] == vertexPointSelected.geometry.coordinates[0] &&
              co[1] == vertexPointSelected.geometry.coordinates[1]
            ) {
              indx = i
              break
            }
          }
        }

        pStart = point(coordinates[indx][0])
        pStop = point(vertexPointSelected.geometry.coordinates)
        pEnd = point(coordinates[indx][coordinates[indx].length - 1])

        let linestring = lineString(coordinates[indx])
        originalSegment = lineSlice(pStart, pStop, linestring)
        cuttedSegment = setFeatureEditorID(lineSlice(pStop, pEnd, linestring))
      }

      originalSegment.properties._id = id
      originalSegment.properties.editorID = id
      originalSegment.geometry.coordinates.pop()

      if (featureSelected) {
        let { clone, original } = setProperties(
          originalSegment,
          cuttedSegment,
          featureSelected.properties
        )

        cuttedSegment = clone
        originalSegment = original
      }

      sceneDictionary.update(id, originalSegment)
      sceneDictionary.add(cuttedSegment.editorID, cuttedSegment)

      await this.handleUpdateMapSourcesData(
        null,
        sceneDictionary.getCollectionList()
      )
      await this.handleResetScene({
        reset: false,
        removeFilter: this.scene.isDynamicControls
      })
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
    handleConfirmAction([feature]) {
      if (!feature) return

      if (feature.properties.editorID || feature.properties._id) {
        this.handleFeatureEdition({ ...feature })
      } else {
        if (
          onlyOneFeatureAllowed.includes(this.type) &&
          sceneDictionary.getLength() > 0
        ) {
          return
        }

        this.handleBeforeCreateFeature({ ...feature })
      }
    },
    async handleResetScene({ reset, removeFilter }) {
      this.draw.changeMode(this.draw.modes.SIMPLE_SELECT)
      this.draw.set(fCollectionFormat())
      this.scene = {
        layerFiltered: this.scene.layerFiltered,
        isDynamicControls: false
      }

      if (reset) {
        sceneDictionary.reset()
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
    handleRecreateDraw: debounce(async function(feats, zoomTo = true) {
      const features = feats ? feats : sceneDictionary.getCollectionList()
      await updateDrawnFeatureDataSource(this.map, features)

      if (zoomTo) {
        await zoomToFeature({
          fc: fCollectionFormat(features),
          type: this.type,
          map: this.map
        })
      }
    }, 820),
    handleFeatureSelection: debounce(function setFeatureSelection({
      e,
      layerID,
      map
    }) {
      // if (layerID.includes('label')) return
      const featureSelected = map.queryRenderedFeatures(e.point, {
        layers: [layerID]
      })[0]

      if (layerID.includes('label')) {
        layerID = layerID.replace('-label', '')
      }

      if (this.scene.isDynamicControls) {
        this.handleResetScene({ reset: false, removeFilter: true })
      }

      if (featureSelected) {
        const idProp = featureSelected.properties.editorID ? 'editorID' : '_id'
        const featureID = featureSelected.properties[idProp]
        const feature = sceneDictionary.get(featureID)

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
                layerType = 'buildings'
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

            this.scene.isDynamicControls = true
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
      sceneDictionary.update(
        feature.properties.editorID
          ? feature.properties.editorID
          : feature.properties._id,
        feature
      )
      return feature
    },
    async handleFeatureEdition(feature) {
      const ftUpdated = this.updateSceneDictionaryFeature(feature)
      await this.handleUpdateMapSourcesData(
        ftUpdated,
        sceneDictionary.getCollectionList()
      )
      await this.handleResetScene({
        reset: false,
        removeFilter: this.scene.isDynamicControls
      })
    },
    async handleDeleteFeature(features) {
      for (let feature of features) {
        sceneDictionary.remove(
          feature.properties.editorID
            ? feature.properties.editorID
            : feature.properties._id
        )
        await this.handleUpdateMapSourcesData(
          feature,
          sceneDictionary.getCollectionList()
        )
        await this.handleResetScene({
          reset: false,
          removeFilter: this.scene.isDynamicControls
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/editor-styles.scss';
</style>
