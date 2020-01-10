<template>
  <el-popover
    placement="bottom-start"
    width="420"
    transition="el-zoom-in-top"
    trigger="manual"
    v-model="isResultsVisible"
  >
    <el-card class="p0 no-border" shadow="never">
      <ul role="list" class="w-fit-full h80 no-outline no-selectable">
        <li
          v-for="(place, i) in searchResults"
          :key="i"
          tabindex="0"
          role="listitem"
          :class="{ dark, light: !dark }"
          class="pt7 pb7 pr5 pl5 cursor-pointer seamless-hoverbg no-outline"
          @click="handlePlaceSelection(place)"
          @keyup.enter.space="handlePlaceSelection(place)"
        >
          {{ place.name }}
          <span
            v-if="place.premium && place.premium === 'true'"
            class="w22 p1 h6 partner round flo-right vertical-align mt-2"
          >
            Partner
            <fa :icon="['fas', 'star']" class="sm-icon ml2" />
          </span>
        </li>
      </ul>
    </el-card>
    <div slot="reference" role="search">
      <el-input
        placeholder="Search"
        :class="{ dark }"
        v-model="search"
        @blur="loseFocus"
        @focus="setFocus"
        @input="getQueryData"
      >
        <fa slot="prefix" :icon="['fas', 'search']" class="mt3 ml1" />
        <fa
          v-if="!isFocused"
          slot="suffix"
          :icon="['fas', 'caret-down']"
          class="xsm-icon vertical-align mt3 mr3"
        />
        <fa
          v-else
          slot="suffix"
          :icon="['fas', 'caret-up']"
          class="xsm-icon vertical-align mt3 mr3"
        />
        <fa
          slot="suffix"
          :icon="['fas', 'times']"
          class="xsm-icon vertical-align mt3 mr2"
          @click.stop="clearSearch"
        />
      </el-input>
    </div>
  </el-popover>
</template>

<script>
import { bus } from '../helpers/eventBus'
import debounce from '../helpers/debounce'
import { MAP_BOUNDS } from '../store/actionTypes/map'
import { FOCUS_ON, SEARCH_SELECTION } from '../events'

export default {
  data: () => ({
    search: '',
    isFocused: false,
    searchResults: [],
    isResultsVisible: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  mounted() {
    document.addEventListener('click', this.close)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.close)
  },
  methods: {
    getQueryData: debounce(async function(search) {
      if (search.length <= 1) return
      const res = await this.$store.dispatch('getSearchQueryData', search)
      const places = await this.$store.dispatch(
        'getSearchQueryDataMapbox',
        search
      )

      Array.from(places.features).forEach(
        place => (place.name = place.place_name)
      )

      if (res && res.data.length && res.data[0].r) {
        this.searchResults = res.data[0].r.concat(places.features)
      } else this.searchResults = places.features

      this.isResultsVisible = true
    }, 820),
    close() {
      this.searchResults = []
      this.isResultsVisible = false
    },
    loseFocus() {
      this.isFocused = false
      if (!this.searchResults.length) this.close()
    },
    clearSearch() {
      this.search = ''
      this.close()
    },
    setFocus() {
      this.isFocused = true
      if (this.searchResults.length) this.isResultsVisible = true
    },
    handlePlaceSelection(selection) {
      // If the selection has geometry it mind it's a city
      if (selection.geometry) {
        let bounds = []
        if (selection.bbox) bounds = selection.bbox
        else if (selection.center)
          bounds = [...selection.center, ...selection.center]

        if (bounds.length) this.$store.commit(`${MAP_BOUNDS}`, bounds)
        bus.$emit(FOCUS_ON, {
          id: selection.id,
          type: 'city'
        })
      } else {
        // Otherwise if must be an org/facility/datacenter, etc...
        this.$emit(SEARCH_SELECTION, {
          id: selection.id,
          option: selection.type
        })
      }

      this.isResultsVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/search-styles.scss';
</style>
