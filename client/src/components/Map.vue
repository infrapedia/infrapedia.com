<template>
  <div id="map">
    <el-button
      id="FScreen"
      type="text"
      @click="toggleThreeD"
      size="small"
      class="m0 p0"
      :class="{ dark }"
      >3D</el-button
    >
    <el-button
      id="ThreeD"
      type="text"
      size="small"
      class="m0 p0"
      :class="{ dark }"
      @click="toggleFullScreen"
    >
      <fa :icon="['fas', 'expand-arrows-alt']" class="sm-icon" />
    </el-button>
    <i-location-button
      @click="geolocateUser(true)"
      @enter="geolocateUser(true)"
    />
    <el-button
      id="menuOpener"
      circle
      size="small"
      class="absolute z-index1 w11 h11"
      @click.stop="toggleMenu"
      tabindex="0"
    >
      <fa
        :icon="['far', 'hand-point-up']"
        class="icon fs-medium"
        v-if="!isMenuOpen"
      />
      <fa :icon="['fas', 'times']" class="icon fs-medium" v-else />

      <ul
        v-if="isMenuOpen"
        role="group"
        class="absolute flex justify-content-space-around align-items-center"
        :class="{ active: isMenuOpen }"
      >
        <li role="listitem">
          <i-theme-toggler @click="toggleDarkMode" id="toggleTheme" />
        </li>
        <li role="listitem">
          <el-button
            type="primary"
            class="w11 h11"
            circle
            @click="$refs.gooey.click()"
          >
            <fa :icon="['fas', 'share-alt']" />
          </el-button>
        </li>
      </ul>
    </el-button>
    <div
      class="gooey-wrapper z-index1 absolute regular-transition"
      ref="gooey"
      @click.stop="activeGooeyMenu"
      :class="{ active: isActiveGooeyMenu }"
    >
      <ul role="group" class="relative regular-transition" id="gooeyList">
        <li
          role="listitem"
          class="mb1"
          v-for="(btn, i) in shareLinkButtons"
          :key="i"
        >
          <el-button
            circle
            class="color-inherit w11 h11"
            @click="() => shareLinkButtonsCallers[btn.func]()"
            :class="{ dark }"
          >
            <fa :icon="btn.icon" class="sm-icon" />
          </el-button>
        </li>
        <li role="listitem" class="mb1">
          <el-button
            circle
            class="color-inherit w11 h11"
            @click.stop="activeGooeyMenu"
            :class="{ dark }"
          >
            <fa :icon="['fas', 'times']" class="sm-icon" />
          </el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  DRAWING,
  TITLE_BY_SELECTION,
  TOGGLE_THEME,
  CABLE_SELECTED,
  CLEAR_SELECTION,
  FOCUS_ON,
  FOCUS_ON_CITY,
  REMOVE_QUERY_ROUTE_REPLACE
} from '../events'
import {
  TOGGLE_FILTER_SELECTION,
  UPDATE_TIME_MACHINE,
  SUBSEA_FILTER
} from '../events/filter'
import {
  // TOGGLE_LOADING,
  TOGGLE_DARK,
  LOCATE_USER,
  TOGGLE_SIDEBAR
} from '../store/actionTypes'
import {
  CURRENT_MAP_FILTER,
  CURRENT_SELECTION,
  MAP_FOCUS_ON,
  MAP_BOUNDS,
  MAP_POINTS,
  HAS_TO_EASE_TO,
  EASE_POINT
} from '../store/actionTypes/map'
import ILocationButton from '../components/LocationButton'
import copyToClipboard from '../helpers/copyToClipboard'
import IThemeToggler from '../components/ThemeToggler'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import { mapConfig } from '../config/mapConfig'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { bus } from '../helpers/eventBus'
import 'mapbox-gl/dist/mapbox-gl.css'
import { mapState, mapActions } from 'vuex'
import turf from 'turf'
import currentYear from '../helpers/currentYear'
import debounce from '../helpers/debounce'
import { viewNetwork } from '../services/api/networks'
import { viewOrganization } from '../services/api/organizations'
import { shareLink } from '../services/api/shortener'
import { shareLinkButtons } from '../config/shareLinkButtons'
import { mapStatistics } from '../services/api/map'

const GEOLOCATION_POINT = 'geolocation-point'

export default {
  name: 'Map',
  components: {
    IThemeToggler,
    ILocationButton
  },
  data: () => ({
    is3D: false,
    trackID: null,
    mapTooltip: {},
    map: undefined,
    shareLinkButtons,
    isActiveGooeyMenu: false,
    shareLinkButtonsCallers: {
      shareViaSkype: null,
      shareViewLink: null,
      shareViaTelegram: null,
      shareViaWhatsApp: null,
      shareViaFacebook: null
    },
    isMenuOpen: false,
    isLocationZoomIn: true
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
      hasToEase: state => state.map.hasToEase
    })
  },
  mounted() {
    this.map = this.addMapEvents(this.initMapLayers(this.createMap()))
    bus.$on(CLEAR_SELECTION, this.disableCableHighlight)
    bus.$on(TOGGLE_THEME, this.toggleDarkMode)
    bus.$on(FOCUS_ON, this.handleFocusOn)
    bus.$on(FOCUS_ON_CITY, this.handleCityFocus)
    bus.$on(UPDATE_TIME_MACHINE, this.handleUpdateTimeMachine)
    bus.$on(TOGGLE_FILTER_SELECTION, this.handleFilterSelection)
    bus.$on(SUBSEA_FILTER, this.handleSubseaToggle)
    bus.$on(REMOVE_QUERY_ROUTE_REPLACE, this.handleRemoveQueryRouteReplacer)

    if (this.dark) this.map.setStyle(mapConfig.darkBasemap)
    this.handlePreviouslySelected()

    this.shareLinkButtonsCallers = {
      shareViaSkype: this.shareViaSkype,
      shareViewLink: this.shareViewLink,
      shareViaTelegram: this.shareViaTelegram,
      shareViaWhatsApp: this.shareViaWhatsApp,
      shareViaFacebook: this.shareViaFacebook
    }
  },
  methods: {
    ...mapActions({
      getFacilityData: 'map/getFacilityData',
      getClsData: 'map/getClsData',
      getIxpsData: 'map/getIxpsData',
      changeSidebarMode: 'changeSidebarMode',
      getCableData: 'map/getCableData'
    }),
    activeGooeyMenu() {
      this.isActiveGooeyMenu = !this.isActiveGooeyMenu
      if (this.isActiveGooeyMenu && this.isMenuOpen) {
        this.isMenuOpen = false
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

      const mbCtrl = document.querySelector('.mapboxgl-ctrl-group')
      mbCtrl.classList.add('mapbox-controllers')
      mbCtrl.appendChild(document.getElementById('ThreeD'))
      mbCtrl.appendChild(document.getElementById('FScreen'))
      mbCtrl.appendChild(document.getElementById('Geolocation'))

      window.mapboxgl = mapboxgl
      window.draw = draw

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
      })
      return map
    },
    /**
     * @param map { Object } map instance
     */
    addMapSources(map) {
      const data = mapConfig.data
      const style = this.dark ? 'Dark' : 'Light'
      const buildingPoint = `buildingPoint${style}`
      const buildingLabel = `buildingLabel${style}`
      const buildingFootprint = `buildingFootprint${style}`

      map.addSource(mapConfig[buildingPoint], {
        type: 'geojson',
        data: data.buildingPointUrl
      })

      map.addSource(mapConfig[buildingFootprint], {
        type: 'geojson',
        data: data.buildingPolyUrl
      })

      map.addSource(mapConfig[buildingLabel], {
        type: 'geojson',
        data: data.buildingLabelsUrl
      })

      map.addSource(data.source, {
        type: 'vector',
        url: data.url
      })

      map.addSource(data.highlightSource, {
        type: 'vector',
        url: data.url
      })

      map.addSource(mapConfig.clusterPts, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 15,
        clusterRadius: 50
      })

      const tmm = Date.now()

      map.addSource('cableTMS', {
        type: 'vector',
        scheme: 'tms',
        tiles: [
          `https://map.infrapedia.com/geoserver/gwc/service/tms/1.0.0/infrapedia:cables@EPSG:900913@pbf/{z}/{x}/{y}.pbf?t=${tmm}`
        ],
        minzoom: 0,
        maxzoom: 22
      })

      map.addSource('pointTMS', {
        type: 'vector',
        scheme: 'tms',
        tiles: [
          `https://map.infrapedia.com/geoserver/gwc/service/tms/1.0.0/infrapedia%3Aall_point@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf?t=${tmm}`
        ],
        minzoom: 4
      })

      this.addMapLayers()
    },
    addMapLayers() {
      const map = this.map
      const data = mapConfig.data
      const theme = this.dark ? 'dark' : 'light'
      const currentMapFilter = this.currentMapFilter

      for (let layer of data.layers) {
        if (layer.id === mapConfig.cableLayer) {
          layer.filter = currentMapFilter
          map.addLayer(layer)
        } else if (layer.id === 'buildingLayers') {
          for (let d of layer[theme]) {
            map.addLayer(d)
          }
        } else map.addLayer(layer)
      }

      this.map.setFilter(mapConfig.cableLayer, ['all'])
      this.$store.commit(`${CURRENT_MAP_FILTER}`, ['all'])
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

      map.on('mouseenter', mapConfig.cableLayer, function(e) {
        vm.handlePopupVisibilityOn(e, popup, false)
      })
      map.on('mouseenter', mapConfig.pointsLayer, function(e) {
        vm.handlePopupVisibilityOn(e, popup, true)
      })
      map.on('mouseleave', mapConfig.cableLayer, function() {
        vm.handlePopupVisibilityOff(popup)
      })

      map.on('click', this.handleMapClick)
      map.on('touchend', this.handleMapClick)

      map.on('draw.create', this.handleDraw)
      map.on('draw.delete', this.handleDraw)
      map.on('draw.update', this.handleDraw)

      map.on('render', this.handleBoundsChange)
      map.on('zoom', this.handleZoomLevelChange)

      return map
    },
    handleDraw() {
      const data = window.draw.getAll()
      const wrapper = document.getElementById('calculated-area')

      if (data.features.length) {
        this.$emit(`${DRAWING}`, true)
        let calculated

        if (window.draw.getMode() === 'direct_select') {
          const selected = window.draw.getSelected()
          if (selected.features.length) {
            let featureData = selected.features[0]
            if (featureData.geometry.type.toLowerCase() === 'polygon') {
              this.$emit(`${TITLE_BY_SELECTION}`, 'Area')
              calculated = turf.area(data)
              wrapper.innerHTML =
                '<p><strong>' +
                Math.round(calculated) / 1000 +
                '</strong></p><p>hectares</p>'
            } else if (
              featureData.geometry.type.toLowerCase() === 'linestring'
            ) {
              this.$emit(`${TITLE_BY_SELECTION}`, 'Distance')
              calculated = turf.distance(
                featureData.geometry.coordinates[0],
                featureData.geometry.coordinates[1]
              )
              wrapper.innerHTML =
                '<p><strong>' + calculated + '</strong></p><p>Kms</p>'
            }
          }
          return
        }

        for (let feature of data.features) {
          if (feature.geometry.type.toLowerCase() === 'linestring') {
            this.$emit(`${TITLE_BY_SELECTION}`, 'Distance')
            calculated = turf.distance(
              feature.geometry.coordinates[0],
              feature.geometry.coordinates[1]
            )
            wrapper.innerHTML =
              '<p><strong>' + calculated + '</strong></p><p>Kms</p>'
          } else {
            this.$emit(`${TITLE_BY_SELECTION}`, 'Area')
            calculated = turf.area(data)
            wrapper.innerHTML =
              '<p><strong>' +
              Math.round(calculated) / 1000 +
              '</strong></p><p>hectares</p>'
          }
        }
      } else this.$emit(`${DRAWING}`, false)
    },
    /**
     * @param e { Object } Map's hover Event
     * @param popup { Object } The map popup instance
     * @param map { Object } The map instance
     * @param isPoint { Boolean } If the tooltip is for a Point
     */
    showPopup(e, map, popup, isPoint) {
      const prop = JSON.parse(JSON.stringify(e.features[0].properties))

      this.mapTooltip = {
        name: prop.name,
        status: !!(
          prop.IsInactive === undefined ||
          prop.IsInactive === 'false' ||
          prop.IsInactive === ''
        ),
        segment:
          prop.segment_id === undefined ? null : parseInt(prop.segment_id)
      }

      let str = `<div class="cable-name dark-color"><b>${this.mapTooltip.name}</b></div>`

      if (isPoint) {
        str = `<div class="cable-name dark-color"><b>Point name : ${this.mapTooltip.name}</b></div>`
      } else {
        if (this.mapTooltip.segment) {
          str += `<div class="segment-name dark-color">Segment: ${this.mapTooltip.segment}</div>`
        }
        str += `<div class="status dark-color"> Status: ${this.mapTooltip.status}</div>`
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
    handlePopupVisibilityOn(e, popup, isPoint) {
      if (!this.map) return

      const map = this.map
      const clusterPts = map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.clusterPts]
      })

      if (e.features.length && !clusterPts.length) {
        if (!this.isMobile) {
          map.getCanvas().style.cursor = 'pointer'
          this.showPopup(e, map, popup, isPoint)
        }
      }
    },
    /**
     * @param popup { Object } The map popup instance
     */
    handlePopupVisibilityOff(popup) {
      if (!this.map || !popup) return
      this.map.getCanvas().style.cursor = ''
      popup.remove()
    },
    async handleZoomLevelChange() {
      return await mapStatistics(this.$route.fullPath.split('?')[1])
    },
    async handleBoundsChange() {
      if (!this.map) return

      const { map } = this
      const pitch = map.getPitch()
      const bounds = map.getBounds()
      const bearing = map.getBearing()
      const center = map.cameraForBounds(bounds, {
        padding: { top: 10, bottom: 25, left: 15, right: 5 }
      })

      if (!bounds && !center) return
      try {
        if (!this.focus) {
          await this.$router.replace(
            `?neLng=${bounds._ne.lng}&neLat=${bounds._ne.lat}&swLng=${
              bounds._sw.lng
            }&swLat=${bounds._sw.lat}&zoom=${center.zoom}&bearing=${bearing ||
              0}&pitch=${pitch}&centerLng=${center.center.lng}&centerLat=${
              center.center.lat
            }`
          )
        } else {
          const { id, type, name } = this.focus

          if (id && type) {
            await this.$router.replace(
              `?neLng=${bounds._ne.lng}&neLat=${bounds._ne.lat}&swLng=${
                bounds._sw.lng
              }&swLat=${bounds._sw.lat}&zoom=${center.zoom}&bearing=${bearing ||
                center.bearing ||
                0}&pitch=${pitch}&centerLng=${center.center.lng}&centerLat=${
                center.center.lat
              }&name=${name}&type=${type}&id=${id}`
            )
          }
        }
      } catch {
        // Ignore
      }
    },
    /**
     * @param cable { Object } - Contains the ID of the selected cable
     */
    highlightCable(cable) {
      if (!this.map || !cable) return
      const highlightColor = this.dark
        ? 'rgba(50,50,50,0.35)'
        : 'rgba(23,23,23, 0.06)'

      this.map.setPaintProperty(
        mapConfig.cableLayer,
        'line-color',
        highlightColor
      )
      this.$store.commit(`${CURRENT_MAP_FILTER}`, [
        '==',
        ['get', 'cable_id'],
        Number(cable.cable_id)
      ])
      this.map.setFilter(mapConfig.highlightLayer, [
        '==',
        ['get', 'cable_id'],
        Number(cable.cable_id)
      ])
      this.$store.commit(`${MAP_FOCUS_ON}`, {
        type: 'cable',
        id: cable.cable_id,
        name: cable.name
      })
    },
    /**
     * @param closesSidebar { Boolean } - If besides removing cables highlight it also closes the sidebar
     */
    disableCableHighlight(closesSidebar = true) {
      const { map } = this

      if (closesSidebar) this.$store.commit(`${TOGGLE_SIDEBAR}`, false)
      this.$store.commit(`${CURRENT_MAP_FILTER}`, ['in', 'cable_id', false])
      try {
        map.setFilter(mapConfig.highlightLayer, this.currentMapFilter)
        map.setPaintProperty(
          mapConfig.cableLayer,
          'line-color',
          mapConfig.data.layers[0].paint['line-color']
        )
      } catch {
        // Ignore
      }
    },
    /**
     * @param e { Object } Map's any clicking event
     */
    async handleMapClick(e) {
      // If is currently drawing don't do anything
      if (this.isDrawing) return

      const { map } = this
      let selectionID = null
      const themeColor = this.dark ? 'Dark' : 'Light'
      const buildingPoint = `buildingPoint${themeColor}`
      const buildingFootprint = `buildingFootprint${themeColor}`
      const cables = map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.cableLayer]
      })
      const buildingFootprints = map.queryRenderedFeatures(e.point, {
        layers: [mapConfig[buildingFootprint]]
      })
      const buildingPoints = map.queryRenderedFeatures(e.point, {
        layers: [mapConfig[buildingPoint]]
      })
      const clustersFeats = map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.clusterPts]
      })

      if (buildingFootprints.length) {
        selectionID = buildingFootprints[0].properties.fac_id
      } else if (buildingPoints.length) {
        selectionID = buildingPoints[0].properties.fac_id
      }

      // Display or hide the clusters
      await this.handleClustersSelection(clustersFeats)

      // If in the region selected there is a point or a building
      // Call the api to retrieve that facility data and open the sidebar
      if (selectionID) {
        await this.handleFacilitySelection({ id: selectionID, type: 'fac' })
      }

      // If there is no clusters or didn't select a building/point
      // in the map region clicked then I can say ...
      // That is safe to call the cables selection handler
      if (!clustersFeats.length && !selectionID) {
        await this.handleCablesSelection(!!cables.length, cables)
      }
    },
    async handleOrganizationFocus(_id) {
      const res = await viewOrganization({ user_id: this.$auth.user.sub, _id })
      if (res && res.data && res.data.r && res.data.r.length) {
        // Change sidebar mode to data_centers mode
        this.changeSidebarMode(1)
        // In case there was a cable selected before
        await this.disableCableHighlight(false)
        await this.$store.commit(`${CURRENT_SELECTION}`, res.data.r[0])
        // Updating focus for if the user wants to send alerts

        if (!this.isSidebar) await this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      }
    },
    async handleNetworkSelection(_id) {
      const res = await viewNetwork({ user_id: this.$auth.user.sub, _id })
      if (res && res.data && res.data.r && res.data.r.length) {
        // Change sidebar mode to data_centers mode
        this.changeSidebarMode(1)
        // In case there was a cable selected before
        await this.disableCableHighlight(false)
        await this.$store.commit(`${CURRENT_SELECTION}`, res.data.r[0])

        if (!this.isSidebar) await this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      }
    },
    /**
     * @param bool { Boolean } - If it opens the sidebar
     * @param cables { Object } [{ properties: { cable_id: String } }]
     */
    async handleCablesSelection(bool, cables) {
      switch (bool) {
        case true:
          // Change sidebar mode back to cable in case is on data_centers mode
          await this.changeSidebarMode(-1)
          // Highlight the nearest clicked cable
          await this.highlightCable(cables[0].properties)
          await this.$emit(`${CABLE_SELECTED}`, cables[0].properties)
          break
        default:
          // Remove highlights
          await this.disableCableHighlight()
          // Clear "currentSelection" on store
          await this.$store.commit(`${CURRENT_SELECTION}`, null)
          break
      }
    },
    /**
     * @param clusters { Array }
     */
    async handleClustersSelection(clusters) {
      const { map } = this
      if (clusters.length) {
        // Zoom into the cluster
        await map
          .getSource(mapConfig.clusterPts)
          .getClusterExpansionZoom(clusters[0].properties.cluster_id, function(
            err,
            zoom
          ) {
            if (err) return

            map.easeTo({
              center: clusters[0].geometry.coordinates,
              zoom
            })
          })
      } else {
        // Remove the clusters source data
        await this.map.getSource(mapConfig.clusterPts).setData({
          type: 'FeatureCollection',
          features: []
        })

        // CLEARING CLUSTERS DATA SAVED IN STORE
        this.$store.commit(`${MAP_BOUNDS}`, [])
        this.$store.commit(`${MAP_POINTS}`, [])
        this.$store.commit(`${MAP_FOCUS_ON}`, null)
      }
    },
    /**
     * @param id { String } - ID of the facility (data centers)
     */
    async handleFacilitySelection({ id, type }) {
      const data = await this.getFacilityData({
        user_id: this.$auth.user.sub,
        _id: id
      })
      this.$store.commit(`${MAP_FOCUS_ON}`, {
        id,
        name: data.name,
        type
      })

      // Changing the sidebar mode to data_center mode
      this.changeSidebarMode(1)
      // this.$store.commit(`${CURRENT_SELECTION}`, data)
      // Opening the sidebar
      this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      // Removing cables highlight if any
      this.disableCableHighlight(false)
    },
    async handleClsSelection({ id, type }) {
      const data = await this.getClsData({
        user_id: this.$auth.user.sub,
        _id: id
      })
      this.$store.commit(`${MAP_FOCUS_ON}`, {
        id,
        name: data.name,
        type
      })

      // Changing the sidebar mode to data_center mode
      this.changeSidebarMode(1)
      // this.$store.commit(`${CURRENT_SELECTION}`, data)
      // Opening the sidebar
      this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      // Removing cables highlight if any
      this.disableCableHighlight(false)
    },
    async handleIxpsSelection({ id, type }) {
      const data = await this.getIxpsData({
        user_id: this.$auth.user.sub,
        _id: id
      })
      this.$store.commit(`${MAP_FOCUS_ON}`, {
        id,
        name: data.name,
        type
      })

      // Changing the sidebar mode to data_center mode
      this.changeSidebarMode(1)
      // this.$store.commit(`${CURRENT_SELECTION}`, data)
      // Opening the sidebar
      this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      // Removing cables highlight if any
      this.disableCableHighlight(false)
    },
    toggleDarkMode() {
      this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
      const style = this.dark ? mapConfig.darkBasemap : mapConfig.default
      const map = this.map

      const loadStyles = () => {
        if (!map.loaded()) return

        this.addMapSources(map)
        if (this.$store.state.isLocating) {
          this.isLocationZoomIn = false
          this.geolocateUser()
        }
        if (this.focus && this.focus.type.toLowerCase() === 'cable') {
          this.handleCablesSelection(true, [
            { properties: { cable_id: this.focus.id } }
          ])
        }
        map.off('render', loadStyles)
      }

      const switchStyles = style => {
        map.setStyle(style)
        map.on('render', loadStyles)
      }

      // We have to remove the filter cause if not it will only draw the filtered cable
      map.setFilter(mapConfig.highlightLayer, ['all'])
      this.$store.commit(`${CURRENT_MAP_FILTER}`, ['all'])
      switchStyles(style)
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
      if (this.isMenuOpen && this.isActiveGooeyMenu) {
        this.isActiveGooeyMenu = false
      }
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
    async shareViewLink() {
      const res = await shareLink({
        url: encodeURI(
          `${window.location.origin}${this.$route.fullPath}&hasToEase=true`
        ),
        user_id: this.$auth.user.sub
      })

      if (res && res.data && res.data.r) copyToClipboard(res.data.r)
    },
    async shareViaWhatsApp() {
      const res = await shareLink({
        url: encodeURI(
          `${window.location.origin}${this.$route.fullPath}&hasToEase=true`
        ),
        user_id: this.$auth.user.sub
      })
      if (res && res.data && res.data.r) {
        return copyToClipboard(`https://wa.me/?text=${res.data.r}`)
      }
    },
    async shareViaTelegram() {
      const res = await shareLink({
        url: encodeURI(
          `${window.location.origin}${this.$route.fullPath}&hasToEase=true`
        ),
        user_id: this.$auth.user.sub
      })
      if (res && res.data && res.data.r) {
        return copyToClipboard(
          `https://telegram.me/share/url?url=${res.data.r}`
        )
      }
    },
    async shareViaSkype() {
      const res = await shareLink({
        url: encodeURI(
          `${window.location.origin}${this.$route.fullPath}&hasToEase=true`
        ),
        user_id: this.$auth.user.sub
      })
      if (res && res.data && res.data.r) {
        return copyToClipboard(`https://web.skype.com/share?url=${res.data.r}`)
      }
    },
    async shareViaFacebook() {
      const res = await shareLink({
        url: encodeURI(
          `${window.location.origin}${this.$route.fullPath}&hasToEase=true`
        ),
        user_id: this.$auth.user.sub
      })
      if (res && res.data && res.data.r) {
        return copyToClipboard(
          `https://www.facebook.com/dialog/send?app_id=654189014992874&link=${res.data.r}`
        )
      }
    },
    clearLocation() {
      if (this.trackID) {
        this.geolocation.clearWatch(this.trackID)
      }

      if (this.map.getLayer(GEOLOCATION_POINT)) {
        this.map.removeLayer(GEOLOCATION_POINT)
      }

      this.$store.commit(`${LOCATE_USER}`, false)
    },
    /**
     * @param isLocationZoomIn { Boolean } - For if the map has to ZoomIn when locating the user
     */
    geolocateUser(isLocationZoomIn) {
      if (isLocationZoomIn) {
        this.isLocationZoomIn = true
      }

      this.trackID = navigator.geolocation.watchPosition(
        this.showLocation,
        this.handleGeolocationErrors,
        { maximumAge: 75000, enableHighAccuracy: true, timeout: 60000 }
      )
    },
    /**
     * @param location { Object } - Contains current location coordinates
     */
    showLocation(location) {
      if (!location || !this.map) return

      const map = this.map
      const imageID = 'pulsing-dot'
      const coordinates = location.coords
      const GEOLOCATION_SOURCE_DATA = 'geolocation-point-data'
      const sourceData = map.getSource(GEOLOCATION_SOURCE_DATA)
      const size = 200
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        onAdd() {
          const canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height
          this.context = canvas.getContext('2d')
        },
        render() {
          const duration = 1320
          const t = (performance.now() % duration) / duration
          const radius = (size / 2) * 0.3
          const outerRadius = (size / 2) * 0.7 * t + radius
          const context = this.context
          context.clearRect(0, 0, this.width, this.height)
          context.beginPath()
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          )
          context.fillStyle = 'rgba(29, 161, 242,' + (1 - t) + ')'
          context.fill()
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
          context.fillStyle = 'rgba(29, 161, 242, 1)'
          context.strokeStyle = 'white'
          context.lineWidth = 2 + 4 * (1 - t)
          context.fill()
          context.stroke()
          this.data = context.getImageData(0, 0, this.width, this.height).data
          map.triggerRepaint()
          return true
        }
      }

      if (!map.getLayer(GEOLOCATION_POINT)) {
        if (!sourceData) {
          map.addSource(GEOLOCATION_SOURCE_DATA, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [coordinates.longitude, coordinates.latitude]
              }
            }
          })
        } else {
          sourceData.setData({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [coordinates.longitude, coordinates.latitude]
            }
          })
        }

        // If the image doesn't exit add it
        if (!map.hasImage(imageID)) {
          map.addImage(imageID, pulsingDot, { pixelRatio: 4 })
          // Else update it with the new position
        } else map.updateImage(imageID, pulsingDot)

        map.addLayer({
          id: GEOLOCATION_POINT,
          type: 'symbol',
          layout: {
            'icon-image': imageID
          },
          source: GEOLOCATION_SOURCE_DATA
        })
      }

      if (this.isLocationZoomIn) {
        map.flyTo({
          center: [coordinates.longitude, coordinates.latitude],
          zoom: 20
        })

        this.isLocationZoomIn = false
      }

      this.$store.commit(`${LOCATE_USER}`, true)
    },
    /**
     * @param err { Object } - The error emitted by the HTML5 location service
     */
    handleGeolocationErrors(err) {
      switch (err) {
        case 'UNKNOWN_ERROR':
          console.error(err)
          break
        case 'PERMISSION_DENIED':
          console.error(err)
          break
        case 'POSITION_UNAVAILABLE':
          console.error(err)
          break
        default:
          console.error(err)
          break
      }
    },
    /**
     * @param id { [Number, String] }
     * @param type { String }
     */
    async handleFocusOn({ id, type }) {
      if (!id) {
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
        type: type === 'orgs' ? 'organizations' : type
      })
      // Cleaning source
      await this.map.getSource(mapConfig.clusterPts).setData({
        type: 'FeatureCollection',
        features: []
      })

      switch (type.toLowerCase()) {
        case 'organizations':
          await this.handleOrganizationFocus(id)
          break
        case 'cable':
          await this.handleCableFocus(id)
          break
        case 'facility':
          await this.handleFacilityFocus({ id, type })
          break
        case 'cls':
          await this.handleClsFocus({ id, type })
          break
        case 'ixps':
          await this.handleIxpsFocus({ id, type })
          break
        case 'city':
          await this.handleCityFocus()
          break
        case 'network':
          await this.handleNetworkSelection(id)
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
        await map.fitBounds(bounds, {
          padding: isMobile ? 10 : 35,
          maxZoom: 16.5,
          animate: true,
          speed: 1.75,
          pan: {
            duration: 25
          }
        })
      }
    },
    /**
     * @param id { String } - Cable ID
     */
    async handleCableFocus(id) {
      const { map, focus, bounds, hasToEase } = this

      if (hasToEase) await this.handleFocusOnEasePoints()
      else if (focus && bounds && bounds.length) {
        await map.fitBounds(bounds, {
          padding: 20
        })
      }

      await this.handleCablesSelection(true, [{ properties: { cable_id: id } }])
    },
    /**
     * @param id { String } - Building/DataCenter/Dot ID
     */
    async handleFacilityFocus({ id, type }) {
      const { map, focus, bounds } = this

      await this.handleFacilitySelection({ id, type })
      if (focus && bounds && bounds.length) {
        map.fitBounds(bounds, {
          pan: { duration: 25 },
          animate: true,
          padding: 20,
          speed: 1.1,
          zoom: 12,
          pitch: 45
        })
      }
    },
    async handleClsFocus({ id, type }) {
      const { map, focus, bounds } = this

      await this.handleClsSelection({ id, type })

      if (focus && bounds && bounds.length) {
        map.fitBounds(bounds, {
          pan: { duration: 25 },
          animate: true,
          padding: 20,
          speed: 1.1,
          zoom: 12,
          pitch: 45
        })
      }
    },
    async handleIxpsFocus(data) {
      const { map, focus, bounds } = this

      await this.handleIxpsSelection(data)
      if (focus && bounds && bounds.length) {
        map.fitBounds(bounds, {
          pan: { duration: 25 },
          animate: true,
          padding: 20,
          speed: 1.1,
          zoom: 12,
          pitch: 45
        })
      }
    },
    async handleFocusOnEasePoints() {
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
      this.$store.commit(`${EASE_POINT}`, null)
      this.$store.commit(`${HAS_TO_EASE_TO}`, false)
    },
    async handleSubseaToggle({ bool, isActive }) {
      let filter
      const { map } = this
      const epoch = new Date(`${currentYear()}-02-02`).getTime() / 1000

      if (bool && isActive) {
        filter = mapConfig.filter.activeSubsea
      } else if (bool && !isActive) {
        filter = mapConfig.filter.timemachine
        filter[2] = epoch
      } else if (!bool && isActive) {
        filter = mapConfig.filter.active
      } else {
        filter = ['all']
      }

      await this.disableCableHighlight()
      await map.setFilter(mapConfig.cableLayer, filter)
      await map.setFilter(mapConfig.cableLabelLayer, filter)
    },
    /**
     * @param selection { Number } - 0 being "active" - 1 being "future" - 2 being "activeSubsea" and 3 being "subseaOnly" filter
     */
    async handleFilterSelection(selection) {
      let filter
      const { map } = this
      const filters = mapConfig.filter

      switch (selection) {
        case -1:
          filter = ['all']
          break
        case 0:
          filter = filters.active
          break
        case 1:
          filter = filters.future
          break
        case 2:
          filter = filters.activeSubsea
          break
        case 3:
          filter = 3
          break
      }

      if (filter === 3) {
        return this.handleUpdateTimeMachine({
          year: currentYear(),
          isActive: false,
          isSubseaOnly: true
        })
      }

      await this.disableCableHighlight()
      await map.setFilter(mapConfig.cableLayer, filter)
      await map.setFilter(mapConfig.cableLabelLayer, filter)
    },
    /**
     * @param year { Number } - The year parameter is for toggling if showing only the subsea cables or show them all
     * @param isActive { Bool } - Indicates if the isActive filter is currently active or not
     */
    async handleUpdateTimeMachine({ year, isActive, isSubseaOnly }) {
      const { map } = this
      const isYearEqual = year === currentYear()
      // The epoch is the time arbitrarily selected as a point of reference for the specification of celestial coordinates. In this case, is used for denoting the existence of future cables
      const epoch = new Date(`${year}-02-02`).getTime() / 1000
      let filter = mapConfig.filter.timemachine

      // If the year is the current year or is equal to 0
      // We suppose the user is either deactivating the subsea switch of the filter
      // Or is toggling off/on the checkbox for the subseatime machine slider
      if (!isYearEqual || isSubseaOnly) {
        filter[2] = epoch
      } else if ((year === currentYear() || year === 0) && !isActive) {
        filter = ['all']
      } else if ((year === currentYear() || year === 0) && isActive) {
        if (year === 0) {
          filter = mapConfig.filter.active
        } else {
          filter = mapConfig.filter.activeSubsea
        }
      } else await this.disableCableHighlight()

      await map.setFilter(mapConfig.cableLayer, filter)
      await map.setFilter(mapConfig.cableLabelLayer, filter)
      await this.$store.commit(`${CURRENT_MAP_FILTER}`, filter)
    },
    handlePreviouslySelected: debounce(function() {
      if (!this.currentSelection || !this.focus) return

      const { type, id } = this.focus
      const { map } = this

      if (map.loaded()) {
        if (type === 'cable') {
          this.handleCablesSelection(true, [{ properties: { cable_id: id } }])
        } else if (type) {
          this.handleFacilitySelection({ id, type: 'fac' })
        }
      }
    }, 1200),
    handleRemoveQueryRouteReplacer() {
      return this.map.off('render', this.handleBoundsChange)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/map-styles.scss';
</style>
