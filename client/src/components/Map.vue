<template>
  <div id="map">
    <el-button
      id="ThreeD"
      type="text"
      size="small"
      class="m0 p0"
      @click="toggleFullScreen"
    >
      <fa :icon="['fas', 'expand-arrows-alt']" />
    </el-button>
    <el-button
      id="FScreen"
      type="text"
      @click="toggleThreeD"
      size="small"
      class="m0 p0"
      >3D</el-button>
  </div>
</template>

<script>
import { mapConfig } from '../config/mapConfig'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'
import { mapState } from 'vuex'
import { DRAWING, TITLE_BY_SELECTION } from '../events'
import turf from 'turf'

let mapboxgl

export default {
  name: 'Map',
  data: () => ({
    is3D: false,
    map: undefined,
    mapTooltip: {}
  }),
  computed: {
    ...mapState({
      dark: state => state.dark,
      isMobile: state => state.isMobile,
      currentMapFilter: state => state.map.filter
    })
  },
  mounted() {
    mapboxgl = require('mapbox-gl/dist/mapbox-gl')
    try {
      this.map = this.addMapEvents(this.initMapLayers(this.createMap()))
    } catch (err) {
      console.log(mapboxgl)
      console.error(err)
    }
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
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }),
        'top-right'
      )

      const mbCtrl = document.querySelector('.mapboxgl-ctrl-group')
      mbCtrl.classList.add('mapbox-controllers')
      mbCtrl.appendChild(document.getElementById('ThreeD'))
      mbCtrl.appendChild(document.getElementById('FScreen'))

      window.mapboxgl = mapboxgl
      window.draw = draw

      return map
    },
    initMapLayers(map) {
      if (!map) return
      let vm = this
      map.on('load', function() {
        vm.addMapLayers(map)
      })
      return map
    },
    addMapLayers(map) {
      const data = mapConfig.data
      const fc = {
        type: 'FeatureCollection',
        features: []
      }

      const style = this.dark ? 'Dark' : 'Light'
      const buildingPoint = `buildingPoint${style}`
      const buildingFootprint = `buildingFootprint${style}`
      const buildingLabel = `buildingLabel${style}`

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
        data: fc,
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

      for (const layer of data.layers) {
        if (layer.id === mapConfig.cableLayer) {
          layer.filter = this.currentMapFilter
          map.addLayer(layer)
        } else if (layer.id === 'buildingLayers') {
          const theme = this.dark ? 'dark' : 'light'
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
        vm.handlePopupVisibilityOn(e, map, popup, false)
      })
      map.on('mouseenter', mapConfig.pointsLayer, function(e) {
        vm.handlePopupVisibilityOn(e, map, popup, true)
      })
      map.on('mouseleave', mapConfig.cableLayer, function() {
        vm.handlePopupVisibilityOff(map, popup)
      })
      map.on('touchend', function(e) {
        vm.handleMobileTouchEnd(e, map)
      })
      map.on('click', function(e) {
        vm.handleMapClick(e, map)
      })
      map.on('click', mapConfig.cableLayer, function(e) {
        vm.handleCableLayerClick(e, map)
      })
      map.on('click', mapConfig.pointsLayer, function(e) {
        vm.handlePointsLayerClick(e, map)
      })

      map.on('draw.create', this.updateArea)
      map.on('draw.delete', this.updateArea)
      map.on('draw.update', this.updateArea)
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
    handlePopupVisibilityOn(e, map, popup, isPoint) {
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
    handlePopupVisibilityOff(map, popup) {
      if (!map || !popup) return
      map.getCanvas().style.cursor = ''
      popup.remove()
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/map-styles.scss';
</style>
