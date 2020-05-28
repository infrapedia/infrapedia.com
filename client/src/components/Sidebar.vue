<template>
  <transition
    v-if="currentSelection"
    tag="div"
    mode="out-in"
    :name="transitionsClasses.name"
    :enter-active-class="transitionsClasses.active"
    :leave-active-class="transitionsClasses.leave"
  >
    <div
      v-if="isSidebar"
      class="sidebar-wrapper"
      :class="{
        active: this.isSidebarActive,
        'full-active': this.isSidebarFullActive
      }"
    >
      <el-card shadow="hover">
        <header
          class="header pt10 pr8 pl8 h-fit-content pb10 relative"
          @click.stop="toggleActiveClassOnMobile"
        >
          <el-button
            type="text"
            class="inline-block icon fs-medium p2 transition-all circle vertical-align absolute cursor-pointer"
            @click="closeSidebar"
          >
            <fa :icon="['fas', 'times']" />
          </el-button>
          <el-tooltip
            effect="dark"
            content="Click to copy link"
            placement="bottom"
          >
            <h1
              class="inline-block cursor-pointer relative title font-bold m0 p1 round dont-break-out fs-large underline"
              @click.stop="copyToClip"
            >
              {{ currentSelection.name }}
              <el-button
                v-if="focus.type.toLowerCase() !== 'owners'"
                type="text"
                id="verified-i"
                @click.stop="handleVerification"
                class="transparent inline-block cursor-pointer"
                :class="{ 'is-verified': isVerified }"
                :title="isVerified ? 'Owner verified' : 'Owner unverified'"
              >
                <certificated-icon v-if="isVerified" />
                <span v-else>
                  <fa :icon="['fas', 'check-double']" />
                </span>
              </el-button>
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
// import { CURRENT_SELECTION, MAP_FOCUS_ON } from '../store/actionTypes/map'
import {
  BUY_CAPACITY,
  EDIT_CABLE,
  REPORT_ISSUE,
  CREATE_ALERT
} from '../events/sidebar'
import { shareLink } from '../services/api/shortener'
import { TOGGLE_VERIFICATION_DIALOG } from '../store/actionTypes'
import { getCookie, deleteCookie } from '../helpers/cookies'
import { queryCookieName } from '../config/sharedViewCookieName'

export default {
  name: 'ISidebar',
  components: {
    CertificatedIcon: () => import('./CertificatedIcon'),
    'i-data-center': () => import('./sidebarModes/dataCenter'),
    'i-cable-attributes': () => import('./sidebarModes/cableAttributes')
  },
  data: () => ({
    isBadge: false,
    BUY_CAPACITY,
    EDIT_CABLE,
    REPORT_ISSUE,
    CREATE_ALERT,
    prohibitedIDs: [],
    currentSelectionColumns: [],
    isSidebarActive: false,
    isSidebarFullActive: false,
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
      isSidebar: state => state.isSidebar,
      sidebarMode: state => state.sidebarMode,
      currentSelection: state => state.map.currentSelection
    }),
    defaultMode() {
      return modes.CABLE_MODE
    },
    isCable() {
      return this.sidebarMode == this.defaultMode
    },
    isVerified() {
      return this.prohibitedIDs.includes(this.currentSelection.uuid)
    },
    currentView() {
      return this.isCable ? 'i-cable-attributes' : 'i-data-center'
    }
  },
  watch: {
    isSidebar(bool) {
      if (!bool || !this.focus) return
      this.isSidebarActive = false
      this.isSidebarFullActive = false
      this.handleColSelectionChange()
    },
    // eslint-disable-next-line
    currentSelection(selection) {
      this.isSidebarActive = false
      this.isSidebarFullActive = false
      this.handleColSelectionChange()
    },
    // eslint-disable-next-line
    sidebarMode(mode) {
      this.isSidebarActive = false
      this.isSidebarFullActive = false
      this.handleColSelectionChange()
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeWatcher)
    this.resizeWatcher()
    this.prohibitedIDs = process.env.VUE_APP_RESTRICTED_IDS
      ? process.env.VUE_APP_RESTRICTED_IDS.split(',')
      : []
  },
  mounted() {
    this.handleColSelectionChange()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeWatcher)
  },
  methods: {
    handleColSelectionChange() {
      if (!this.focus) return

      let columns = getSelectionCols(this.focus.type)
      // activationDateTime column is irrelevant on terrestrial cables
      if (this.currentSelection && this.currentSelection.terrestrial) {
        columns = columns.filter(col => col.value != 'activationDateTime')
      }

      this.currentSelectionColumns = Array.from(columns)

      if (window.localStorage.getItem('__easePointData')) {
        window.localStorage.removeItem('__easePointData')
      }

      if (
        this.$route.query.sharedView &&
        window.localStorage.getItem('__easePointDataLoaded') == 'true'
      ) {
        this.$router.replace(window.origin + this.$route.path)
        deleteCookie(queryCookieName)
      }
    },
    toggleActiveClassOnMobile() {
      const isMobile = this.resizeWatcher()
      if (isMobile) {
        this.isSidebarActive = !this.isSidebarActive
        if (this.isSidebarActive) {
          setTimeout(() => {
            this.isSidebarFullActive = true
          }, 325)
        } else {
          this.isSidebarFullActive = false
        }
      }
    },
    resizeWatcher() {
      const mobileWidth = 425
      if (window.innerWidth <= mobileWidth) {
        this.transitionsClasses = {
          name: 'animated faster delay-1s',
          active: 'slideInUp',
          leave: 'slideOutDown'
        }
        return true
      } else {
        this.transitionsClasses = {
          name: 'animated faster delay-1s',
          active: 'slideInLeft',
          leave: 'slideOutLeft'
        }
        return false
      }
    },
    async copyToClip() {
      if (!this.focus) return

      this.isBadge = true
      const res = await shareLink({
        url: window.origin + this.$route.path + getCookie(queryCookieName),
        user_id: await this.$auth.getUserID()
      })
      if (res && res.data && res.data.r) {
        return copyToClipboard(res.data.r)
      }

      setTimeout(() => (this.isBadge = false), 820)
    },
    handleVerification() {
      return this.$store.commit(`${TOGGLE_VERIFICATION_DIALOG}`, true)
    },
    closeSidebar() {
      return bus.$emit(
        `${CLEAR_SELECTION}`,
        true,
        this.focus.type.split().join('')
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/sidebar-styles.scss';
</style>
