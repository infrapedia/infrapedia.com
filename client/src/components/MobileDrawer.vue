<template>
  <div>
    <el-button
      circle
      icon="el-icon-menu"
      class="no-border"
      @click="toggleVisibility"
    />
    <el-drawer
      size="100%"
      :visible.sync="isDrawer"
      direction="ltr">
      <header class="h14 w-fit-full pr4 pl4 pb2 flex justify-content-space-between align-items-center">
        <router-link to="/">
          <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
        </router-link>
        <span
          class="inline-block w4 h4 icon mt2 fs-medium p2 transition-all circle vertical-align cursor-pointer"
          @click="toggleVisibility"
        >
          <fa :icon="['fas', 'times']" />
        </span>
      </header>
      <el-collapse
        accordion
        v-model="collapseActive"
        @change="handleCollapseChange"
      >
        <el-collapse-item name="partners" class="pr4 pl4">
          <p slot="title"> Our Partners</p>
          <i-list
            option="partners"
            @click="emitSelected"
            :is-search-visible="false"
            @load-more="emitLoadMore('partners')"
          />
        </el-collapse-item>
        <el-collapse-item name="submarine" class="pr4 pl4">
          <p slot="title"> Submarine Cables</p>
          <i-list
            option="submarine"
            @click="emitSelected"
            :is-search-visible="false"
            @load-more="emitLoadMore('submarine')"
          />
        </el-collapse-item>
        <el-collapse-item name="dataCenters" class="pr4 pl4">
          <p slot="title"> Data Centers</p>
          <i-list
            option="dataCenters"
            @click="emitSelected"
            :is-search-visible="false"
            @load-more="emitLoadMore('dataCenters')"
          />
        </el-collapse-item>
        <el-collapse-item name="ixps" class="pr4 pl4">
          <p slot="title"> IXPs</p>
          <i-list
            option="ixps"
            @click="emitSelected"
            :is-search-visible="false"
            @load-more="emitLoadMore('ixps')"
          />
        </el-collapse-item>
        <el-collapse-item name="networks" class="pr4 pl4">
          <p slot="title"> Networks</p>
          <i-list
            option="networks"
            @click="emitSelected"
            :is-search-visible="false"
            @load-more="emitLoadMore('networks')"
          />
        </el-collapse-item>
      </el-collapse>
      <i-footer class="footer relative" />
    </el-drawer>
  </div>
</template>

<script>
import IList from './List'
import IFooter from './Footer'
import { LOAD_MORE } from '../events/listview'
import {
  CLICK_LIST_ITEM,
  CLICK_DATACENTERS,
  CLICK_IXPS,
  CLICK_NETWORKS,
  CLICK_SUBMARINE,
  CLEAR_SUBMARINE,
  CLEAR_DATACENTERS,
  CLEAR_IXPS,
  CLEAR_NETWORKS
} from '../events/mobiledrawer'

export default {
  components: {
    IFooter,
    IList
  },
  data: () => ({
    isDrawer: false,
    collapseActive: ''
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    imageURL() {
      return this.dark
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    }
  },
  methods: {
    async emitSelected(selected) {
      console.warn('----------- ENTERED HERE 1 -----------')
      await this.$emit(CLICK_LIST_ITEM, selected)
      await this.toggleVisibility()
      this.clear()
    },
    emitLoadMore(opt) {
      console.warn('----------- ENTERED HERE 2 -----------')
      return this.$emit(LOAD_MORE, opt)
    },
    clear() {
      console.warn('----------- ENTERED HERE 3 -----------')
      this.$emit(CLEAR_SUBMARINE)
      this.$emit(CLEAR_DATACENTERS)
      this.$emit(CLEAR_IXPS)
      this.$emit(CLEAR_NETWORKS)
      this.collapseActive = ''
    },
    handleCollapseChange(tab) {
      console.warn('----------- ENTERED HERE 4 -----------', tab)
      if (!tab) return this.clear()
      switch (tab.toLowerCase()) {
        case 'submarine':
          this.$emit(CLICK_SUBMARINE, tab)
          break
        case 'datacenters':
          this.$emit(CLICK_DATACENTERS, tab)
          break
        case 'ixps':
          this.$emit(CLICK_IXPS, tab)
          break
        case 'networks':
          this.$emit(CLICK_NETWORKS, tab)
          break
      }
    },
    toggleVisibility() {
      console.warn('----------- ENTERED HERE 5 -----------')
      this.isDrawer = !this.isDrawer
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/components/mobile-drawer-styles.scss';
</style>