<template>
  <div :style="sidebarStyleOnMobile">
    <transition
      tag="div"
      mode="out-in"
      :name="transitionsClasses.name"
      :enter-active-class="transitionsClasses.active"
      :leave-active-class="transitionsClasses.leave"
      >
      <div
        v-if="isSidebar"
        :style="sidebarStyle"
        class="sidebar-wrapper"
      >
        <el-card shadow="hover" v-loading="isLoading">
          <header class="header pt8 pr8 pl14 pb12 h12">
            <el-tooltip
              effect="dark"
              transition="animated faster slideDown delay-2s"
              content="Click to copy link"
              placement="bottom">
              <h1
                class="inline-block cursor-pointer title font-bold m0 p1 round truncate fs-large underline"
                @click="copyToClip"
              >
                {{ currentSelection.name }}
              </h1>
            </el-tooltip>
            <p class="text-bold">
              {{ currentSelection.segment_name }}
            </p>
          </header>
          <!---------------------- SIDEBAR MODES ----------------------->
          <transition mode="out-in" name="fade">
            <component :is="currentView" :info="currentSelection" />
          </transition>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as modes from '../config/sidebarModes'
import { createBitlyURL } from '../services/api/bitly'
import copyToClipboard from '../helpers/copyToClipboard'

export default {
  name: 'ISidebar',
  components: {
    'i-data-center': () => import('./sidebarModes/dataCenter'),
    'i-cable-attributes': () => import('./sidebarModes/cableAttributes')
  },
  data: () => ({
    sidebarStyleOnMobile: {},
    sidebarStyle: {},
    isBadge: false,
    transitionsClasses: {
      name: 'animated faster',
      active: 'slideInLeft',
      leave: 'slideOutLeft'
    }
  }),
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      isSidebar: state => state.isSidebar,
      sidebarMode: state => state.map.sidebarMode,
      currentSelection: state => state.map.currentSelection
    }),
    defaultMode() {
      return modes.CABLE_MODE
    },
    isCable() {
      return this.sidebarMode === this.defaultMode
    },
    currentView() {
      return this.isCable ? 'i-cable-attributes' : 'i-data-center'
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeWatcher)
    this.resizeWatcher()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeWatcher)
  },
  methods: {
    setFullSidebarHeight() {
      const mobileWidth = 425
      if (window.innerWidth <= mobileWidth) {
        this.sidebarStyleOnMobile = {
          height: '97vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }
        this.sidebarStyle = { height: '100%', overflow: 'auto' }
      } else {
        this.sidebarStyle = { height: '100%', overflow: 'auto' }
      }
    },
    resizeWatcher() {
      const mobileWidth = 425
      if (window.innerWidth <= mobileWidth) {
        this.transitionsClasses = {
          name: 'animated faster',
          active: 'slideInUp',
          leave: 'zoomOutLeft'
        }
        return true
      } else {
        this.transitionsClasses = {
          name: 'animated faster',
          active: 'slideInLeft',
          leave: 'slideOutLeft'
        }
        return false
      }
    },
    async copyToClip() {
      this.isBadge = true
      const { id, opt, name } = this.$store.state.currentSelection
      if (!id || !opt || !name) return

      let url
      if (this.$route.query.neLng) {
        url = `${window.location.origin}${this.$route.fullPath}`
      } else url = `${window.location.origin}?name=${name}&type=${opt}&id=${id}`

      const res = await createBitlyURL(url)
      if (res) copyToClipboard(encodeURI(res.link))
      setTimeout(() => (this.isBadge = false), 820)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/sidebar-styles.scss';
</style>
