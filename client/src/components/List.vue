<template>
  <div class="w120 no-border no-outline no-selectable transition-all">
    <div class="w-fit-full p4" v-if="isSearchVisible">
      <el-input
        class="w110"
        placeholder="Search"
        :class="{ dark }"
        v-model="search"
        autofocus
        tabindex="0"
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

    <div v-if="isLoading" v-loading="isLoading" class="h112" />
    <div v-else>
      <ul
        v-if="!isSearching"
        role="list"
        class="no-outline no-selectable"
        v-loading="isLoading"
      >
        <template v-for="(option, i) in optionsGiver">
          <li
            :key="i"
            tabindex="0"
            role="listitem"
            class="pt7 pb7 pr5 pl5 cursor-pointer seamless-hoverbg no-outline"
            :class="{ dark, light: !dark }"
            @click="emitSelected(option)"
            @keyup.enter.space="emitSelected(option)"
          >
            {{ option.name }}
          </li>
          <el-button
            v-if="isFinal(i) && !isPremiumPartners"
            :loading="isLoading"
            :class="{ dark, light: !dark }"
            :key="option.name + ' ' + i"
            class="w-fit-full p4 h20 no-border seamless-hoverbg"
            @click="$emit(LOAD_MORE, option)"
            @keyup.enter.space="$emit(LOAD_MORE, option)"
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
            tabindex="0"
            role="listitem"
            class="pt7 pb7 pr5 pl5 cursor-pointer seamless-hoverbg no-outline"
            :class="{ dark, light: !dark }"
            @click="emitSelected(option)"
            @keyup.enter.space="emitSelected(option)"
          >
            {{ option.name }}
          </li>
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { LOAD_MORE } from '../events/listview'

export default {
  name: 'IList',
  props: {
    option: {
      type: String,
      required: true
    },
    isSearchVisible: {
      type: Boolean,
      default: () => true
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
    isPremiumPartners() {
      return this.option === 'partners'
    },
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
    emitSelected(selection) {
      this.$emit('click', {
        id:
          selection.cable_id ||
          selection.org_id ||
          selection.fac_id ||
          selection.ix_id ||
          selection.net_id,
        option: this.option
      })
    },
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
