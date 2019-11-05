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
          v-text="place.name"
          :class="{ dark, light: !dark }"
          class="pt7 pb7 pr5 pl5 cursor-pointer seamless-hoverbg no-outline"
          @click="emitSelected(place)"
          @keyup.enter.space="emitSelected(place)"
        />
      </ul>
    </el-card>
    <div slot="reference" role="search">
      <el-input
        class="w60"
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
          @click="clearSearch"
        />
      </el-input>
    </div>
  </el-popover>
</template>

<script>
import debounce from '../helpers/debounce'
import { SEARCH_SELECTION } from '../events'

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
  methods: {
    getQueryData: debounce(async function(querystring) {
      if (querystring.length <= 1) return
      const res = await this.$store.dispatch('getSearchQueryData', querystring)
      const places = await this.$store.dispatch('getSearchQueryDataMapbox', querystring)

      if (!res) return
      Array.from(places.features).forEach(
        place => (place.name = place.place_name)
      )
      this.searchResults = res.concat(places.features)
      this.isResultsVisible = true
    }, 820),
    loseFocus() {
      this.isFocused = false
      this.isResultsVisible = false
    },
    clearSearch() {
      this.search = ''
      this.isResultsVisible = false
    },
    setFocus() {
      this.isFocused = true
      if (this.searchResults.length) this.isResultsVisible = true
    },
    emitSelected(selection) {
      this.$emit(SEARCH_SELECTION, { ...selection })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/search-styles.scss';
</style>
