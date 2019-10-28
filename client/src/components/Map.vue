<template>
  <div id="map">
    <el-button
      id="FScreen"
      type="text"
      @click="toggleThreeD"
      size="small"
      class="m0 p0"
      :class="{ dark }"
      >3D</el-button>
    <el-button
      id="ThreeD"
      type="text"
      size="small"
      class="m0 p0"
      :class="{ dark }"
      @click="toggleFullScreen"
    >
      <fa :icon="['fas', 'expand-arrows-alt']"  class="sm-icon" />
    </el-button>
    <i-location-button @click="geolocateUser(true)" @enter="geolocateUser(true)" />
    <el-button
      id="menuOpener"
      circle
      size="small"
      class="absolute z-index1 w11 h11"
      @click.stop="toggleMenu"
      tabindex="0"
    >
      <fa :icon="['fas', 'user-circle']" class="icon fs-medium" v-if="!isMenuOpen" />
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
            circle
            class="color-inherit"
            @click="shareViewLink"
            :class="{ dark }"
          >
            <fa :icon="['fas', 'share-alt']" class="sm-icon" />
          </el-button>
        </li>
      </ul>
    </el-button>
  </div>
</template>

<script>
import { DRAWING, TITLE_BY_SELECTION, TOGGLE_THEME } from '../events'
import { TOGGLE_DARK, LOCATE_USER } from '../store/actionTypes'
import ILocationButton from '../components/LocationButton'
import IThemeToggler from '../components/ThemeToggler'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import { mapConfig } from '../config/mapConfig'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { bus } from '../helpers/eventBus'
import 'mapbox-gl/dist/mapbox-gl.css'
import { mapState } from 'vuex'
import turf from 'turf'

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
    isMenuOpen: false,
    isLocationZoomIn: true
  }),
  computed: {
    ...mapState({
      dark: state => state.isDark,
      isMobile: state => state.isMobile,
      currentMapFilter: state => state.map.filter,
      currentSelection: state => state.map.currentSelection
    })
  },
  mounted() {
    this.map = this.addMapEvents(this.initMapLayers(this.createMap()))
    bus.$on(`${TOGGLE_THEME}`, this.toggleDarkMode)
  },
  methods: {
    createMap() {
      mapboxgl.accessToken = mapConfig.mapToken

      const map = new mapboxgl.Map({
        container: 'map',
        zoom: mapConfig.zoom,
        center: mapConfig.center,
        style: mapConfig.default
        // maptiks_id: mapConfig.maptiks_id
      })

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
          line_string: true
        }
      })

      map.addControl(draw, 'top-right')
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
    initMapLayers(map) {
      if (!map) return
      let vm = this
      map.on('load', function() {
        vm.addMapSources(map)
      })
      return map
    },
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
    },
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
      map.on('touchend', this.handleMobileTouchEnd)
      map.on('click', mapConfig.cableLayer, this.handleCableLayerClick)
      map.on('click', mapConfig.pointsLayer, this.handlePointsLayerClick)

      map.on('draw.create', this.updateArea)
      map.on('draw.delete', this.updateArea)
      map.on('draw.update', this.updateArea)

      map.on('zoom', this.handleBoundsChange)
      map.on('movend', this.handleBoundsChange)
      map.on('pitchend', this.handleBoundsChange)
      return map
    },
    updateArea() {
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
    showPopup(e, map, popup, isPoint) {
      const prop = JSON.parse(JSON.stringify(e.features[0].properties))

      this.mapTooltip = {
        id: parseInt(prop.cable_id),
        name: prop.name,
        status: !!(
          prop.IsInactive === undefined ||
          prop.IsInactive === 'false' ||
          prop.IsInactive === ''
        ),
        segment:
          prop.segment_id === undefined ? null : parseInt(prop.segment_id),
        segmentName: null,
        hasOutage: prop.hasoutage === undefined ? false : prop.hasoutage,
        hasPartialOutage:
          prop.haspartial === undefined ? false : prop.haspartial,
        fields: [],
        eosEpoch: prop.eosepoch,
        isHighlighted: false
      }

      let str = `<div class="cable-name dark-color"><b>${this.mapTooltip.name}</b></div>`

      if (isPoint){
        str = `<div class="cable-name dark-color"><b>Point name : ${this.mapTooltip.name}</b></div>`
      } else {
        if (this.mapTooltip.segment) {
          str += `<div class="segment-name dark-color">Segment: ${this.mapTooltip.segment}</div>`
        }
        str += `<div class="details dark-color">Click for more details</div>`
      }

      popup
        .setLngLat(e.lngLat)
        .setHTML(str)
        .addTo(map)
    },
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
    handlePopupVisibilityOff(popup) {
      if (!this.map || !popup) return
      this.map.getCanvas().style.cursor = ''
      popup.remove()
    },
    async handleBoundsChange() {
      if (!this.map) return

      const map = this.map
      const pitch = map.getPitch()
      const bounds = map.getBounds()
      const bearing = map.getBearing()
      const center = map.cameraForBounds(bounds, {
        padding: { top: 10, bottom: 25, left: 15, right: 5 }
      })

      if (!bounds && center) return

      if (this.currentSelection) {
        const { id, opt, name } = this.currentSelection

        if (id && opt && name) {
          await this.$router.replace(
            `?neLng=${bounds._ne.lng}&neLat=${bounds._ne.lat}&swLng=${
              bounds._sw.lng
            }&swLat=${bounds._sw.lat}&zoom=${center.zoom}&bearing=${bearing ||
              center.bearing ||
              0}&pitch=${pitch}&centerLng=${center.center.lng}&centerLat=${
              center.center.lat
            }&name=${name}&type=${opt}&id=${id}`
          )
        }
      } else {
        await this.$router.replace(
          `?neLng=${bounds._ne.lng}&neLat=${bounds._ne.lat}&swLng=${
            bounds._sw.lng
          }&swLat=${bounds._sw.lat}&zoom=${center.zoom}&bearing=${bearing ||
            0}&pitch=${pitch}&centerLng=${center.center.lng}&centerLat=${
            center.center.lat
          }`
        )
      }
    },
    handleMapClick(e) {
      console.log('Clicked map', e)
    },
    handleCableLayerClick(e) {
      console.log('Clicked cable layer', e)
    },
    handlePointsLayerClick(e) {
      console.log('Clicked points layer', e)
    },
    toggleDarkMode() {
      this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
      const style = this.dark ? mapConfig.darkBasemap : mapConfig.default
      const map = this.map

      const loadStyles = () => {
        if (map.loaded()) {
          this.addMapSources(map)
          this.addMapLayers()
          if (this.$store.state.isLocating) {
            this.isLocationZoomIn = false
            this.geolocateUser()
          }
          map.off('render', loadStyles)
        }
      }

      const switchStyles = style => {
        map.setStyle(style)
        map.on('render', loadStyles)
      }

      switchStyles(style)
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
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
    shareViewLink() {
      console.warn('Not done yet')
    },
    clearLocation() {
      if (this.trackID) {
        this.geolocation.clearWatch(this.trackID)
      }

      if (this.map.getLayer('geolocation-point')) {
        this.map.removeLayer('geolocation-point')
      }

      this.$store.commit(`${LOCATE_USER}`, false)
    },
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
    showLocation(location) {
      if (!location || !this.map) return

      const map = this.map
      const imageID = 'pulsing-dot'
      const coordinates = location.coords
      const sourceData = map.getSource('geolocation-point-data')
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

      if (!map.getLayer('geolocation-point')) {
        if (!sourceData) {
          map.addSource('geolocation-point-data', {
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
          id: 'geolocation-point',
          type: 'symbol',
          layout: {
            'icon-image': imageID
          },
          source: 'geolocation-point-data'
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/map-styles.scss';
</style>
