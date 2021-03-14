<template>
  <div id="map">
    <template v-if="!disabled">
      <transition
        name="animated faster delay-1s"
        enter-active-class="slideInLeft"
        leave-active-class="slideOutLeft"
        mode="out-in"
      >
        <el-card
          v-if="isLastMileTool"
          class="z-index120 w50 p4"
          style="position: fixed; top: 4rem; left: 2.4rem;"
        >
          <template v-if="isUserLoggedIn">
            <h3>Last Mile Tool Panel</h3>
            <b>Length: </b>
            <span>{{ lmt.length }}</span
            ><br />
            <ul>
              <b>Available Networks :</b>
              <li v-for="(item, i) in lmt.networks" :key="i + item">
                {{ i + 1 }} - {{ item }}
              </li>
            </ul>
          </template>
          <div v-else>
            You need to sign in before using the tool.
          </div>
          <el-button
            size="mini"
            class="w-fit-full mt2"
            @click="closeLastMileTool"
          >
            Close tool
          </el-button>
        </el-card>
      </transition>
      <transition
        name="animated faster delay-1s"
        enter-active-class="slideInLeft"
        leave-active-class="slideOutLeft"
        mode="out-in"
      >
        <legends-panel v-if="!isLastMileTool" />
      </transition>
      <transition
        name="animated faster delay-1s"
        enter-active-class="slideInLeft"
        leave-active-class="slideOutLeft"
        mode="out-in"
      >
        <layers-panel
          v-if="!isLastMileTool"
          ref="layersPanel"
          @toggle-layer="handleToggleLayer"
        />
      </transition>
      <el-button
        id="ThreeD"
        type="text"
        title="3D view"
        @click="toggleThreeD"
        size="small"
        class="m0 p0"
        :class="{ dark }"
        >3D</el-button
      >
      <el-button
        id="FScreen"
        title="Full screen"
        type="text"
        size="small"
        class="m0 p0"
        :class="{ dark }"
        @click="toggleFullScreen"
      >
        <fa :icon="['fas', 'expand-arrows-alt']" class="sm-icon" />
      </el-button>
      <gooey-menu
        :map="map ? map : {}"
        ref="gooeymenu"
        @change-network="lmt.networks = $event"
        @change-length="lmt.length = $event"
      />
      <donations-banner />
    </template>
  </div>
</template>

<script>
import {
  TOGGLE_THEME,
  CLEAR_SELECTION,
  FOCUS_ON,
  FOCUS_ON_CITY
} from '../../events'
import {
  TOGGLE_FILTER_SELECTION,
  UPDATE_TIME_MACHINE,
  SUBSEA_FILTER
} from '../../events/filter'
import { TOGGLE_DARK, TOGGLE_SIDEBAR } from '../../store/actionTypes'
import {
  CURRENT_MAP_FILTER,
  CURRENT_SELECTION,
  MAP_FOCUS_ON,
  HAS_TO_EASE_TO,
  EASE_POINT,
  IS_LMT
} from '../../store/actionTypes/map'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import { mapConfig } from '../../config/mapConfig'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { bus } from '../../helpers/eventBus'
import 'mapbox-gl/dist/mapbox-gl.css'
import { mapState, mapActions } from 'vuex'
import currentYear from '../../helpers/currentYear'
import debounce from '../../helpers/debounce'
import { viewNetwork } from '../../services/api/networks'
import { viewOrganization } from '../../services/api/organizations'
import handleDraw from './draw'
import setBoundsCookie from './setBoundsCookie'
import disableCurrentHighlight from './disableHighlight'
import GooeyMenu from './GooeyMenu'
import highlightCurrentSelection from './highlightCurrentSelection'
import dataCollection from '../../mixins/dataCollection'
import { DateTime } from 'luxon'
import LegendsPanel from './panels/legendsPanel'
import LayersPanel from './panels/layersPanel'
import { bbox } from '@turf/turf'
import { fCollectionFormat } from '../../helpers/featureCollection'
import $axios from '../../services/axios'
import highlightSeveralFeatures, {
  disableHighlightSeveralFeatures
} from './highlightSeveralFeatures'

export default {
  name: 'Map',
  mixins: [dataCollection],
  components: {
    GooeyMenu,
    LayersPanel,
    LegendsPanel,
    DonationsBanner: () => import('./DonationsBanner')
  },
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    is3D: false,
    print: null,
    trackID: null,
    map: undefined,
    isMenuOpen: false,
    lmt: {
      networks: [],
      length: 0
    },
    facilitiesClusters: {
      active: true,
      hasData: true
    }
  }),
  computed: {
    ...mapState({
      dark: state => state.isDark,
      isMobile: state => state.isMobile,
      isDrawing: state => state.isDrawing,
      currentMapFilter: state => state.map.filter,
      currentSelection: state => state.map.currentSelection,
      bounds: state => state.map.bounds,
      focus: state => state.map.focus,
      points: state => state.map.points,
      isSidebar: state => state.isSidebar,
      easePoint: state => state.map.easePoint,
      hasToEase: state => state.map.hasToEase,
      isLastMileTool: state => state.map.isLastMileTool
    }),
    isUserLoggedIn() {
      return this.$auth.isAuthenticated
    }
  },
  watch: {
    '$store.state.isSidebar'(bool) {
      if (!bool) {
        disableHighlightSeveralFeatures({
          map: this.map,
          layerName: mapConfig.cables,
          ids: [...this.$store.state.map.activatedElements]
        })
        this.$store.commit('map/SET_ACTIVATED_ELEMENTS', [])
      }
    }
  },
  created() {
    bus.$on(CLEAR_SELECTION, this.disableSelectionHighlight)
    bus.$on(TOGGLE_THEME, this.toggleDarkMode)
    bus.$on(FOCUS_ON, this.handleFocusOn)
    bus.$on(FOCUS_ON_CITY, this.handleCityFocus)
    bus.$on(UPDATE_TIME_MACHINE, this.handleUpdateTimeMachine)
    bus.$on(TOGGLE_FILTER_SELECTION, this.handleFilterSelection)
    bus.$on(SUBSEA_FILTER, this.handleSubseaToggle)
    if (this.isLastMileTool) this.closeLastMileTool()
  },
  mounted() {
    this.map = this.addMapEvents(this.initMapLayers(this.createMap()))

    if (this.dark) this.map.setStyle(mapConfig.darkBasemap)
    if (this.currentSelection && this.focus) this.handlePreviouslySelected()
  },
  beforeDestroy() {
    bus.$off(CLEAR_SELECTION, this.disableSelectionHighlight)
    bus.$off(TOGGLE_THEME, this.toggleDarkMode)
    bus.$off(FOCUS_ON, this.handleFocusOn)
    bus.$off(FOCUS_ON_CITY, this.handleCityFocus)
    bus.$off(UPDATE_TIME_MACHINE, this.handleUpdateTimeMachine)
    bus.$off(TOGGLE_FILTER_SELECTION, this.handleFilterSelection)
    bus.$off(SUBSEA_FILTER, this.handleSubseaToggle)
  },
  methods: {
    ...mapActions({
      getFacilityData: 'map/getFacilityData',
      getClsData: 'map/getClsData',
      getIxpsData: 'map/getIxpsData',
      changeSidebarMode: 'changeSidebarMode',
      getCableData: 'map/getCableData'
    }),
    handleHighlightCablesArray({ terrestrial, subsea }) {
      highlightSeveralFeatures({
        map: this.map,
        layerName: mapConfig.cables,
        elements: [...terrestrial.map(i => i._id), ...subsea.map(i => i._id)]
      })
    },
    closeLastMileTool() {
      this.$store.commit(`${IS_LMT}`, false)
    },
    createMap() {
      mapboxgl.accessToken = mapConfig.mapToken

      const map = new mapboxgl.Map({
        container: 'map',
        zoom: mapConfig.zoom,
        maxZoom: mapConfig.maxZoom,
        minZoom: 2,
        pitch: this.disabled ? 45 : 0,
        center: mapConfig.center,
        style: mapConfig.default
      })

      if (!this.disabled) {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true,
            line_string: true
          }
        })
        const scaleCtrl = new mapboxgl.ScaleControl({
          maxWidth: 80,
          unit: 'metric'
        })

        map.addControl(draw, 'top-right')
        map.addControl(scaleCtrl, 'bottom-left')
        map.addControl(new mapboxgl.NavigationControl(), 'top-right')
        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          })
        )

        const mbCtrl = document.querySelector('.mapboxgl-ctrl-group')
        mbCtrl.classList.add('mapbox-controllers')
        mbCtrl.appendChild(document.getElementById('ThreeD'))
        mbCtrl.appendChild(document.getElementById('FScreen'))

        window.draw = draw
      }

      window.mapboxgl = mapboxgl
      return map
    },
    /**
     * @param map { Object } map instance
     */
    initMapLayers(map) {
      if (!map) return
      let vm = this
      map.on('load', function() {
        vm.addMapSources(map)
        vm.addMapLayers(map)
        vm.$emit('map-loaded')
      })
      return map
    },
    /**
     * @param map { Object } map instance
     */
    addMapSources(map) {
      for (let source of mapConfig.data.sources) {
        map.addSource(source.name, source.opts)
      }
    },
    addMapLayers(map) {
      const size = 45
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // get rendering context for the map canvas when layer is added to the map
        onAdd: function() {
          var canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height
          this.context = canvas.getContext('2d')
        },

        // called once before every frame where the icon will be used
        render: function() {
          var duration = 1000
          var t = (performance.now() % duration) / duration

          var radius = (size / 2) * 0.3
          var outerRadius = (size / 2) * 0.7 * t + radius
          var context = this.context

          // draw outer circle
          context.clearRect(0, 0, this.width, this.height)
          context.beginPath()
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          )
          context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')'
          context.fill()

          // draw inner circle
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
          context.fillStyle = 'rgba(255, 100, 100, 1)'
          context.strokeStyle = 'white'
          context.lineWidth = 2 + 4 * (1 - t)
          context.fill()
          context.stroke()

          // update this image's data with data from the canvas
          this.data = context.getImageData(0, 0, this.width, this.height).data

          // continuously repaint the map, resulting in the smooth animation of the dot
          map.triggerRepaint()

          // return `true` to let the map know that the image was updated
          return true
        }
      }
      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 1 })

      for (let layer of mapConfig.data.layers) {
        map.addLayer(layer)
      }
      map.setFilter(mapConfig.cables, mapConfig.filter.all)
      this.$store.commit(`${CURRENT_MAP_FILTER}`, mapConfig.filter.all)
    },
    /**
     * @param map { Object } map instance
     */
    addMapEvents(map) {
      let vm = this
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        className: 'mapPopup'
      })

      map.on('mouseenter', mapConfig.cables, function(e) {
        vm.handlePopupVisibilityOn({ e, popup, isPoint: false })
      })
      map.on('mouseleave', mapConfig.cables, () => {
        vm.handlePopupVisibilityOff({ popup, map })
      })
      map.on('mouseenter', mapConfig.ixps, function(e) {
        vm.handlePopupVisibilityOn({ e, popup, isPoint: true, type: 'ixps' })
      })
      map.on('mouseleave', mapConfig.ixps, function() {
        vm.handlePopupVisibilityOff({ popup, map })
      })
      // Earthquakes layer - START
      map.on('mouseenter', mapConfig.earthquakes, function(e) {
        vm.handleEarthquakesPopup({ e, popup, map, off: false })
      })
      map.on('mouseleave', mapConfig.earthquakes, function() {
        vm.handleEarthquakesPopup({ popup, map, off: true })
      })
      // Earthquakes layer - END
      map.on('mouseenter', mapConfig.facilities, () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', mapConfig.facilities, () => {
        map.getCanvas().style.cursor = ''
      })
      map.on('mouseenter', mapConfig.cls, function(e) {
        vm.handlePopupVisibilityOn({ e, popup, isPoint: true, type: 'cls' })
        vm.handleCLSHover(e, true)
      })
      map.on('mouseleave', mapConfig.cls, function(e) {
        vm.handleCLSHover(e, false)
      })
      map.on('mouseenter', mapConfig.cablesLabel, () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', mapConfig.cablesLabel, () => {
        map.getCanvas().style.cursor = ''
      })
      map.on('mouseenter', mapConfig.facilitiesLabel, () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', mapConfig.facilitiesLabel, () => {
        map.getCanvas().style.cursor = ''
      })

      if (!this.disabled) {
        map.on('click', this.handleMapClick)
        map.on('touchend', this.handleMapClick)
        map.on('render', this.handleBoundsChange)
      }

      map.on('draw.create', this.handleDrawEvents)
      map.on('draw.delete', this.handleDrawEvents)
      map.on('draw.update', this.handleDrawEvents)

      return map
    },
    handleEarthquakesPopup({ e, popup, off, map }) {
      if (e && !off) {
        const { time, title, tsunami } = JSON.parse(
          JSON.stringify(e.features[0].properties)
        )
        const date = DateTime.fromMillis(time).toLocaleString()
        const markup = `<div class="cable-name dark-color"><b> ${title}</b></div><div class="rfs dark-color"> Date: ${date}</div><div class="rfs dark-color"> Tsunami: ${
          tsunami ? 'Yes' : 'No'
        }</div>`
        popup
          .setLngLat(e.lngLat)
          .setHTML(markup)
          .addTo(map)
      } else {
        if (!this.isLastMileTool) {
          popup.remove()
          map.getCanvas().style.cursor = ''
        } else if (this.isUserLoggedIn) {
          map.getCanvas().style.cursor = 'crosshair'
        }
      }
    },
    async handleToggleLayer({ layerName, active, layersDict }) {
      if (!this.map) return

      const filter = active
        ? mapConfig.filter.all
        : ['has', 'a_property_that_does_not_exist']

      if (layersDict) {
        this.facilitiesClusters.active = layersDict[mapConfig.facilities].active
      }

      if (layerName == mapConfig.facilities) {
        const facsClustersSource = this.map.getSource(
          mapConfig.facilitiesClusters
        )
        let features = fCollectionFormat()

        if (
          active &&
          this.facilitiesClusters.active &&
          !this.facilitiesClusters.hasData
        ) {
          features = { features } = (await $axios.get(
            process.env.VUE_APP_TILES_FACS_CLUSTERS
          )) || {
            features: {
              features: []
            }
          }
        } else {
          this.map.setFilter(
            mapConfig.facilities,
            this.facilitiesClusters.active ? mapConfig.filter.all : filter
          )
          this.map.setFilter(
            mapConfig.facilitiesPoints,
            this.facilitiesClusters.active ? ['==', '$type', 'Point'] : filter
          )
        }

        facsClustersSource.setData(features)
        this.facilitiesClusters.hasData = features.features.length > 0
      } else if (layerName == 'terrestrial') {
        let filterBy = active ? mapConfig.filter.all : mapConfig.filter.subsea

        if (!layersDict.subsea.active && active) {
          filterBy = ['all', ['==', 'terrestrial', 'true'], ['has', '_id']]
        } else if (!layersDict.subsea.active && !active) {
          filterBy = ['has', 'a_property_that_does_not_exist']
        }

        this.map.setFilter(mapConfig.cables, filterBy)
        this.map.setFilter(mapConfig.cablesLabel, filterBy)
      } else if (layerName == 'subsea') {
        let filterBy = active
          ? mapConfig.filter.all
          : mapConfig.filter.terrestrial

        if (!layersDict.terrestrial.active && active) {
          filterBy = ['all', ['!=', 'terrestrial', 'true'], ['has', '_id']]
        } else if (!layersDict.terrestrial.active && !active) {
          filterBy = ['has', 'a_property_that_does_not_exist']
        }

        this.map.setFilter(mapConfig.cables, filterBy)
        this.map.setFilter(mapConfig.cablesLabel, filterBy)
      } else if (layerName == 'earthquakes') {
        this.map.setFilter(
          layerName,
          active
            ? ['>=', ['get', 'mag'], 6.0]
            : ['has', 'a_property_that_does_not_exist']
        )
      } else {
        this.map.setFilter(layerName, filter)
      }
    },
    handleCLSHover(e, isHovering) {
      if (!this.map || this.isLastMileTool) return
      const {
        features: [
          {
            properties: { _id }
          }
        ] = [{ properties: { _id: '' } }]
      } = e

      this.map.setPaintProperty(mapConfig.cls, 'circle-radius', [
        'match',
        ['get', '_id'],
        _id,
        isHovering ? 7.4 : 3.4,
        3.4
      ])
    },
    handleDrawEvents() {
      const data = window.draw.getAll()
      const elemnt = document.getElementById('calculated-area')
      return handleDraw.call(this, { data, elemnt })
    },
    /**
     * @param e { Object } Map's hover Event
     * @param popup { Object } The map popup instance
     * @param map { Object } The map instance
     * @param isPoint { Boolean } If the tooltip is for a Point
     */
    showPopup({ e, map, popup, isPoint, type }) {
      const { name, category, segment, activationDateTime } = JSON.parse(
        JSON.stringify(e.features[0].properties)
      )

      const date = DateTime.fromMillis(
        activationDateTime * 1000
      ).toLocaleString({ year: 'numeric' })
      const cableCategoryColor =
        category == 'active' ? 'green' : category == 'project' ? 'red' : 'black'

      const facsClusters = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.facilitiesClusters]
      })

      if (facsClusters.length > 0) return

      let str = `<div class="cable-name dark-color"><b>${name}</b></div>`

      if (isPoint) {
        str = `<div class="cable-name dark-color"><b>${type} name : ${name}</b></div>`
      } else {
        if (segment) {
          str += `<div class="segment-name dark-color">Segment: ${segment}</div>`
        }
        str += `<div class="status dark-color"> Status: <span style="color: ${cableCategoryColor}" class="category capitalize">${
          category && category !== '' ? category : ' Unknown'
        }</span></div>`
        str += `<div class="rfs dark-color"> RFS: ${date}</div>`
        str += `<div class="details dark-color">Click for more details</div>`
      }

      popup
        .setLngLat(e.lngLat)
        .setHTML(str)
        .addTo(map)
    },
    /**
     * @param e { Object } Map's hover Event
     * @param popup { Object } The map popup instance
     * @param isPoint { Boolean } If the tooltip is for a Point
     */
    handlePopupVisibilityOn({ e, popup, isPoint, type = '' }) {
      if (!this.map) return

      const clusters = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.clusters]
      })

      if (
        !clusters.length &&
        e.features.length &&
        !this.isMobile &&
        !this.isLastMileTool
      ) {
        this.map.getCanvas().style.cursor = 'pointer'
        this.showPopup({ e, map: this.map, popup, isPoint, type })
      } else {
        this.map.getCanvas().style.cursor = ''
      }
    },
    /**
     * @param popup { Object } The map popup instance
     * @param map { Object } The map instance
     */
    handlePopupVisibilityOff({ popup, map }) {
      if (!this.isLastMileTool) {
        popup.remove()
        map.getCanvas().style.cursor = ''
      } else if (this.isUserLoggedIn) {
        map.getCanvas().style.cursor = 'crosshair'
      }
    },
    highlightSelection(id) {
      if (!this.focus) return

      try {
        return highlightCurrentSelection({
          id,
          map: this.map,
          dark: this.dark,
          name: this.focus.name,
          commit: this.$store.commit,
          focusType: this.focus.type
        })
      } catch (err) {
        console.error(err)
      }
    },
    handleBoundsChange() {
      if (!this.map) return

      const pitch = this.map.getPitch()
      const bounds = this.map.getBounds()
      const bearing = this.map.getBearing()
      const center = this.map.cameraForBounds(bounds, {
        padding: { top: 10, bottom: 25, left: 15, right: 5 }
      })

      return setBoundsCookie({
        pitch,
        bounds,
        center,
        bearing,
        focus: this.focus
      })
    },
    /**
     * @param closesSidebar { Boolean } - If besides removing cables highlight it also closes the sidebar
     */
    disableSelectionHighlight(closesSidebar = true, type) {
      if (!this.map) return
      try {
        disableCurrentHighlight({
          map: this.map,
          closesSidebar,
          commit: this.$store.commit,
          handleBoundsChange: this.handleBoundsChange,
          focusType: type
            ? type
            : this.focus
            ? this.focus.type.split().join('')
            : false
        })
      } catch (err) {
        console.error(err)
      }
    },
    /**
     * @param e { Object } Map's any clicking event
     */
    async handleMapClick(e) {
      // If is currently drawing shouldn't do anything
      if (this.isDrawing) return
      const clusters = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.clusters]
      })

      if (this.focus) {
        this.disableSelectionHighlight(false, this.focus.type.split().join(''))
      }
      if (this.isSidebar && !clusters.length) {
        await this.$store.commit(`${TOGGLE_SIDEBAR}`, false)
      }

      const cables = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.cables]
      })

      const cablesLabel = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.cablesLabel]
      })

      const facilities = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.facilities]
      })

      const facilitiesLabel = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.facilitiesLabel]
      })

      const ixps = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.ixps]
      })
      const cls = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.cls]
      })

      const facsClusters = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.facilitiesClusters]
      })
      const facsClustersSinglePoints = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.facilitiesSinglePoints]
      })

      // If in the region selected there is a point or a building
      // Call the api to retrieve that facility data and open the sidebar
      if (facsClustersSinglePoints.length > 0) {
        this.map.fitBounds(bbox(fCollectionFormat(facsClustersSinglePoints)), {
          ease: true,
          zoom: 16.4
        })
      } else if (clusters.length > 0 || facsClusters.length > 0) {
        let data = clusters.length > 0 ? clusters : facsClusters
        let sourceName =
          clusters.length > 0
            ? mapConfig.clusters
            : mapConfig.facilitiesClusters

        await this.handleClustersSelection(
          // clusters,
          data,
          this.map,
          sourceName
          // mapConfig.clusters
        )
      } else if (cls.length > 0) {
        await this.handleClsSelection({
          id: cls[0].properties._id,
          type: 'cls'
        })
      } else if (ixps.length > 0) {
        await this.handleIxpsSelection({
          id: ixps[0].properties._id,
          type: 'ixp'
        })
      } else if (facilities.length > 0 || facilitiesLabel.length > 0) {
        const id = facilities.length
          ? facilities[0].properties._id
          : facilitiesLabel[0].properties._id

        await this.handleFacilitySelection({
          id,
          type: 'facility'
        })
      } else if (cables.length > 0 || cablesLabel.length > 0) {
        let data = cables.length > 0 ? cables : cablesLabel
        await this.handleCablesSelection(true, data)
      } else if (
        facilities.length <= 0 &&
        ixps.length <= 0 &&
        cls.length <= 0
      ) {
        // Clearing clusters source in case there was something previously selected
        try {
          this.map
            .getSource(mapConfig.clusters)
            .setData({ type: 'FeatureCollection', features: [] })
        } catch {
          // Ignore
        } finally {
          this.disableSelectionHighlight()

          if (
            !this.facilitiesClusters.active &&
            this.$refs.layersPanel.layers.facilities.active
          ) {
            this.handleToggleLayer({
              active: true,
              layerName: mapConfig.facilities,
              layersDict: {
                [mapConfig.facilities]: {
                  active: true
                }
              }
            })
          }
        }
      }
    },
    async handleOrganizationFocus(_id, fc) {
      const res = await viewOrganization({
        user_id: this.$auth.user,
        _id
      })
      if (res && res.data && res.data.r && res.data.r.length) {
        // Change sidebar mode to data_centers mode
        this.changeSidebarMode(1)
        // In case there was a cable selected before
        await this.disableSelectionHighlight(false, 'cable')
        await this.$store.commit(`${CURRENT_SELECTION}`, res.data.r[0])

        this.$store.commit(`${MAP_FOCUS_ON}`, {
          id: _id,
          type: 'organization',
          name: res.data.r[0].name
        })

        if (!this.isSidebar) await this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      }

      if (fc) {
        await this.handleToggleLayer({
          layerName: mapConfig.facilities,
          active: false,
          layersDict: {
            [mapConfig.facilities]: {
              active: false
            }
          }
        })
        this.map.getSource(mapConfig.clusters).setData(fc)
      }

      this.map.flyTo({
        center: mapConfig.center,
        zoom: mapConfig.zoom,
        speed: 1.8,
        curve: 1
      })

      if (res && res.data && res.data.r && res.data.r.length) {
        const selection = res.data.r[0]
        const cables = {
          subsea: [
            ...selection.subsecables,
            ...selection.knownUsersSubseaCable
          ],
          terrestrial: [
            ...selection.terrestrialnetworks,
            ...selection.knownUsersTerrestrialN
          ]
        }

        this.handleHighlightCablesArray(cables)
        this.$store.commit('map/SET_ACTIVATED_ELEMENTS', [
          ...cables.terrestrial.map(item => item._id),
          ...cables.subsea.map(item => item._id)
        ])
      }
    },
    async handleNetworkFocus(_id, fc) {
      const { focus, bounds, map } = this

      const res = await viewNetwork({
        user_id: await this.$auth.getUserID(),
        _id
      })
      if (res && res.data && res.data.r && res.data.r.length) {
        // Change sidebar mode to data_centers mode
        this.changeSidebarMode(1)
        // In case there was a cable selected before
        await this.disableSelectionHighlight(false, 'cable')
        await this.$store.commit(`${CURRENT_SELECTION}`, res.data.r[0])

        if (!this.isSidebar) await this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      }

      if (fc) map.getSource(mapConfig.clusters).setData(fc)

      if (focus && bounds && bounds.length) {
        map.fitBounds(bounds, {
          pan: { duration: 25 },
          animate: true,
          padding: 20,
          speed: 1.1,
          zoom: 18.2,
          pitch: 45
        })
      }
    },
    handleCableClustersSelection(data) {
      if (this.map) {
        if (data.cluster && data.cluster.features.length) {
          this.map.getSource(mapConfig.clusters).setData(data.cluster)
        } else {
          this.map.getSource(mapConfig.clusters).setData(fCollectionFormat())
        }
      }
    },
    /**
     * @param bool { Boolean } - If it opens the sidebar
     * @param cables { Object } [{ properties: { cable_id: String } }]
     */
    async handleCablesSelection(opensSidebar, [{ properties }]) {
      switch (opensSidebar) {
        case true:
          // Change sidebar mode back to cable in case is on data_centers mode
          await this.changeSidebarMode(-1)
          // Highlight the nearest clicked cable
          await this.handleCableSelected(properties).then(() =>
            this.highlightSelection(properties._id)
          )
          break
        default:
          // Remove highlights
          await this.disableSelectionHighlight()
          // Clear "currentSelection" on store
          await this.$store.commit(`${CURRENT_SELECTION}`, null)
          break
      }
    },
    /**
     * @param clusters { Array }
     * @param map { Object } Mapbox map - Object reference (ie: this.map)
     */
    async handleClustersSelection(clusters, map, sourceName) {
      try {
        const source = await map.getSource(sourceName)

        if (clusters[0].properties.cluster_id) {
          source.getClusterExpansionZoom(
            clusters[0].properties.cluster_id
              ? clusters[0].properties.cluster_id
              : clusters[0].properties._id,
            function(err, zoom) {
              if (err) return err

              map.easeTo({
                center: clusters[0].geometry.coordinates,
                zoom: zoom * 1.54
              })
            }
          )
        } else {
          map.easeTo({
            center: clusters[0].geometry.coordinates,
            zoom: mapConfig.maxZoom
          })

          if (
            clusters[0].properties._id &&
            this.focus &&
            this.focus.type == 'ixp'
          ) {
            // We need to remove the clusters layer data before anything else
            await this.map
              .getSource(mapConfig.clusters)
              .setData(fCollectionFormat())
            // When viewing facilities the clusters facilities should be back again
            this.facilitiesClusters.active = true
            await this.handleToggleLayer({
              layerName: mapConfig.facilities,
              active: true
            })
            // Closing the sidebar so the information updates correctly
            this.disableSelectionHighlight(
              true,
              this.focus.type.split().join('')
            )
            await this.handleFacilitySelection({
              id: clusters[0].properties._id,
              type: 'facility'
            })
          }
        }
      } catch (err) {
        console.error(err, 'cluster selection error')
      }
    },
    /**
     * @param id { String } - ID of the facility (data centers)
     */
    async handleFacilitySelection({ id, type }) {
      const { data } = await this.getFacilityData({
        user_id: await this.$auth.getUserID(),
        _id: id
      })

      if (data && data.r.length) {
        this.$store.commit(`${MAP_FOCUS_ON}`, {
          id,
          type,
          name: data.r[0].name
        })
      }

      this.highlightSelection(id)
      // Changing the sidebar mode to data_center mode
      this.changeSidebarMode(1)
      // this.$store.commit(`${CURRENT_SELECTION}`, data)
      // Opening the sidebar
      this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      // Removing cables highlight if any
      this.disableSelectionHighlight(false, 'cable')
    },
    async handleClsSelection({ id, type }) {
      const { data } = await this.getClsData({
        user_id: await this.$auth.getUserID(),
        _id: id
      })

      if (data && data.r.length) {
        this.$store.commit(`${MAP_FOCUS_ON}`, {
          id,
          type,
          name: data.r[0].name
        })
      }

      this.highlightSelection(id)
      // Changing the sidebar mode to data_center mode
      this.changeSidebarMode(1)
      // this.$store.commit(`${CURRENT_SELECTION}`, data)
      // Opening the sidebar
      this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      // Removing cables highlight if any
      this.disableSelectionHighlight(false, 'cable')
    },
    async handleIxpsSelection({ id, type }) {
      const { data } = await this.getIxpsData({
        user_id: await this.$auth.getUserID(),
        _id: id
      })

      if (data && data.r.length) {
        this.$store.commit(`${MAP_FOCUS_ON}`, {
          id,
          type,
          name: data.r[0].name
        })

        // Facilities cluster data needs to be removed
        this.map
          .getSource(mapConfig.facilitiesClusters)
          .setData(fCollectionFormat())
        this.facilitiesClusters.hasData = false
        this.facilitiesClusters.active = false
        // Associations cluster
        this.map.getSource(mapConfig.clusters).setData(data.r[0].cluster)
      }

      this.highlightSelection(id)
      // Changing the sidebar mode to data_center mode
      this.changeSidebarMode(1)
      // this.$store.commit(`${CURRENT_SELECTION}`, data)
      // Opening the sidebar
      this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      // Removing cables highlight if any
      this.disableSelectionHighlight(false, 'cable')
    },
    toggleDarkMode() {
      this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
      const style = this.dark ? mapConfig.darkBasemap : mapConfig.default

      const loadStyles = () => {
        if (!this.map.loaded()) return

        try {
          this.addMapSources(this.map)
          this.addMapLayers(this.map)
        } catch {
          // Ignore
        }
        if (this.focus && this.focus.type.toLowerCase() == 'cable') {
          this.handleCablesSelection(true, [
            { properties: { _id: this.focus.id } }
          ])
        }
        this.map.off('render', loadStyles)
      }

      const switchStyles = style => {
        this.map.setStyle(style)
        this.map.on('render', loadStyles)
      }

      // We have to remove the filter cause if not it will only draw the filtered cable
      this.$store.commit(`${CURRENT_MAP_FILTER}`, ['all'])
      switchStyles(style)
    },
    toggleFullScreen() {
      const el = document.querySelector('.application')
      if (!document.fullscreen) {
        el.requestFullscreen().catch(err => console.error(err))
      } else document.exitFullscreen()
    },
    toggleThreeD() {
      if (!this.map) return
      this.is3D = !this.is3D
      this.$nextTick(() => {
        this.map.easeTo({ pitch: this.is3D ? 45 : 0, duration: 850 })
      })
    },
    /**
     * @param id { [Number, String] }
     * @param type { String }
     */
    async handleFocusOn({ id, type, fc }) {
      if (!this.map) return
      else if (!id) {
        throw {
          message: `Expected @param id to be [Number, String], but found ${typeof id}`
        }
      } else if (!type) {
        throw {
          message: `Expected @param type to be string, but found ${typeof type}`
        }
      }

      this.$store.commit(`${MAP_FOCUS_ON}`, {
        id,
        type: type == 'orgs' ? 'organization' : type
      })

      // Clearing clusters source in case there was something previously selected
      this.map
        .getSource(mapConfig.clusters)
        .setData({ type: 'FeatureCollection', features: [] })

      switch (type.toLowerCase().trim()) {
        case 'organization':
          await this.handleOrganizationFocus(id, fc)
          break
        case 'terrestrial-network':
          await this.handleCableFocus(id)
          break
        case 'subsea-cable':
          await this.handleCableFocus(id)
          break
        case 'facility':
          await this.handleFacilityFocus({ id, type })
          break
        case 'cls':
          await this.handleClsFocus({ id, type })
          break
        case 'ixp':
          await this.handleIxpsFocus({ id, type })
          break
        case 'city':
          await this.handleCityFocus()
          break
        case 'networks':
          await this.handleNetworkFocus(id, fc)
          break
      }
    },
    async handleCityFocus() {
      const { map, bounds, focus, isMobile, hasToEase } = this
      /**
       * - The ease point is exclusibly use when the user wants to share
       *  the view of a given point
       */
      if (hasToEase) {
        await this.handleFocusOnEasePoints()
      } else if (focus && bounds && bounds.length) {
        try {
          await map.fitBounds(bounds, {
            padding: isMobile ? 10 : 35,
            maxZoom: 16.5,
            animate: true,
            speed: 1.75,
            pan: {
              duration: 25
            }
          })
        } catch {
          // Ignore
          // Even thought that it throws an error
          // The bounds are been set correctly
        }
      }
    },
    /**
     * @param id { String } - Cable ID
     */
    async handleCableFocus(_id) {
      const { map, focus, bounds, hasToEase } = this

      if (hasToEase) await this.handleFocusOnEasePoints()
      else if (focus && bounds && bounds.length) {
        try {
          await map.fitBounds(bounds, {
            padding: 362
          })
        } catch {
          // Ignore
          // Even thought that it throws an error
          // The bounds are been set correctly
        }
      }

      await this.handleCablesSelection(true, [{ properties: { _id } }])
    },
    /**
     * @param id { String } - Building/DataCenter/Dot ID
     * @param type { String }
     */
    async handleFacilityFocus({ id, type }) {
      const { map, focus, bounds } = this

      await this.handleFacilitySelection({ id, type })
      if (focus && bounds && bounds.length) {
        try {
          map.fitBounds(bounds, {
            pan: { duration: 25 },
            animate: true,
            padding: 20,
            speed: 1.1,
            zoom: 18,
            pitch: 45
          })
        } catch {
          // Ignore
          // Even thought that it throws an error
          // The bounds are been set correctly
        }
      }
    },
    /**
     * @param id { [Number, String] }
     * @param type { String }
     */
    async handleClsFocus({ id, type }) {
      const { map, focus, bounds } = this

      await this.handleClsSelection({ id, type })
      if (focus && bounds && bounds.length) {
        try {
          map.fitBounds([bounds, bounds], {
            pan: { duration: 25 },
            animate: true,
            padding: 20,
            speed: 1.1,
            zoom: 12
          })
        } catch {
          // Ignore
          // Even thought that it throws an error
          // The bounds are been set correctly
        }
      }
    },
    async handleIxpsFocus(data) {
      const { map, focus, bounds } = this

      await this.handleIxpsSelection(data)
      if (focus && bounds && bounds.length) {
        try {
          map.fitBounds([bounds, bounds], {
            pan: { duration: 25 },
            animate: true,
            padding: 20,
            speed: 1.1,
            zoom: 18
          })
        } catch {
          // Ignore
          // Even thought that it throws an error
          // The bounds are been set correctly
        }
      }
    },
    handleFocusOnEasePoints: debounce(async function() {
      if (!this.hasToEase || !this.easePoint) return
      /**
       * - The ease point is exclusibly use when the user wants to share
       *  the view of a given point
       */

      const { center, zoom, pitch, bearing, cameraCenter } = this.easePoint
      if (center[0] && center[0].length < 2) return
      this.map.fitBounds(center, {
        pan: { duration: 30 },
        zoom: zoom + 1, // This + 1 is because mapbox doesn't zoom correctly sometimes and this fix it
        center: cameraCenter,
        bearing,
        pitch,
        animate: true,
        speed: 1.25
      })

      // Clearing ease point so it wont ease everytime the user comes to the home page
      this.$store.commit(`${EASE_POINT}`, false)
      this.$store.commit(`${HAS_TO_EASE_TO}`, false)

      // Removing view shared bounds data
      if (window.localStorage.getItem('__easePointData')) {
        window.localStorage.removeItem('__easePointData')
      }
      if (Object.keys(this.$route.query).length > 0) {
        this.$router.push('/app')
      }
    }, 820),
    async handleSubseaToggle(bool) {
      const filter = bool ? mapConfig.filter.subsea : mapConfig.filter.all

      await this.disableSelectionHighlight()
      this.$nextTick(() => {
        this.map.setFilter(mapConfig.cables, filter)
        this.map.setFilter(mapConfig.cablesLabel, filter)
      })
    },
    /**
     * @param selection { Number } - 0 being "active" - 1 being "future" - 2 being "activeSubsea" and 3 being "subseaOnly" filter
     */
    async handleFilterSelection(selection) {
      let filter

      switch (selection) {
        case -1:
          filter = mapConfig.filter.all
          break
        case 0:
          filter = mapConfig.filter.active
          break
        case 1:
          filter = mapConfig.filter.future
          break
        case 2:
          filter = mapConfig.filter.activeSubsea
          break
        case 3:
          filter = 3
          break
      }

      if (filter == 3) {
        return this.handleUpdateTimeMachine({
          year: currentYear(),
          isActive: false
        })
      }

      await this.disableSelectionHighlight()
      if (selection == 2) {
        await this.map.setFilter(mapConfig.cables, filter)
      } else {
        await this.map.setFilter(mapConfig.cables, filter)
        await this.map.setFilter(mapConfig.cablesLabel, filter)
      }
    },
    /**
     * @param year { Number } - The year parameter is for toggling if showing only the subsea cables or show them all
     * @param isActive { Bool } - Indicates if the isActive filter is currently active or not
     */
    async handleUpdateTimeMachine({ year, target, isActive }) {
      // The epoch is the time arbitrarily selected as a point of reference for the specification of celestial coordinates. In this case, is used for denoting the existence of future cables
      const epoch = new Date(`${year}-02-02`).getTime() / 1000
      let filter = mapConfig.filter.futureSubsea

      if (target == 'checkbox') {
        if (isActive) {
          filter[2][2] = epoch
          this.map.setFilter(mapConfig.cables, filter)
          this.map.setFilter(mapConfig.cablesLabel, filter.subsea)
        } else {
          filter = mapConfig.filter.all
          this.map.setFilter(mapConfig.cables, filter)
          this.map.setFilter(mapConfig.cablesLabel, filter)
        }
      } else if (target == 'slider') {
        filter[2][2] = epoch
        this.map.setFilter(mapConfig.cables, filter)
        this.map.setFilter(mapConfig.cablesLabel, filter)
      }

      await this.$store.commit(`${CURRENT_MAP_FILTER}`, filter)
    },
    handlePreviouslySelected: debounce(function() {
      if (this.map.loaded()) this.handleFocusOn(this.focus)
    }, 1200)
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/map-styles.scss';
</style>
