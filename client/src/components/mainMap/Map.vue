<template>
  <div id="map">
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
    <el-button
      id="menuOpener"
      circle
      size="small"
      title="Share menu and toggle dark mode button"
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
          <i-theme-toggler
            id="toggleTheme"
            title="Toggle dark mode"
            @click="toggleDarkMode"
          />
        </li>
        <li role="listitem">
          <el-button
            title="Share menu"
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
    <gooey-menu ref="gooey" @active="() => (isMenuOpen = false)" />
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
import { TOGGLE_DARK, TOGGLE_SIDEBAR } from '../../store/actionTypes'
import {
  CURRENT_MAP_FILTER,
  CURRENT_SELECTION,
  MAP_FOCUS_ON,
  HAS_TO_EASE_TO,
  EASE_POINT
} from '../../store/actionTypes/map'
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
import { mapStatistics } from '../../services/api/map'
import handleDraw from './draw'
import boundsChange from './boundsChange'
import highlightCurrentCable from './highlightCable'
import disableCurrentHighlight from './disableHighlight'
import GooeyMenu from './GooeyMenu'

export default {
  name: 'Map',
  components: {
    IThemeToggler,
    GooeyMenu
  },
  data: () => ({
    is3D: false,
    trackID: null,
    mapTooltip: {},
    map: undefined,
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
  },
  methods: {
    ...mapActions({
      getFacilityData: 'map/getFacilityData',
      getClsData: 'map/getClsData',
      getIxpsData: 'map/getIxpsData',
      changeSidebarMode: 'changeSidebarMode',
      getCableData: 'map/getCableData'
    }),
    createMap() {
      mapboxgl.accessToken = mapConfig.mapToken

      const map = new mapboxgl.Map({
        container: 'map',
        zoom: mapConfig.zoom,
        maxZoom: 18,
        minZoom: 1,
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
        map.addSource(source.name, source.opts)
      }
      this.addMapLayers(map)
    },
    addMapLayers(map) {
      for (let layer of mapConfig.data.layers) {
        map.addLayer(layer)
      }
      map.setFilter(mapConfig.cableTerrestrial, mapConfig.filter.all)
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
      const elemnt = document.getElementById('calculated-area')
      return handleDraw({ ctx: this, data, elemnt })
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
        status: prop.category,
        segment: prop.segment
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
      const clusters = map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.clusters]
      })

      if (!clusters.length && e.features.length && !this.isMobile) {
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
        console.error(err)
      }
    },
    /**
     * @param cable { Object } - Contains the ID of the selected cable
     */
    highlightCable(cable) {
      if (!this.map || !cable) return
      try {
        return highlightCurrentCable({
          cable,
          map: this.map,
          dark: this.dark,
          commit: this.$store.commit
        })
      } catch (err) {
        console.error(err)
      }
    },
    /**
     * @param closesSidebar { Boolean } - If besides removing cables highlight it also closes the sidebar
     */
    disableCableHighlight(closesSidebar = true) {
      if (!this.map) return
      try {
        return disableCurrentHighlight({
          closesSidebar,
          map: this.map,
          commit: this.$store.commit,
          handleBoundsChange: this.handleBoundsChange
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
      const clusters = this.map.queryRenderedFeatures(e.point, {
        layers: [mapConfig.clusters]
      })

      // If in the region selected there is a point or a building
      // Call the api to retrieve that facility data and open the sidebar
      // console.log(facilities, ixps, cablesTerrestrial, cablesSubsea)

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
      } else if (clusters.length) {
        await this.handleClustersSelection(clusters, this.map)
      } else if (
        !facilities.length &&
        !ixps.length &&
        !cls.length &&
        !clusters.length
      ) {
        // Clearing clusters source in case there was something previously selected
        this.map
          .getSource(mapConfig.clusters)
          .setData({ type: 'FeatureCollection', features: [] })

        this.disableCableHighlight(true)
      }
    },
    async handleOrganizationFocus(_id, fc) {
      const res = await viewOrganization({ user_id: this.$auth.user.sub, _id })
      if (res && res.data && res.data.r && res.data.r.length) {
        // Change sidebar mode to data_centers mode
        this.changeSidebarMode(1)
        // In case there was a cable selected before
        await this.disableCableHighlight(false)
        await this.$store.commit(`${CURRENT_SELECTION}`, res.data.r[0])

        if (!this.isSidebar) await this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
      }

      if (fc) this.map.getSource(mapConfig.clusters).setData(fc)
      else {
        this.map.flyTo({
          center: mapConfig.center,
          zoom: mapConfig.zoom,
          easing: t => t,
          speed: 1.8,
          curve: 1
        })
      }
    },
    async handleNetworkFocus(_id, fc) {
      const { focus, bounds, map } = this

      const res = await viewNetwork({ user_id: this.$auth.user.sub, _id })
      if (res && res.data && res.data.r && res.data.r.length) {
        // Change sidebar mode to data_centers mode
        this.changeSidebarMode(1)
        // In case there was a cable selected before
        await this.disableCableHighlight(false)
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
     * @param map { Object } Mapbox map - Object reference (ie: this.map)
     */
    async handleClustersSelection(clusters, map) {
      if (!map) return
      await map
        .getSource(mapConfig.clusters)
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
        // if (this.$store.state.isLocating) {
        //   this.isLocationZoomIn = false
        //   this.geolocateUser()
        // }
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
        type: type === 'orgs' ? 'organizations' : type
      })

      // Clearing clusters source in case there was something previously selected
      this.map
        .getSource(mapConfig.clusters)
        .setData({ type: 'FeatureCollection', features: [] })

      switch (type.toLowerCase()) {
        case 'organizations':
          await this.handleOrganizationFocus(id, fc)
          break
        case 'partners':
          await this.handleOrganizationFocus(id, fc)
          break
        case 'cable':
          await this.handleCableFocus(id)
          break
        case 'facility':
          await this.handleFacilityFocus({ id, type })
          break
        case 'facilities':
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
          zoom: 18,
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
          zoom: 18,
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

      if (this.map.loaded()) {
        return this.handleFocusOn({ id: this.focus.id, type: this.focus.type })
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
