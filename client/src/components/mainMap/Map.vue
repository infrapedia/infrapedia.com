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
  TOGGLE_THEME,
  CABLE_SELECTED,
  CLEAR_SELECTION,
  FOCUS_ON,
  FOCUS_ON_CITY,
  REMOVE_QUERY_ROUTE_REPLACE
} from '../../events'
import {
  TOGGLE_FILTER_SELECTION,
  UPDATE_TIME_MACHINE,
  SUBSEA_FILTER
} from '../../events/filter'
import {
  // TOGGLE_LOADING,
  TOGGLE_DARK,
  LOCATE_USER,
  TOGGLE_SIDEBAR
} from '../../store/actionTypes'
import {
  CURRENT_MAP_FILTER,
  CURRENT_SELECTION,
  MAP_FOCUS_ON,
  MAP_BOUNDS,
  MAP_POINTS,
  HAS_TO_EASE_TO,
  EASE_POINT
} from '../../store/actionTypes/map'
import ILocationButton from '../../components/LocationButton'
import copyToClipboard from '../../helpers/copyToClipboard'
import IThemeToggler from '../../components/ThemeToggler'
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
import { shareLink } from '../../services/api/shortener'
import { shareLinkButtons } from '../../config/shareLinkButtons'
import { mapStatistics } from '../../services/api/map'
import handleDraw from './draw'
import boundsChange from './boundsChange'

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
      for (let source of mapConfig.data.sources) {
        map.addSource(source.name, { ...source.opts })
      }
      this.addMapLayers()
    },
    addMapLayers() {
      const map = this.map

      for (let layer of mapConfig.data.layers) {
        map.addLayer(layer)
      }

      this.map.setFilter(mapConfig.cableTerrestrial, mapConfig.filter.all)
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

      map.on('mouseenter', mapConfig.cableTerrestrial, function(e) {
        vm.handlePopupVisibilityOn(e, popup, false)
      })
      map.on('mouseenter', mapConfig.cableSubsea, function(e) {
        vm.handlePopupVisibilityOn(e, popup, false)
      })
      map.on('mouseenter', mapConfig.ixps, function(e) {
        vm.handlePopupVisibilityOn(e, popup, true)
      })
      map.on('mouseleave', mapConfig.cableTerrestrial, function() {
        vm.handlePopupVisibilityOff(popup)
      })

      map.on('click', this.handleMapClick)
      map.on('touchend', this.handleMapClick)

      map.on('draw.create', this.handleDrawEvents)
      map.on('draw.delete', this.handleDrawEvents)
      map.on('draw.update', this.handleDrawEvents)

      map.on('render', this.handleBoundsChange)
      map.on('zoom', this.handleZoomLevelChange)

      return map
    },
    handleDrawEvents() {
      const data = window.draw.getAll()
      const wrapper = document.getElementById('calculated-area')
      return handleDraw({ ctx: this, data, elemnt: wrapper })
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
      // const clusterPts = map.queryRenderedFeatures(e.point, {
      //   layers: [mapConfig.clusterPts]
      // })

      // if (e.features.length && !clusterPts.length) {
      if (e.features.length && !this.isMobile) {
        map.getCanvas().style.cursor = 'pointer'
        this.showPopup(e, map, popup, isPoint)
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
      const zoomLevel = this.map.getZoom()
      if (zoomLevel >= 6.4) {
        return await mapStatistics(this.$route.fullPath.split('?')[1])
      }
    },
    async handleBoundsChange() {
      if (!this.map) return

      try {
        return await boundsChange({ ctx: this, map: this.map })
      } catch (err) {
        this.$notify({
          type: 'error',
          message: err.message,
          title: 'Missing a parameter'
        })
      }
    },
    /**
     * @param cable { Object } - Contains the ID of the selected cable
     */
    highlightCable(cable) {
      if (!this.map || !cable) return

      const unselectedColor = this.dark
        ? 'rgba(250, 250, 250, 0.6)'
        : 'rgba(23,23,23, 0.2)'

      // Changing cables line colors
      this.map.setPaintProperty(
        mapConfig.cableTerrestrial,
        'line-color',
        unselectedColor
      )
      this.map.setPaintProperty(
        mapConfig.cableSubsea,
        'line-color',
        unselectedColor
      )

      // Showing only the selected cable on the highlight layer
      this.map.setFilter(mapConfig.cableTerrestrialHighlight, [
        '==',
        ['get', '_id'],
        cable._id
      ])
      this.map.setFilter(mapConfig.cableSubseaHighlight, [
        '==',
        ['get', '_id'],
        cable._id
      ])

      // Keeping record of the selection and map current filter
      this.$store.commit(`${CURRENT_MAP_FILTER}`, [
        '==',
        ['get', '_id'],
        cable._id
      ])
      this.$store.commit(`${MAP_FOCUS_ON}`, {
        type: 'cable',
        id: cable._id,
        name: cable.name
      })
    },
    /**
     * @param closesSidebar { Boolean } - If besides removing cables highlight it also closes the sidebar
     */
    disableCableHighlight(closesSidebar = true) {
      const { map } = this

      try {
        if (closesSidebar) {
          this.$store.commit(`${TOGGLE_SIDEBAR}`, false)
          this.$store.commit(`${MAP_FOCUS_ON}`, null)
          this.handleBoundsChange()
        }

        this.$store.commit(`${CURRENT_MAP_FILTER}`, mapConfig.filter.all)

        // Removing highlight layer filter
        map.setFilter(mapConfig.cableSubseaHighlight, ['in', '_id', false])
        map.setFilter(mapConfig.cableTerrestrialHighlight, ['in', '_id', false])

        // Changing cables colors back to normal
        map.setPaintProperty(
          mapConfig.cableTerrestrial,
          'line-color',
          mapConfig.data.layers[0].paint['line-color']
        )
        map.setPaintProperty(
          mapConfig.cableSubsea,
          'line-color',
          mapConfig.data.layers[3].paint['line-color']
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

      const cablesTerrestrial = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.cableTerrestrial]
      })
      const cablesSubsea = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.cableSubsea]
      })
      const facilities = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.facilities]
      })
      const ixps = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.ixps]
      })
      const cls = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.cls]
      })

      // If in the region selected there is a point or a building
      // Call the api to retrieve that facility data and open the sidebar
      console.log(facilities, ixps, cablesTerrestrial, cablesSubsea)

      if (facilities.length) {
        await this.handleFacilitySelection({
          id: facilities[0].properties._id,
          type: 'facilities'
        })
      } else if (ixps.length) {
        await this.handleIxpsSelection({
          id: facilities[0].properties._id,
          type: 'ixps'
        })
      } else if (cls.length) {
        await this.handleClsSelection({
          id: cls[0].properties._id,
          type: 'ixps'
        })
      }

      if (cablesTerrestrial.length) {
        await this.handleCablesSelection(
          !!cablesTerrestrial.length,
          cablesTerrestrial
        )
      } else if (cablesSubsea.length) {
        await this.handleCablesSelection(!!cablesSubsea.length, cablesSubsea)
      } else if (!facilities.length && !ixps.length && !cls.length) {
        this.disableCableHighlight(true)
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
      const map = this.map

      this.$store.commit(`${TOGGLE_DARK}`, !this.dark)

      const style = this.dark ? mapConfig.darkBasemap : mapConfig.default
      // If I dont' remove this events it will throw some errors at the console

      const loadStyles = () => {
        if (!map.loaded()) return

        this.addMapSources(map)
        if (this.$store.state.isLocating) {
          this.isLocationZoomIn = false
          this.geolocateUser()
        }
        if (this.focus && this.focus.type.toLowerCase() === 'cable') {
          this.handleCablesSelection(true, [
            { properties: { _id: this.focus.id } }
          ])
        }
        map.off('render', loadStyles)
      }

      const switchStyles = style => {
        map.setStyle(style)
        map.on('render', loadStyles)
      }

      // We have to remove the filter cause if not it will only draw the filtered cable
      map.setFilter(mapConfig.cableTerrestrialHighlight, ['all'])
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
        type: type === 'orgs' ? 'organizations' : type
      })
      // Cleaning source
      // await this.map.getSource(mapConfig.clusterPts).setData({
      //   type: 'FeatureCollection',
      //   features: []
      // })

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

      await this.handleCablesSelection(true, [{ properties: { _id: id } }])
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
    async handleSubseaToggle(bool) {
      const filter = bool ? mapConfig.filter.subsea : mapConfig.filter.all

      await this.disableCableHighlight()
      this.$nextTick(() => {
        this.map.setFilter(mapConfig.cableTerrestrial, filter)
        this.map.setFilter(mapConfig.cableTerrestrialLabel, filter)
      })
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
          filter = filters.all
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
          isActive: false
        })
      }

      await this.disableCableHighlight()
      if (selection === 2) {
        await map.setFilter(mapConfig.cableSubsea, filter)
        await map.setFilter(mapConfig.cableSubseaLabel, filter)
      } else {
        await map.setFilter(mapConfig.cableSubsea, filter)
        await map.setFilter(mapConfig.cableSubseaLabel, filter)
        await map.setFilter(mapConfig.cableTerrestrial, filter)
        await map.setFilter(mapConfig.cableTerrestrialLabel, filter)
      }
    },
    /**
     * @param year { Number } - The year parameter is for toggling if showing only the subsea cables or show them all
     * @param isActive { Bool } - Indicates if the isActive filter is currently active or not
     */
    async handleUpdateTimeMachine({ year, target, isActive }) {
      const { map } = this
      // The epoch is the time arbitrarily selected as a point of reference for the specification of celestial coordinates. In this case, is used for denoting the existence of future cables
      const epoch = new Date(`${year}-02-02`).getTime()
      let filter = mapConfig.filter.timemachine

      if (target === 'checkbox') {
        if (isActive) {
          await map.setFilter(
            mapConfig.cableTerrestrial,
            mapConfig.filter.subsea
          )
          await map.setFilter(
            mapConfig.cableTerrestrialLabel,
            mapConfig.filter.subsea
          )

          filter[2] = epoch
          await map.setFilter(mapConfig.cableSubsea, filter)
        } else {
          filter = mapConfig.filter.all
          await map.setFilter(mapConfig.cableSubsea, filter)
          await map.setFilter(mapConfig.cableSubseaLabel, filter)
          await map.setFilter(mapConfig.cableTerrestrial, filter)
          await map.setFilter(mapConfig.cableTerrestrialLabel, filter)
        }
      } else if (target === 'slider') {
        await map.setFilter(mapConfig.cableSubsea, filter)
        await map.setFilter(mapConfig.cableSubseaLabel, filter)
      }

      await this.$store.commit(`${CURRENT_MAP_FILTER}`, filter)
    },
    handlePreviouslySelected: debounce(function() {
      if (!this.currentSelection || !this.focus) return

      const { type, id } = this.focus
      const { map } = this

      if (map.loaded()) {
        if (type === 'cable') {
          this.handleCablesSelection(true, [{ properties: { _id: id } }])
        } else if (type) {
          this.handleFacilitySelection({ id, type: 'facilities' })
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
@import '../../assets/scss/components/map-styles.scss';
</style>
