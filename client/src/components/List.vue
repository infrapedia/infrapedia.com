<template>
  <div class="w120 no-border no-outline no-selectable transition-all">
    <div class="w-fit-full p4">
      <el-input
        class="w110"
        placeholder="Search"
        :class="{ dark }"
        v-model="search"
        @input="filterSearch"
      >
        <fa slot="prefix" :icon="['fas', 'search']" class="mt3 ml1" />
        <fa
          slot="suffix"
          :icon="['fas', 'times']"
          class="xsm-icon vertical-align mt3 mr2"
          @click="clearSearch"
        />
      </el-input>
    </div>

    <ul
      v-if="!isSearching"
      role="list"
      class="no-outline no-selectable"
      v-loading="isLoading"
    >
      <template v-for="(option, i) in optionsGiver">
        <li
          :key="i"
          role="listitem"
          class="pt7 pb7 pr5 pl5 cursor-pointer seamless-hoverbg"
          :class="{ dark, light: !dark }"
          @click="$emit('click', option)"
        >
          {{ option.name }}
        </li>
        <el-button
          v-if="isFinal(i)"
          :loading="isLoading"
          :key="option.name + ' ' + i"
          class="w-fit-full p4 h20 no-border seamless-hoverbg"
          @click="$emit(LOAD_MORE, option)"
        >
          Load more
        </el-button>
      </template>
    </ul>

      <transition-group
        v-else
        tag="ul"
        role="list"
        class="no-outline no-selectable"
        mode="out-in"
        name="fade"
      >
      <template v-for="(option, i) in searchResults">
        <li
          :key="i"
          role="listitem"
          class="pt7 pb7 pr5 pl5 cursor-pointer seamless-hoverbg"
          :class="{ dark, light: !dark }"
          @click="$emit('click', option)"
        >
          {{ option.name }}
        </li>
      </template>
    </transition-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { LOAD_MORE } from '../events'

export default {
  name: 'IList',
  props: {
    option: {
      type: String,
      required: true
    }
  },
  data: () => ({
    search: '',
    LOAD_MORE,
    searchResults: [],
    isSearching: false
  }),
  computed: {
    ...mapState({
      ixps: state => state.ixps,
      dark: state => state.dark,
      premium: state => state.premium,
      networks: state => state.networks,
      isLoading: state => state.isLoading,
      submarine: state => state.submarine,
      dataCenters: state => state.dataCenters
    }),
    optionsGiver() {
      const option = this.option.toLowerCase()

      if (option === 'partners') return this.premium
      else if (option === 'submarine') return this.submarine
      else if (option === 'ixps') return this.ixps
      else if (option === 'datacenters') return this.dataCenters
      else return this.networks
    }
  },
  methods: {
    isFinal(num) {
      return num + 1 === this.optionsGiver.length
    },
    clearSearch() {
      this.isSearching = false
      this.search = ''
      this.searchResults = []
    },
    filterSearch(search) {
      if (!search || search.length <= 1) {
        this.isSearching = false
        return
      }
      this.isSearching = true

      this.searchResults = this.optionsGiver.filter(option =>
        option.name.toLowerCase().includes(search.toLowerCase())
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/list-view-styles.scss';
</style>
