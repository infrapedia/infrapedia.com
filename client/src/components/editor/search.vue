<template>
  <div
    class="search-wrapper z-index20 flex justify-content-end transition-all"
    :class="{ active: isActive }"
  >
    <transition
      mode="out-in"
      name="animated faster3x"
      enter-active-class="slideInDown"
      leave-active-class="slideOutUp"
    >
      <div
        class="search-inner-wrapper flex nowrap align-items-center justify-content-end relative"
      >
        <el-input
          v-if="isActive"
          v-model="search"
          ref="search-input"
          :class="{ dark }"
          prefix-icon="el-icon-search"
          size="mini"
          placeholder="Search place"
          @input="handleSearchChange"
          @focus="toggleResults(true)"
          @blur="toggleResults(false)"
        />
        <el-button
          circle
          size="mini"
          class="ml4"
          :icon="btnIcon"
          :class="{ dark }"
          :title="btnTitle"
          @click="handleSearchBtnClick"
        />
      </div>
    </transition>
    <div
      class="absolute results-wrapper bottom-shadow overflow-y-auto"
      v-if="isResults"
    >
      <div v-if="!results.length" class="el-select-dropdown__empty">
        No data
      </div>
      <ul role="group" class="pt2" v-else>
        <li
          v-for="(item, i) in results"
          :class="{ dark, light: !dark }"
          :key="i"
          role="listitem"
          class="p2 pr3 pl3 cursor-pointer seamless-hoverbg no-outline"
          @click="emitSelection(item)"
          @keyup.enter.space="emitSelection(item)"
        >
          {{ item.place_name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import debounce from '../../helpers/debounce'
import {
  searchGeocodingReverse,
  searchGeocodingForward
} from '../../services/api/mapbox-geocoding'

export default {
  name: 'Search',
  data: () => ({
    search: '',
    results: [],
    isActive: false,
    isResults: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    btnIcon() {
      return this.isActive ? 'el-icon-close' : 'el-icon-search'
    },
    btnTitle() {
      return this.isActive ? 'Close' : 'Search place'
    }
  },
  methods: {
    handleSearchChange: debounce(async function searchQuery(query) {
      if (!query) return

      let method
      let matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
      )

      if (matches) {
        query = [Number(matches[1]), Number(matches[2])]
      }

      Array.isArray(query)
        ? (method = searchGeocodingReverse)
        : (method = searchGeocodingForward)

      const res = await method(query)
      this.results = res ? res.features : []
      this.toggleResults(res.features.length > 0)
    }, 800),
    handleSearchBtnClick() {
      this.isActive = !this.isActive
      if (this.isActive) {
        setTimeout(() => this.$refs['search-input'].focus(), 120)
      } else {
        this.search = ''
        this.results = []
      }
      this.$emit('toggle-search', this.isActive)
    },
    emitSelection(data) {
      this.toggleResults(false)
      this.$emit('place-selected', data)
    },
    toggleResults: debounce(function(bool) {
      this.isResults = bool
    }, 220)
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/components/editor-search-styles.scss';
</style>
