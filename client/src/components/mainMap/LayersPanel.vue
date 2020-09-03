<template>
  <div
    class="layers-wrapper flex column bottom-shadow w34 transition-all"
    :class="{ dark, 'adjust-position': !isLegendsPanelActive }"
  >
    <header class="pt2 pb2 pr4 pl4 flex justify-content-space-between">
      Layers
      <el-button
        @click="toggleVisibility"
        title="Layers togglers"
        :type="isActive ? 'info' : ''"
        icon="el-icon-info"
        size="mini"
        circle
        class="w6 h6 vertical-align p2"
      />
    </header>
    <div
      :class="{ active: isActive }"
      id="layers-info-wrapper"
      class="transition-all"
    >
      <el-divider :class="{ dark }" class="mt1 mb1 w-fit-full" />
      <div class="flex column">
        <div
          class="box p1 mb1 inline-flex justify-content-space-between pr4 pl4"
          :class="{ light: !dark, dark }"
          v-for="key in Object.keys(layers)"
          :key="key"
        >
          <span class="capitalize">
            {{ layers[key].label ? layers[key].label : key }}
          </span>
          <el-switch
            :width="40"
            class="ml2 mt1"
            v-model="layers[key].active"
            @change="handleSwitchValueChange($event, key, layers)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapConfig } from '../../config/mapConfig'
import { bus } from '../../helpers/eventBus'

export default {
  name: 'LayersPanel',
  data: () => ({
    isLegendsPanelActive: true,
    activeLayers: ['all'],
    isActive: true,
    layers: {
      [mapConfig.cls]: {
        active: true
      },
      [mapConfig.ixps]: {
        active: true
      },
      [mapConfig.facilities]: {
        active: false,
        label: 'Facilities Buildings'
      },
      [mapConfig.facilitiesClusters]: {
        active: true,
        label: 'Facilities Clusters'
      },
      terrestrial: {
        active: true,
        label: 'Terrestrial Networks'
      },
      subsea: {
        active: true,
        label: 'Subsea Cables'
      }
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  mounted() {
    bus.$on('legends-panel-visibility', this.handleLegendsPanelVisilityChange)
  },
  beforeDestroy() {
    bus.$off('legends-panel-visibility', this.handleLegendsPanelVisilityChange)
  },
  methods: {
    handleSwitchValueChange(bool, layer, layers) {
      if (layer == mapConfig.facilitiesClusters) {
        this.layers[mapConfig.facilities].active = !bool
      }

      this.$emit('toggle-layer', {
        active: bool,
        layerName: layer,
        layersDict: layers
      })
    },
    handleLegendsPanelVisilityChange(bool) {
      this.isLegendsPanelActive = bool
    },
    toggleVisibility() {
      this.isActive = !this.isActive
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/layers-panel-styles.scss';
</style>
