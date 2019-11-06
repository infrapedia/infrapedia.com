<template>
  <div class="no-overflow">
    <!----------- THE CABLE SELECTED HANDLER COMES FROM --------------->
    <!---------------- THE "dataCollection" MIXIN --------------------->
    <i-map
      @drawing="handleIsDrawing"
      @title-by-selection="title = $event"
      @cable-selected="handleCableSelected"
      />
    <div v-show="isDrawing" class="absolute calculation-box truncate w44 h22 p1 text-center">
      <h4 class="mt2 mb2 font-medium">{{ title }}</h4>
      <div id="calculated-area" class="font-medium fs-regular" />
    </div>
  </div>
</template>

<script>
import Map from '../components/Map.vue'
import { bus } from '../helpers/eventBus'
import { FOCUS_ON_CITY } from '../events'
import debounce from '../helpers/debounce'
import { IS_DRAWING } from '../store/actionTypes'
import dataCollection from '../mixins/dataCollection.vue'
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
    }
  },
  beforeCreate() {
    // If the route has a query it must be a link shared
    if (this.$route.query.neLng) this.$store.commit(`${HAS_TO_EASE_TO}`, true)
  },
  async mounted() {
    await this.loadDataIfQueryParamsExist()
  },
  methods: {
    /**
     * @param bool { Boolean } - The current state of the drawing plugin (activated - deactivated)
     */
    handleIsDrawing(bool) {
      this.$store.commit(`${IS_DRAWING}`, bool)
    },
    loadDataIfQueryParamsExist:debounce(async function() {
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
        centerLng
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
        centerLng
      ) {
        this.$store.commit(`${EASE_POINT}`, {
          center: [[neLng, neLat], [swLng, swLat]],
          cameraCenter: [centerLng, centerLat],
          hasToEase: true,
          bearing,
          pitch,
          zoom
        })
      }

      // If there is there is no id or nor type only ease to the coordinates point
      if (!id || !type) return bus.$emit(`${FOCUS_ON_CITY}`)
      // Otherwise if only cable and type exist we open the sidebar and not ease
      await this.handleItemListSelection({ option: type, id })
    }, 4200)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/home-styles.scss';
</style>
