<template>
  <div class="cursor-pointer circle p2 w4 h4 vertical-align hidden-md-and-up">
    <span class="sm-icon" @click="toggleVisibility">
      <fa :icon="['fas', 'search']" />
    </span>
    <transition name="fade" mode="out-in">
      <div
        v-if="isFullScreen"
        class="absolute full-screen z-index1 transition-all"
        :class="{ dark, light: !dark }"
      >
        <el-input
          placeholder="Search"
          :class="{ dark }"
          v-model="search"
          clearable
          autofocus
          @input="getQueryData"
        />
        <ul class="mt8 color-inherit">
          <li
            v-for="(result, i) in searchResults"
            :key="i"
            tabindex="0"
            role="listitem"
            :class="{ dark, light: !dark }"
            class="pt7 pb7 pr5 pl5 cursor-pointer seamless-hoverbg no-outline truncate"
            @click="handlePlaceSelection(result)"
            @keyup.enter.space="handlePlaceSelection(result)"
          >
          {{ result.name }}
          <span
            v-if="result.premium && result.premium === 'true'"
            class="w6 p1 h6 partner circle flo-right vertical-align mt-2"
          >
            <fa :icon="['fas', 'star']" class="sm-icon " />
          </span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { bus } from '../helpers/eventBus'
import debounce from '../helpers/debounce'
import { MAP_BOUNDS } from '../store/actionTypes/map'
import { FOCUS_ON, SEARCH_SELECTION } from '../events'

export default {
  name: 'IFullScreenSearch',
  data: () => ({
    isFullScreen: false,
    searchResults: [],
    search: ''
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    toggleVisibility() {
      this.isFullScreen = !this.isFullScreen
    },
    getQueryData: debounce(async function(querystring) {
      if (querystring.length <= 1) return
      const res = await this.$store.dispatch('getSearchQueryData', querystring)
      const places = await this.$store.dispatch('getSearchQueryDataMapbox', querystring)

      if (!res) return
      Array.from(places.features).forEach(
        place => (place.name = place.place_name)
      )
      this.searchResults = res.concat(places.features)
    }, 820),
    handlePlaceSelection(selection) {
      // If the selection has geometry it mind it's a city
      if (selection.geometry) {
        let bounds = []
        if (selection.bbox) bounds = selection.bbox
        else if (selection.center) bounds = [...selection.center, ...selection.center]

        if (bounds.length) this.$store.commit(`${MAP_BOUNDS}`, bounds)
        bus.$emit(FOCUS_ON, {
          id: selection.id,
          type: 'city'
        })
      } else {
        // Otherwise if must be an org/facility/datacenter, etc...
        this.$emit(SEARCH_SELECTION, { id: selection.id, option: selection.type })
      }

      this.toggleVisibility()
      this.searchResults = []
      this.search = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/full-screen-search-styles.scss';
</style>
