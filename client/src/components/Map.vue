<template>
  <div id="map" />
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import { mapConfig } from '../config/mapConfig'
// import { MapboxDraw } from '@mapbox/mapbox-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'

export default {
  name: 'Map',
  mounted() {
    this.createMap()
  },
  methods: {
    createMap() {
      mapboxgl.accessToken = mapConfig.mapToken

      new mapboxgl.Map({
        container: 'map',
        style: mapConfig.default,
        zoom: mapConfig.zoom,
        center: mapConfig.center
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
      // map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      // map.addControl(
      //   new mapboxgl.GeolocateControl({
      //     positionOptions: {
      //       enableHighAccuracy: true
      //     },
      //     trackUserLocation: true
      //   }),
      //   'top-right'
      // )

      // const mbCtrl = document.querySelector('.mapboxgl-ctrl-group')
      // mbCtrl.classList.add('mapbox-controllers')
      // mbCtrl.appendChild(this.$refs.threeD.$el)
      // mbCtrl.appendChild(this.$refs.fScreen.$el)
    },
    toggleFullScreen() {
      const el = document.querySelector('.application--wrap')
      if (!document.fullscreen) {
        el.requestFullscreen().catch(err => {
          console.error(err)
        })
      } else {
        document.exitFullscreen()
      }
    },
    toggleThreeD() {}
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/map-styles.scss';
</style>
