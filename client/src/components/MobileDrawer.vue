<template>
  <div class="drawer-wrapper" :class="{ dark, light: !dark }">
    <el-button
      circle
      icon="el-icon-menu"
      class="no-border color-inherit w8 vertical-align mt1"
      @click="toggleVisibility"
    />
    <el-drawer
      size="100%"
      :visible.sync="isDrawer"
      direction="ltr"
      :before-close="toggleVisibility"
      :custom-class="drawerClass"
    >
      <header
        class="h14 pr4 pl4 pb2 flex justify-content-space-between align-items-center"
        :class="{ dark, light: !dark }"
      >
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
        :class="{ dark, light: !dark }"
      >
        <el-collapse-item name="partners" class="pr4 pl4">
          <p slot="title">Our Partners</p>
          <i-list
            class="w-fit-full-imp overflow-y-auto no-overflow-x"
            option="partners"
            @click="emitSelected"
            :is-search-visible="false"
          />
        </el-collapse-item>
      </el-collapse>
      <ul class="links-wrapper m0 mb4 p0" :class="{ dark }">
        <li class="w-fit-full" data-no-outline="true">
          <div class="no-selectable">
            <a
              href="https://www.infrapedia.com/blog"
              target="_blank"
              class="no-underline inherit color-inherit p4 mr4 ml4 inline-block"
            >
              Blog
            </a>
          </div>
        </li>
        <li class="w-fit-full" data-no-outline="true">
          <div class="no-selectable">
            <a
              href="https://www.infrapedia.com"
              target="_blank"
              class="no-underline inherit color-inherit p4 mr4 ml4 inline-block"
            >
              Contact us
            </a>
          </div>
        </li>
      </ul>
      <div class="text-center">
        <h2 class="mb10 mt6">
          Sponsors
        </h2>
        <ul class="flex column wrap">
          <li
            class="inline-block relative"
            data-no-outline="true"
            role="listitem"
          >
            <div class="list-item" data-no-hover-bg="true">
              <a href="https://www.catchpoint.com" target="_blank">
                <el-image
                  src="https://storage.googleapis.com/infrapedia_bucket/sponsors/catchpoint-logo.png"
                  class="w46 h14"
                  fit="cover"
                  alt="catchpoint logo"
                  referrer-policy="strict-origin-when-cross-origin"
                />
              </a>
            </div>
          </li>

          <li
            class="inline-block relative mt8"
            data-no-outline="true"
            role="listitem"
          >
            <div class="list-item" data-no-hover-bg="true">
              <a href="https://ipv4.global" target="_blank">
                <el-image
                  src="https://storage.googleapis.com/infrapedia_bucket/sponsors/ipv4global-footer.png"
                  fit="cover"
                  class="w46 h6"
                  alt="ipv4 logo"
                  referrer-policy="strict-origin-when-cross-origin"
                />
              </a>
            </div>
          </li>
          <li
            class="inline-block relative mt8"
            data-no-outline="true"
            role="listitem"
          >
            <div class="list-item" data-no-hover-bg="true">
              <a href="https://aptelecom.com/" target="_blank">
                <el-image
                  src="https://cdn.infrapedia.com/sponsors/aptelecom_logo.png"
                  fit="center"
                  class="w46 h18 image-sponsor"
                  alt="aptelecom logo"
                  referrer-policy="strict-origin-when-cross-origin"
                />
              </a>
            </div>
          </li>
        </ul>
      </div>
      <i-footer class="footer relative m0 mt54 ml-5 p4" />
    </el-drawer>
  </div>
</template>

<script>
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
    IFooter: () => import('./Footer'),
    IList: () => import('./List')
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
    },
    drawerClass() {
      return this.dark ? 'dark' : 'light'
    }
  },
  methods: {
    async emitSelected(selected) {
      this.$emit(CLICK_LIST_ITEM, selected)
      this.toggleVisibility()
      this.clear()
    },
    emitLoadMore(opt) {
      return this.$emit(LOAD_MORE, opt)
    },
    clear() {
      this.$emit(CLEAR_SUBMARINE)
      this.$emit(CLEAR_DATACENTERS)
      this.$emit(CLEAR_IXPS)
      this.$emit(CLEAR_NETWORKS)
      this.collapseActive = ''
    },
    handleCollapseChange(tab) {
      if (!tab) this.clear()
      else
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
      this.isDrawer = !this.isDrawer
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/components/mobile-drawer-styles.scss';
</style>
