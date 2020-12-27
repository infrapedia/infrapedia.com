<template>
  <div class="relative">
    <el-button
      circle
      type="primary"
      class="w11 h11"
      title="Last Mile Tool"
      @click="handleClick"
    >
      <fa :icon="['fas', 'wave-square']" />
    </el-button>
  </div>
</template>

<script>
import { IS_LMT } from '../../store/actionTypes/map'
import LastMileTool, { lastMileToolLayers } from './gri-tool'

export default {
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    tool: {}
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    active() {
      return this.$store.state.map.isLastMileTool
    },
    isUserLoggedIn() {
      return this.$auth.isAuthenticated
    }
  },
  watch: {
    'tool.networks': {
      handler(v) {
        if (v) {
          this.$emit('change-network', v)
        }
      }
    },
    'tool.len': {
      handler(v) {
        if (v) {
          this.$emit('change-length', v)
        }
      }
    }
  },
  created() {
    if (this.map) this.initTool(this.map)
  },
  beforeDestroy() {
    this.tool.clearLastMileTool()
    this.map.getCanvas().style.cursor = ''
    this.$store.commit(`${IS_LMT}`, false)
    this.$emit('change-length', 0)
    this.$emit('change-network', [])
  },
  methods: {
    handleClick() {
      if (!this.map) return

      if (!this.active) {
        if (this.isUserLoggedIn) {
          this.tool.initService()
          this.tool.registerEvents()
          this.map.getCanvas().style.cursor = 'crosshair'
        }
        this.$store.commit(`${IS_LMT}`, true)
      } else {
        this.tool.clearLastMileTool()
        this.map.getCanvas().style.cursor = ''
        this.$store.commit(`${IS_LMT}`, false)
      }
    },
    initTool(map) {
      let vm = this
      this.tool = new LastMileTool({ map })
      try {
        lastMileToolLayers(map)
      } catch {
        // Ignore
      }

      map.on('click', async function(e) {
        if (vm.active) {
          await vm.tool.find(e.lngLat)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/print-button-styles.scss';
</style>
