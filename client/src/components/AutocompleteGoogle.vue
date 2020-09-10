<template>
  <el-popover
    placement="bottom-start"
    :width="width"
    transition="el-zoom-in-top"
    trigger="manual"
    v-click-outside="handleBlur"
    :value.sync="isResultsVisible"
  >
    <el-input
      v-model="search"
      slot="reference"
      class="w-fit-full"
      placeholder
      size="mini"
      clearable
      :id="id"
      :class="{ dark }"
      :loading="loading"
      @input="searchPlace"
      @focus="handleFocus"
    />
    <div
      class="el-card p0 no-border w-fit-full is-never-shadow relative"
      :class="{ dark }"
    >
      <ul
        role="list"
        class="w-fit-full h-fit-content no-outline overflow-y-auto no-overflow-x"
        :class="{ dark }"
      >
        <li
          v-for="(item, i) in places"
          :key="i"
          tabindex="0"
          role="listitem"
          :class="{ dark, light: !dark }"
          class="pt2 pb2 pr5 pl5 cursor-pointer seamless-hoverbg no-outline"
          @click="emitSelection(item.place_id)"
          @keyup.enter.space="emitSelection(item.place_id)"
        >
          {{ item.description }}
        </li>
      </ul>
      <div
        class="powered-by-wrapper flex nowrap justify-content-end align-items-flex-end p2 pr4 pl4"
        :class="{ dark }"
      >
        <el-image :src="imageURL" fit="contain" class="w25" />
      </div>
    </div>
  </el-popover>
</template>

<script>
import debounce from '../helpers/debounce'
import ClickOutside from 'vue-click-outside'
import { getPlace, getPlaceDetails } from '../services/api'

export default {
  data: () => ({
    places: [],
    search: '',
    selection: '',
    loading: false,
    isResultsVisible: false
  }),
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    width: {
      type: [String, Number],
      default: '150px'
    },
    mode: {
      type: String,
      default: () => 'create'
    },
    id: {
      type: String,
      default: () => 'autocompleteGoogle'
    },
    size: {
      type: String,
      default: () => 'mini'
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    imageURL() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/powered_by_google_on_non_white_hdpi.png'
        : 'https://cdn1.infrapedia.com/assets/powered_by_google_on_white_hdpi.png'
    }
  },
  mounted() {
    if (this.value && this.mode != 'create') {
      this.handleEditMode(this.value)
    }
  },
  methods: {
    searchPlace: debounce(async function handleGooglePlaceSearch(s) {
      this.loading = true
      const res = await getPlace(s)
      if (res && res.predictions && res.predictions.length > 0) {
        this.places = res.predictions
        this.isResultsVisible = true
      }
      this.loading = false
    }, 800),
    handleEditMode(data) {
      if (!data || data == 'undefined' || data == 'null') return
      const address = data.fullAddress ? data.fullAddress : ''
      this.search = address
    },
    async emitSelection(id) {
      this.isResultsVisible = false
      const fullAddress = this.places.filter(t => t.place_id == id)[0]
        .description
      this.search = fullAddress

      const data = await getPlaceDetails(id)
      if (data && data.result) {
        this.$emit('place-changed', {
          ...data.result,
          fullAddress
        })
      }
    },
    handleFocus() {
      this.places.length
        ? (this.isResultsVisible = true)
        : (this.isResultsVisible = false)
    },
    handleBlur() {
      this.isResultsVisible = false
    }
  },
  directives: {
    ClickOutside
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/components/autocomplete-google-styles.scss';
</style>
