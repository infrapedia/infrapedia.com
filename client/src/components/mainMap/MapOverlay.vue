<template>
  <div class="no-overflow">
    <!----------- THE CABLE SELECTED HANDLER COMES FROM --------------->
    <!---------------- THE "dataCollection" MIXIN --------------------->
    <i-map
      @drawing="handleIsDrawing"
      @map-loaded="$emit('map-loaded')"
      @title-by-selection="title = $event"
    />
    <div
      v-show="isDrawing"
      class="absolute calculation-box truncate w44 h22 p1 text-center"
    >
      <h4 class="mt2 mb2 font-medium">{{ title }}</h4>
      <div id="calculated-area" class="font-medium fs-regular" />
    </div>
    <i-mobile-drawer
      :visibility.sync="isMobileDrawer"
      @close="handleToggleDrawerVisibility"
      @click-list-item="handleItemListSelection"
      @toggle-marketplace="emitToggleMarketplace"
    />
  </div>
</template>

<script>
import Map from './Map.vue'
import { bus } from '../../helpers/eventBus'
import debounce from '../../helpers/debounce'
import dataCollection from '../../mixins/dataCollection.vue'
import { IS_DRAWING, TOGGLE_SIDEBAR } from '../../store/actionTypes'
import { FOCUS_ON_CITY, PARAMS_SELECTION } from '../../events'
import { HAS_TO_EASE_TO, EASE_POINT } from '../../store/actionTypes/map'
import * as navbarEvents from '../../events/navbar'

export default {
  name: 'MapOverlay',
  mixins: [dataCollection],
  components: {
    'i-map': Map,
    IMobileDrawer: () => import('../../components/MobileDrawer.vue')
  },
  data: () => ({
    title: '',
    isMapLoaded: false,
    isBlogOverlay: false,
    isMobileDrawer: false
  }),
  computed: {
    isDrawing() {
      return this.$store.state.isDrawing
    },
    isSidebar() {
      return this.$store.state.isSidebar
    },
    caretPosition() {
      return this.isBlogOverlay ? ['fas', 'caret-down'] : ['fas', 'caret-up']
    }
  },
  beforeCreate() {
    // If the route has a query it must be a link shared
    if (this.$route.query.hasToEase || this.$route.query.amphasToEase) {
      this.$store.commit(`${HAS_TO_EASE_TO}`, true)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSidebar) this.$store.commit(`${TOGGLE_SIDEBAR}`, false)
    next()
  },
  async mounted() {
    await this.loadDataIfQueryParamsExist()
  },
  created() {
    bus.$on(
      `${navbarEvents.TOGGLE_MOBILE_DRAWER}`,
      this.handleToggleDrawerVisibility
    )
    bus.$on(`${PARAMS_SELECTION}`, this.handleParamsRoute)
  },
  beforeDestroy() {
    bus.$off(
      `${navbarEvents.TOGGLE_MOBILE_DRAWER}`,
      this.handleToggleDrawerVisibility
    )
    bus.$off(`${PARAMS_SELECTION}`, this.handleParamsRoute)
  },
  methods: {
    emitToggleMarketplace() {
      bus.$emit(`${navbarEvents.TOGGLE_MARKETPLACE}`)
    },
    setMapLoaded() {
      this.isMapLoaded = true
    },
    handleParamsRoute(params) {
      let vm = this
      this.$once('map-loaded', function executeWhenMapIsLoaded() {
        setTimeout(() => {
          vm.handleItemListSelection(params)
        }, 1200)
      })
    },
    handleToggleDrawerVisibility() {
      this.isMobileDrawer = !this.isMobileDrawer
    },
    /**
     * @param bool { Boolean } - The current state of the drawing plugin (activated - deactivated)
     */
    handleIsDrawing(bool) {
      return this.$store.commit(`${IS_DRAWING}`, bool)
    },
    loadDataIfQueryParamsExist: debounce(function() {
      setTimeout(() => {
        if (window.localStorage.getItem('__easePointData')) {
          const query = JSON.parse(
            window.localStorage.getItem('__easePointData')
          )

          // If all this query params exist we can assume it's a view sharing
          // So we need to save the easePoint on the store
          if (
            query.swLat &&
            query.neLat &&
            query.neLng &&
            query.swLng &&
            query.zoom &&
            query.bearing &&
            query.pitch &&
            query.centerLat &&
            query.centerLng &&
            query.sharedView == 'true'
          ) {
            const boundsData = {
              center: [
                [query.neLng, query.neLat],
                [query.swLng, query.swLat]
              ],
              cameraCenter: [query.centerLng, query.centerLat],
              bearing: query.bearing,
              pitch: query.pitch,
              zoom: query.zoom,
              hasToEase: true
            }

            this.$store.commit(`${EASE_POINT}`, boundsData)
          }

          // If there is there is no id or nor type only ease to the coordinates point
          // Otherwise if only cable and type exist we open the sidebar and not ease
          !query.id || !query.type
            ? bus.$emit(`${FOCUS_ON_CITY}`)
            : this.handleItemListSelection({ option: query.type, id: query.id })
        }
      }, 1000)
    }, 2200)
  }
}
</script>
