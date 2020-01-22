<template>
  <transition
    v-if="currentSelection"
    tag="div"
    mode="out-in"
    :name="transitionsClasses.name"
    :enter-active-class="transitionsClasses.active"
    :leave-active-class="transitionsClasses.leave"
  >
    <div v-if="isSidebar" class="sidebar-wrapper" :class="classGiver">
      <el-card shadow="hover" v-loading="isSidebarLoad">
        <header
          class="header pt10 pr8 pl8 pb10 h12 relative"
          @click.stop="toggleActiveClassOnMobile"
        >
          <span
            class="inline-block w4 h4 icon fs-medium p2 transition-all circle vertical-align absolute cursor-pointer"
            @click="closeSidebar"
          >
            <fa :icon="['fas', 'times']" />
          </span>
          <el-tooltip
            effect="dark"
            content="Click to copy link"
            placement="bottom"
          >
            <h1
              class="inline-block cursor-pointer title font-bold m0 p1 round truncate fs-large underline"
              @click="copyToClip"
            >
              {{ currentSelection.name }}
            </h1>
          </el-tooltip>
          <p class="text-bold">{{ currentSelection.segment_name }}</p>
        </header>
        <!---------------------- SIDEBAR MODES ----------------------->
        <transition mode="out-in" name="fade">
          <component
            :is="currentView"
            :info="currentSelection"
            :columns="currentSelectionColumns"
            @edit-cable="$emit(EDIT_CABLE, $event)"
            @buy-capacity="$emit(BUY_CAPACITY, $event)"
            @report-issue="$emit(REPORT_ISSUE, $event)"
            @create-alert="$emit(CREATE_ALERT, $event)"
            @selection="handleItemListSelection"
          />
        </transition>
      </el-card>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import { bus } from '../helpers/eventBus'
import { CLEAR_SELECTION } from '../events'
import * as modes from '../config/sidebarModes'
import dataCollection from '../mixins/dataCollection'
import copyToClipboard from '../helpers/copyToClipboard'
import { getSelectionCols } from '../helpers/getSelectionCols'
import { CURRENT_SELECTION, MAP_FOCUS_ON } from '../store/actionTypes/map'
import {
  BUY_CAPACITY,
  EDIT_CABLE,
  REPORT_ISSUE,
  CREATE_ALERT
} from '../events/sidebar'

export default {
  name: 'ISidebar',
  components: {
    'i-data-center': () => import('./sidebarModes/dataCenter'),
    'i-cable-attributes': () => import('./sidebarModes/cableAttributes')
  },
  data: () => ({
    isBadge: false,
    BUY_CAPACITY,
    EDIT_CABLE,
    REPORT_ISSUE,
    CREATE_ALERT,
    currentSelectionColumns: [],
    isSidebarActive: false,
    transitionsClasses: {
      name: 'animated faster',
      active: 'slideInLeft',
      leave: 'slideOutLeft'
    }
  }),
  mixins: [dataCollection],
  computed: {
    ...mapState({
      focus: state => state.map.focus,
      isLoading: state => state.isLoading,
      isSidebar: state => state.isSidebar,
      sidebarMode: state => state.sidebarMode,
      currentSelection: state => state.map.currentSelection
    }),
    classGiver() {
      return this.isSidebarActive ? { active: 'active' } : {}
    },
    defaultMode() {
      return modes.CABLE_MODE
    },
    isCable() {
      return this.sidebarMode === this.defaultMode
    },
    currentView() {
      return this.isCable ? 'i-cable-attributes' : 'i-data-center'
    },
    isSidebarLoad() {
      return this.isLoading && !this.isSidebar
    }
  },
  watch: {
    isSidebar(bool) {
      if (!bool || !this.focus) return

      this.currentSelectionColumns = getSelectionCols(this.focus.type)
    },
    // eslint-disable-next-line
    currentSelection(selection) {
      if (this.focus) {
        this.currentSelectionColumns = getSelectionCols(this.focus.type)
      }
    },
    // eslint-disable-next-line
    sidebarMode(mode) {
      if (this.focus) {
        this.currentSelectionColumns = getSelectionCols(this.focus.type)
      }
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
    toggleActiveClassOnMobile() {
      this.isSidebarActive = !this.isSidebarActive
    },
    resizeWatcher() {
      const mobileWidth = 425
      if (window.innerWidth <= mobileWidth) {
        this.transitionsClasses = {
          name: 'animated faster',
          active: 'slideInUp',
          leave: 'slideOutDown'
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
      if (!this.focus) return

      const { id, type, name } = this.focus
      let url

      this.isBadge = true
      if (this.$route.query.neLng) {
        url = `${window.location.origin}${this.$route.fullPath}`
      } else {
        url = `${window.location.origin}?name=${name}&type=${type}&id=${id}`
      }

      copyToClipboard(encodeURI(`${url}&hasToEase=true`))
      setTimeout(() => (this.isBadge = false), 820)
    },
    closeSidebar() {
      bus.$emit(`${CLEAR_SELECTION}`)
      this.isSidebarActive = false
      this.$store.commit(`${MAP_FOCUS_ON}`, null)
      this.$store.commit(`${CURRENT_SELECTION}`, null)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/sidebar-styles.scss';
</style>
