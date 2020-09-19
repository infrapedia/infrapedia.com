<template>
  <div
    aria-haspopup="true"
    class="cursor-pointer circle p2 w4 h4 vertical-align hidden-md-and-up"
  >
    <el-button
      class="sm-icon fs-screen-btn transparent-imp no-border p0"
      :class="{ dark }"
      type="text"
      @click="toggleVisibility"
    >
      <fa :icon="['fas', 'search']" />
    </el-button>
    <transition name="fade" mode="out-in">
      <div
        v-if="isFullScreen"
        class="absolute full-screen z-index1 transition-all custom-dialog w-fit-full-imp"
        :class="{ dark, light: !dark }"
      >
        <header
          class="flex row justify-content-space-between pt1 pb1 pr4 pl4 mb2 el-dialog__header"
        >
          <el-image :src="imageURL" class="w24" fit="scale-down" lazy />
          <el-button
            type="text"
            icon="el-icon-close"
            :class="{ 'text-white--hsl': dark }"
            @click="handleClose({ keyCode: 4 })"
          />
        </header>
        <div class="pr4 pl4 pb20">
          <el-input
            :placeholder="`Search in ${categories.selected}`"
            :class="{ dark }"
            id="fullscreen-searchbar"
            v-model="search"
            clearable
            autofocus
            @input="getQueryData"
          >
            <el-select
              v-model="categories.selected"
              slot="prepend"
              class="p0"
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
          </el-input>
          <ul class="mt8 color-inherit w-fit-full" v-loading="isLoading">
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
              <div v-if="item.address" class="inline-block fs-small">
                {{ item.name }} in
                <small
                  v-for="(a, index) in item.address"
                  :key="a.state + index"
                >
                  {{ a.city }}, {{ a.state }};
                </small>
              </div>
              <span v-else>
                {{ item.name }}
              </span>
              -
              <small class="capitalize">{{ item.t }}</small>
              <span
                v-if="item.premium && item.premium == 'true'"
                class="w22 p1 h6 partner round flo-right vertical-align mt-2"
              >
                Partner
                <fa :icon="['fas', 'star']" class="sm-icon ml2" />
              </span>
            </li>
            <el-divider class="m0" v-if="searchResults.r.length" />
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
              <span class="fs-small">
                {{ item.name }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { bus } from '../../helpers/eventBus'
import debounce from '../../helpers/debounce'
import { MAP_BOUNDS } from '../../store/actionTypes/map'
import { FOCUS_ON, SEARCH_SELECTION } from '../../events'

export default {
  name: 'IFullScreenSearch',
  data: () => ({
    isFullScreen: false,
    isLoading: false,
    searchResults: {
      r: [],
      places: []
    },
    search: '',
    categories: {
      list: ['All', 'Cables', 'CLS', 'Networks', 'Orgs'],
      selected: 'All'
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    imageURL() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
        : 'https://cdn1.infrapedia.com/assets/img/light-mode-logo.svg'
    }
  },
  created() {
    document.querySelector('body').addEventListener('keydown', this.handleClose)
  },
  beforeDestroy() {
    document
      .querySelector('body')
      .removeEventListener('keydown', this.handleClose)
  },
  methods: {
    toggleVisibility() {
      this.isFullScreen = !this.isFullScreen
    },
    getQueryData: debounce(async function(querystring) {
      if (querystring.length <= 1) return
      this.isLoading = true
      const res = await this.$store.dispatch('getSearchQueryData', {
        s: querystring,
        type: this.categories.selected
      })
      const places = await this.$store.dispatch(
        'getSearchQueryDataMapbox',
        querystring
      )

      Array.from(places.features).forEach(
        place => (place.name = place.place_name)
      )

      this.searchResults.places = places.features
      if (res && res.data) this.searchResults.r = res.data

      this.isLoading = false
    }, 820),
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
          id: selection.id ? selection.id : selection._id,
          option: selection.type
            ? selection.type
            : selection.t == 'cable'
            ? selection.terrestrial
              ? 'subsea-cable'
              : 'terrestrial-network'
            : selection.t
        })
      }

      this.toggleVisibility()
      this.searchResults = {
        r: [],
        places: []
      }
      this.search = ''
    },
    handleClose(e) {
      if (e.keyCode == 27 || e.keyCode == 4) {
        this.isFullScreen = false
        this.searchResults = {
          r: [],
          places: []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/full-screen-search-styles.scss';
</style>
