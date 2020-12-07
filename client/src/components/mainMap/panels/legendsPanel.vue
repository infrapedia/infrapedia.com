<template>
  <div
    class="legends-wrapper flex column bottom-shadow w34 transition-all"
    :class="{ dark }"
  >
    <header class="pt2 pb2 pr4 pl4 flex justify-content-space-between">
      Legend
      <el-button
        @click="toggleVisibility"
        title="Display legend information"
        :type="isActive ? 'info' : ''"
        icon="el-icon-info"
        size="mini"
        circle
        class="w6 h6 vertical-align p2"
      />
    </header>
    <div
      :class="{ active: isActive }"
      id="legend-info-wrapper"
      class="transition-all"
    >
      <el-divider :class="{ dark }" class="mt1 mb1 w-fit-full" />
      <div class="flex column">
        <div
          class="box p1 mb1 inline-flex align-items-center pr4 pl4"
          :class="{ light: !dark, dark }"
          v-for="b in legend"
          :key="b.label"
        >
          <div
            class="color inline-block h4 circle"
            :style="`background-color:${b.color}; min-width: 1rem;`"
          />
          <span class="capitalize pl1">
            {{ b.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '../../../helpers/eventBus'

export default {
  name: 'LegendsPanel',
  data: () => ({
    isActive: true
  }),
  computed: {
    legend() {
      return [
        {
          color: '#7288b0',
          label: 'active'
        },
        {
          color: '#BFADA3',
          label: 'decommissioned'
        },
        {
          color: '#FF0000',
          label: 'fault'
        },
        {
          color: '#CC591F',
          label: 'partial outage'
        },
        {
          color: '#af6ec7',
          label: 'project'
        },
        {
          color: '#F7B267',
          label: 'clusters connection'
        }
      ]
    },
    mobile() {
      return window.innerWidth < 520
    },
    dark() {
      return this.$store.state.isDark
    }
  },
  watch: {
    mobile(bool) {
      if (bool) {
        this.isActive = false
      }
    }
  },
  created() {
    bus.$on('toggle-legend-panel', this.closeLegendPanel)
  },
  beforeDestroy() {
    bus.$off('toggle-legend-panel', this.closeLegendPanel)
  },
  mounted() {
    if (this.mobile) this.isActive = false
  },
  methods: {
    closeLegendPanel() {
      this.isActive = false
      bus.$emit('legends-panel-visibility', this.isActive)
    },
    toggleVisibility() {
      this.isActive = !this.isActive
      bus.$emit('legends-panel-visibility', this.isActive)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/components/legends-panel-styles.scss';
</style>
