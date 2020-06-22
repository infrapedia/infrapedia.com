<template>
  <el-popover
    placement="bottom-start"
    width="420"
    transition="el-zoom-in-top"
    trigger="manual"
    :value.sync="isResultsVisible"
  >
    <el-card class="p0 no-border" shadow="never">
      <ul role="list" class="w-fit-full h80 no-outline overflow-y-auto">
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
          <small class="capitalize">{{ getResultType(item) }}</small>
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
          <span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </el-card>
    <div slot="reference" role="search">
      <el-input
        clearable
        @clear="handleClear"
        placeholder
        :class="{ dark }"
        v-model="search"
        @input="getQueryData"
      >
        <fa
          slot="prefix"
          :icon="['fas', 'search']"
          class="mt3 ml1 hidden-md-and-down"
        />
      </el-input>
    </div>
  </el-popover>
</template>

<script>
import debounce from '../helpers/debounce'
import { getSearchByFacility, getSearchByCls } from '../services/api/search'

export default {
  data: () => ({
    search: '',
    searchResults: {
      r: [],
      places: []
    },
    isSelection: false,
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
      const { data: facs } = await getSearchByFacility(search)
      const { data: cls } = await getSearchByCls(search)
      const places = await this.$store.dispatch(
        'getSearchQueryDataMapbox',
        search
      )

      this.searchResults.places = places.features.map(place => {
        place.name = place.place_name
        return place
      })
      this.searchResults.r = [...facs, ...cls]
      this.isResultsVisible = true
    }, 320),
    handlePlaceSelection(selection) {
      let s = selection.name
      if (selection.t) {
        s = `${s} (${selection.t})`
      }
      this.$emit('place-changed', s)
      this.search = s
      this.isSelection = true
      setTimeout(() => (this.isSelection = false), 520)
      this.close()
    },
    getResultType(item) {
      return item.t
    },
    handleClear() {
      this.$emit('place-changed', '')
    },
    close() {
      this.searchResults = {
        r: [],
        places: []
      }
      this.isResultsVisible = false
    }
  }
}
</script>
