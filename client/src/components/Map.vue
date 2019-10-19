<template>
  <div id="map">
    <el-button id="ThreeD" type="text" @click="toggleFullScreen" size="small" class="m0 p0">
      <fa :icon="['fas', 'expand-arrows-alt']" />
    </el-button>
    <el-button id="FScreen" type="text" @click="toggleThreeD" size="small" class="m0 p0">3D</el-button>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import { mapConfig } from '../config/mapConfig'
// import { MapboxDraw } from '@mapbox/mapbox-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'

export default {
  name: 'Map',
  data: () => ({
    is3D: false,
    map: undefined,
    currentMapFilter: ['all']
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  mounted() {
    this.map = this.createMap()
    this.initLayers()
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

      // const draw = new MapboxDraw({
      //   displayControlsDefault: false,
      //   controls: {
      //     polygon: true,
      //     trash: true,
      //     line_string: true
      //   }
      // })

      // map.addControl(draw, 'top-right')
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

      return map
    },
    initLayers() {
      if (!this.map) return
      let vm = this
      this.map.on('load', function() {
        vm.addLayers()
      })
    },
    addLayers(map = this.map) {
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
    toggleFullScreen() {
      const el = document.querySelector('.application')
      if (!document.fullscreen) {
        el.requestFullscreen().catch(err => console.error(err))
      } else {
        document.exitFullscreen()
      }
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
