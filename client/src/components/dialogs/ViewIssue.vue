<template>
  <div class="el-dialog__wrapper z-index120" v-show="isVisible">
    <transition
      tag="div"
      mode="in-out"
      name="animated faster"
      enter-active-class="fadeInDown"
      leave-active-class="fadeOutUp"
    >
      <div class="inner-wrapper el-dialog" v-show="isVisible">
        <div class="el-dialog__header">
          <header class="w-fit-full p0 no-selectable">
            <h1 class="inline-block font-semibold fs-xlarge">
              Viewing issue: {{ data.name }}
            </h1>
            <el-button
              class="el-dialog__headerbtn p0"
              type="text"
              @click="$emit('close')"
            >
              <fa
                :icon="['fas', 'times']"
                class="el-dialog__close el-icon el-icon-close"
              />
            </el-button>
          </header>
        </div>
        <div class="el-dialog__body">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-row>
                <el-col :lg="24">
                  <strong>
                    <p>Issue:</p>
                  </strong>
                </el-col>
                <el-col :lg="24">
                  <p class="ml5">{{ data.issue }}</p>
                </el-col>
                <br />
                <el-col :lg="3">
                  <strong>
                    <p>rgDate:</p>
                  </strong>
                </el-col>
                <el-col :lg="21">
                  <p>{{ data.rgDate }}</p>
                </el-col>
                <el-col :lg="3">
                  <strong>
                    <p>Email:</p>
                  </strong>
                </el-col>
                <el-col :lg="21">
                  <p>{{ data.email }}</p>
                </el-col>
                <el-col :lg="3">
                  <strong>
                    <p>Phone:</p>
                  </strong>
                </el-col>
                <el-col :lg="21">
                  <p>{{ data.phone }}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <div class="map-elm relative">
                <div id="map" class="w-fit-full" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { mapConfig } from '../../config/mapConfig'

export default {
  name: 'ViewIssueDialog',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    map: null,
    draw: null
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  watch: {
    isVisible(bool) {
      if (!bool) return

      this.map = this.createMap()
      this.addIssueDraw()
      this.toggleTheme(this.dark)
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
      })

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: false
      })
      const scaleCtrl = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      })

      this.draw = draw
      map.addControl(scaleCtrl, 'bottom-left')
      map.addControl(draw, 'bottom-left')
      return map
    },
    addIssueDraw() {
      const elemnt = this.data.elemnt_id.geom
      this.draw.set(elemnt)
      let bbox = []
      let coords = []

      if (elemnt.features[0].geometry.type !== 'Point') {
        coords = [
          elemnt.features[0].geometry.coordinates[0],
          elemnt.features[elemnt.features.length - 1].geometry.coordinates[0]
        ]
        bbox = coords.reduce(
          (bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        )
      } else {
        // Calculation of bounds for points
        coords = [
          elemnt.features[0].geometry.coordinates,
          elemnt.features[elemnt.features.length - 1].geometry.coordinates
        ]
        bbox = coords.reduce(
          (bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        )
      }

      this.map.fitBounds(bbox, {
        padding: 90,
        animate: true,
        zoom: 3.68,
        speed: 1.75,
        pan: {
          duration: 25
        }
      })
    },
    toggleTheme(dark) {
      if (!this.map) return

      const style = dark ? mapConfig.darkBasemap : mapConfig.default
      this.map.setStyle(style)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/view-issue-dialog-styles.scss';
</style>
