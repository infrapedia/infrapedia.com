<template>
  <div class="w120 no-border no-outline">
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
      role="list"
      tabindex="1"
      class="no-outline"
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
          {{ option.name || 'Placeholder' }}
        </li>
        <el-divider :key="i + ' ' + option.name" class="m0" />
        <el-button
          v-if="isFinal(i)"
          :loading="isLoading"
          :key="option.name + ' ' + i"
          class="w-fit-full p4 h20 no-border seamless-hoverbg"
          @click="$emit('load-items', option)"
        >
          Load more
        </el-button>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
    searchResults: []
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
      let data = []
      switch (option) {
        case 'networks':
          data = this.networks
          break
        case 'submarine':
          data = this.submarine
          break
        case 'premium':
          data = this.premium
          break
        case 'ixps':
          data = this.ixps
          break
        default:
          data = this.dataCenters
          break
      }
      return data
    }
  },
  methods: {
    isFinal(num) {
      return num + 1 === this.optionsGiver
    },
    clearSearch() {
      this.search = ''
      this.searchResults = []
    },
    filterSearch(search) {
      console.log(search)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/list-view-styles.scss';
</style>
