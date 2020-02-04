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
              <el-table :data="tableData" stripe>
                <el-table-column label="Property">
                  <template slot-scope="scope">
                    <p
                      v-if="scope.row.property === 'rgDate'"
                      class="capitalize"
                    >
                      Register Date
                    </p>
                    <p v-else class="capitalize">
                      {{ scope.row.property }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="Value">
                  <template slot-scope="scope">
                    <a
                      v-if="scope.row.property === 'phone'"
                      :href="`tel:${scope.row.value}`"
                      target="_blank"
                    >
                      {{ scope.row.value }}
                    </a>
                    <p v-else>
                      {{ scope.row.value }}
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
              <div id="map" class="w-fit-full" />
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
import { formatDate } from '../../helpers/formatDate'

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
    draw: null,
    tableData: [],
    acceptedKeys: ['rgDate', 'issue', 'email', 'phone']
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
      this.handleDataVisualization()
      setTimeout(() => {
        this.map.resize()
      }, 220)
    }
  },
  mounted() {
    this.handleDataVisualization()
  },
  methods: {
    handleDataVisualization() {
      if (!this.data || !this.isVisible) return

      this.tableData = Object.keys(this.data)
        .map(key => {
          if (this.acceptedKeys.includes(key) && key.includes('Date')) {
            return {
              property: key,
              value: this.data[key] ? formatDate(this.data[key]) : 'no data'
            }
          } else {
            return this.acceptedKeys.includes(key)
              ? {
                  property: key,
                  value: this.data[key] ? this.data[key] : 'no data'
                }
              : false
          }
        })
        .filter(d => d)

      if (!this.map) this.map = this.createMap()
      this.addIssueDraw()
      return this.toggleTheme(this.dark)
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
        controls: false
      })
      const scaleCtrl = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      })

      this.draw = draw
      let vm = this
      map.addControl(scaleCtrl, 'bottom-left')
      map.addControl(draw, 'bottom-left')
      // eslint-disable-next-line
      map.on('draw.selectionchange', function(e) {
        return vm.draw.changeMode('simple_select', {})
      })
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
