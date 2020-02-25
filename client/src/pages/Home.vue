<template>
  <div class="no-overflow">
    <!----------- THE CABLE SELECTED HANDLER COMES FROM --------------->
    <!---------------- THE "dataCollection" MIXIN --------------------->
    <i-map
      @drawing="handleIsDrawing"
      @title-by-selection="title = $event"
      @cable-selected="handleCableSelected"
    />
    <div
      v-show="isDrawing"
      class="absolute calculation-box truncate w44 h22 p1 text-center"
    >
      <h4 class="mt2 mb2 font-medium">{{ title }}</h4>
      <div id="calculated-area" class="font-medium fs-regular" />
    </div>
  </div>
</template>

<script>
import Map from '../components/mainMap/Map.vue'
import { bus } from '../helpers/eventBus'
import debounce from '../helpers/debounce'
import dataCollection from '../mixins/dataCollection.vue'
import { IS_DRAWING, TOGGLE_SIDEBAR } from '../store/actionTypes'
import { FOCUS_ON_CITY, REMOVE_QUERY_ROUTE_REPLACE } from '../events'
import { HAS_TO_EASE_TO, EASE_POINT } from '../store/actionTypes/map'

export default {
  name: 'home',
  mixins: [dataCollection],
  components: {
    'i-map': Map
  },
  data: () => ({
    title: ''
  }),
  computed: {
    isDrawing() {
      return this.$store.state.isDrawing
    },
    isSidebar() {
      return this.$store.state.isSidebar
    }
  },
  beforeCreate() {
    // If the route has a query it must be a link shared
    if (this.$route.query.hasToEase) {
      this.$store.commit(`${HAS_TO_EASE_TO}`, true)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSidebar) this.$store.commit(`${TOGGLE_SIDEBAR}`, false)
    bus.$emit(REMOVE_QUERY_ROUTE_REPLACE)
    next()
  },
  async mounted() {
    if (this.$store.state.editor.scene.features.list.length) {
      this.$store.dispatch('editor/setList', [])
    }
    await this.loadDataIfQueryParamsExist()
    setTimeout(() => {
      if (this.$auth && window.localStorage.getItem('auth.token-session'))
        return
      else this.$router.push('/login')
    }, 1200)
  },
  methods: {
    /**
     * @param bool { Boolean } - The current state of the drawing plugin (activated - deactivated)
     */
    handleIsDrawing(bool) {
      return this.$store.commit(`${IS_DRAWING}`, bool)
    },
    loadDataIfQueryParamsExist: debounce(async function() {
      const {
        id,
        type,
        zoom,
        swLng,
        swLat,
        neLat,
        neLng,
        pitch,
        bearing,
        centerLat,
        centerLng,
        hasToEase
      } = this.$route.query

      // If all this query params exist we can assume it's a view sharing
      // So we need to save the easePoint on the store
      if (
        swLat &&
        neLat &&
        neLng &&
        swLng &&
        zoom &&
        bearing &&
        pitch &&
        centerLat &&
        centerLng &&
        hasToEase === 'true'
      ) {
        this.$store.commit(`${EASE_POINT}`, {
          center: [
            [neLng, neLat],
            [swLng, swLat]
          ],
          cameraCenter: [centerLng, centerLat],
          hasToEase: true,
          bearing,
          pitch,
          zoom
        })
      }

      // If there is there is no id or nor type only ease to the coordinates point
      // Otherwise if only cable and type exist we open the sidebar and not ease
      return !id || !type
        ? bus.$emit(`${FOCUS_ON_CITY}`)
        : await this.handleItemListSelection({ option: type, id })
    }, 2200)
  }
}
</script>
