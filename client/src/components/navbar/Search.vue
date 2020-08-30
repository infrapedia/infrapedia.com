<template>
  <el-popover
    placement="bottom-start"
    width="420"
    transition="el-zoom-in-top"
    trigger="manual"
    v-click-outside="close"
    :value.sync="isResultsVisible"
  >
    <el-card class="p0 no-border" shadow="never">
      <ul role="list" class="w-fit-full h80 no-outline no-selectable">
        <li
          v-for="(item, i) in searchResults.r"
          :key="i + item"
          tabindex="0"
          role="listitem"
          :class="{ dark, light: !dark }"
          class="pt2 pb2 pr5 pl5 cursor-pointer seamless-hoverbg no-outline"
          @click="handlePlaceSelection(item)"
          @keyup.enter.space="handlePlaceSelection(item)"
        >
          <div
            v-if="
              item.address && item.address.length && item.address[0].city !== ''
            "
            class="inline-block"
          >
            {{ item.name }} in
            <small v-for="(a, index) in item.address" :key="a.state + index">
              {{ a.city }}, {{ a.state }};
            </small>
          </div>
          <span v-else>
            {{ item.name }}
          </span>
          -
          <small class="capitalize">{{ geResultType(item) }}</small>
          <span
            v-if="item.premium && item.premium == 'true'"
            class="w22 p1 h6 partner round flo-right vertical-align mt-2"
          >
            Partner
            <fa :icon="['fas', 'star']" class="sm-icon ml2" />
          </span>
        </li>
        <el-divider class="m0" v-if="searchResults.r.length > 0" />
        <li
          v-for="(item, i) in searchResults.places"
          :key="i"
          tabindex="0"
          role="listitem"
          :class="{ dark, light: !dark }"
          class="pt2 pb2 pr5 pl5 cursor-pointer seamless-hoverbg no-outline"
          @click="handlePlaceSelection(item)"
          @keyup.enter.space="handlePlaceSelection(item)"
        >
          <span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </el-card>
    <div slot="reference" role="search">
      <el-input
        :placeholder="`Search in ${categories.selected}`"
        :class="{ dark }"
        v-model="search"
        @blur="loseFocus"
        @focus="setFocus"
        @input="getQueryData"
      >
        <el-select
          v-model="categories.selected"
          id="search-select-navbar"
          slot="prepend"
          class="w10 search-navbar-select"
          placeholder
          @change="getQueryData(search)"
        >
          <el-option
            v-for="(opt, i) in categories.list"
            :key="i"
            :label="opt"
            :value="opt"
          />
        </el-select>
        <fa
          v-if="!isFocused"
          slot="suffix"
          :icon="['fas', 'caret-down']"
          class="xsm-icon vertical-align mt3 mr3 hidden-md-and-down"
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
import { bus } from '../../helpers/eventBus'
import debounce from '../../helpers/debounce'
import { MAP_BOUNDS } from '../../store/actionTypes/map'
import { FOCUS_ON, SEARCH_SELECTION } from '../../events'
import searchCategories from '../../config/searchCategories'
import ClickOutside from 'vue-click-outside'

export default {
  data: () => ({
    search: '',
    categories: {
      list: searchCategories,
      selected: 'All'
    },
    isFocused: false,
    searchResults: {
      r: [],
      places: []
    },
    isResultsVisible: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    getQueryData: debounce(async function(search) {
      if (search.length <= 1) return
      const res = await this.$store.dispatch('getSearchQueryData', {
        s: search,
        type: this.categories.selected
      })
      const places = await this.$store.dispatch(
        'getSearchQueryDataMapbox',
        search
      )

      Array.from(places.features).forEach(
        place => (place.name = place.place_name)
      )

      if (res && res.data.length) {
        this.searchResults.r = res.data.filter(i => i)
      }

      this.searchResults.places = places.features
      this.isResultsVisible = true
    }, 820),
    geResultType(item) {
      let t = item.t
      if (item.t.toLowerCase() == 'cable') {
        t = item.terrestrial ? 'terrestrial-network' : 'subsea-cable'
      }
      return t
    },
    close() {
      this.isResultsVisible = false
    },
    loseFocus() {
      this.isFocused = false
      // this.isResultsVisible = false
    },
    clearSearch() {
      this.close()
      this.search = ''
      this.searchResults = {
        r: [],
        places: []
      }
    },
    setFocus() {
      this.isFocused = true
      if (
        this.searchResults.r.length > 0 ||
        this.searchResults.places.length > 0
      ) {
        this.isResultsVisible = true
      }
    },
    handlePlaceSelection(selection) {
      // If the selection has geometry it's a city
      if (selection.geometry) {
        let bounds = []

        if (selection.bbox) {
          bounds = selection.bbox
        } else if (selection.center) {
          bounds = [...selection.center, ...selection.center]
        }

        if (bounds.length) this.$store.commit(`${MAP_BOUNDS}`, bounds)
        bus.$emit(FOCUS_ON, {
          id: selection.id,
          type: 'city'
        })
      } else {
        // Otherwise if must be an org/facility/datacenter, etc...
        this.$emit(SEARCH_SELECTION, {
          id: selection.id ? selection.id : selection._id,
          option: selection.type
            ? selection.type
            : selection.t
            ? selection.t == 'groups'
              ? 'networks'
              : selection.t == 'cable'
              ? selection.terrestrial
                ? 'subsea-cable'
                : 'terrestrial-network'
              : selection.t
            : selection.t
        })
      }

      this.close()
    }
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/search-styles.scss';
</style>
