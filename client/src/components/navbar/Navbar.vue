<template>
  <header class="header fixed h12 w-full no-padding">
    <div
      class="header-inner-wrapper w-full flex relative h-fit-full bottom-shadow"
    >
      <div
        class="flex no-padding navbar-wrapper w-full justify-content-space-between pr1 pl1"
      >
        <h1 class="logo-title">
          <router-link :to="checkIfLoggedIn" class="hidden-md-and-down">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
          <router-link :to="checkIfLoggedIn" class="sphere-logo">
            <el-image
              class="mt2 logo-img"
              :src="imageURLSphere"
              fit="scale-down"
            />
          </router-link>
          <el-button
            circle
            icon="el-icon-menu"
            class="no-border hidden-md-and-up color-inherit mt1"
            @click="toggleMobileDrawer"
          />
        </h1>

        <div aria-labelledby="rightnavheading" class="links-wrapper">
          <ul
            class="p0 m0 h-fit-full"
            role="group"
            :key="1"
            v-if="!isUserNavbar"
          >
            <li
              class="inline-block no-selectable relative hidden-sm-and-down"
              role="listitem"
            >
              <router-link
                to="/services"
                class="list-item pr4 pl4"
                :class="{ 'text-white--hsl': dark }"
                title="Services"
              >
                Services
              </router-link>
            </li>
            <el-divider direction="vertical" class="m0 hidden-sm-and-down" />

            <li
              class="inline-block no-selectable relative hidden-sm-and-down"
              role="listitem"
            >
              <div class="list-item pr4 pl4 no-selectable">
                <market-place />
              </div>
            </li>

            <el-divider direction="vertical" class="m0 hidden-sm-and-down" />

            <li
              class="inline-block no-selectable relative hidden-sm-and-down"
              role="listitem"
            >
              <premium-partners-button
                @item-selected="handleItemListSelection"
              />
            </li>

            <el-divider direction="vertical" class="m0 hidden-sm-and-down" />

            <li
              class="inline-block relative hidden-sm-and-down"
              @click="toggleDrawerVisibility"
              @keyup.enter="toggleDrawerVisibility"
            >
              <div class="list-item pr4 pl4 no-selectable">
                <bottom-sheet
                  :visibility="isDrawerOpen"
                  @close="toggleDrawerVisibility"
                  @item-selected="handleItemListSelection"
                />
              </div>
            </li>

            <li
              class="inline-block relative hidden-sm-and-down"
              data-no-outline="true"
              role="listitem"
            >
              <div
                class="list-item info-menu pr1 pl1"
                aria-haspopup="true"
                data-no-hover-bg="true"
              >
                <i-search @search-selection="handleItemListSelection" />
              </div>
            </li>

            <i-full-screen-search @search-selection="handleItemListSelection" />

            <li
              class="inline-block relative"
              data-no-outline="true"
              role="listitem"
            >
              <div
                class="list-item info-menu pl2"
                aria-haspopup="true"
                data-no-hover-bg="true"
              >
                <i-filter />
              </div>
            </li>

            <li
              class="inline-block hidden-sm-and-down relative"
              data-no-outline="true"
              role="listitem"
            >
              <div class="list-item" data-no-hover-bg="true">
                <a :href="sponsors[0].url" target="_blank">
                  <el-image
                    :src="sponsors[0].src"
                    lazy
                    class="w28 image-sponsor"
                    fit="cover"
                    alt="catchpoint logo"
                    referrer-policy="strict-origin-when-cross-origin"
                  />
                </a>
              </div>
            </li>

            <el-divider direction="vertical" class="m0 hidden-sm-and-down" />

            <li
              class="inline-block hidden-sm-and-down relative"
              data-no-outline="true"
              role="listitem"
            >
              <div class="list-item" data-no-hover-bg="true">
                <a :href="sponsors[1].url" target="_blank">
                  <el-image
                    lazy
                    :src="sponsors[1].src"
                    fit="center"
                    class="w28 image-sponsor ipv4"
                    alt="ipv4 logo"
                    referrer-policy="strict-origin-when-cross-origin"
                  />
                </a>
              </div>
            </li>

            <li
              class="inline-block relative"
              data-no-outline="true"
              role="listitem"
            >
              <div
                class="list-item info-menu"
                aria-haspopup="true"
                data-no-hover-bg="true"
              >
                <i-menu class="mt1" />
              </div>
            </li>
          </ul>
          <ul role="group" v-else>
            <li
              class="inline-block relative"
              data-no-outline="true"
              role="listitem"
            >
              <div
                class="list-item info-menu"
                aria-haspopup="true"
                data-no-hover-bg="true"
              >
                <i-menu class="mt3 mr4" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import sponsors from '../../config/navbarSponsors'
import infoMenuLinks from '../../config/infoMenuLinks'
import dataCollection from '../../mixins/dataCollection'
import FullScreenSearch from './FullScreenSearch.vue'
import * as events from '../../events/navbar'
import { bus } from '../../helpers/eventBus'

export default {
  name: 'INavbar',
  components: {
    IMenu: () => import('./Menu'),
    IFilter: () => import('./Filter'),
    ISearch: () => import('./Search'),
    BottomSheet: () => import('./BottomSheet'),
    MarketPlace: () => import('./MartketPlace'),
    PremiumPartnersButton: () => import('./PremiumPartners'),
    IFullScreenSearch: FullScreenSearch
  },
  mixins: [dataCollection],
  props: {
    isUserNavbar: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    sponsors,
    search: '',
    infoMenuLinks,
    searchResults: [],
    isDrawerOpen: false,
    isUserMenuOpen: false,
    isInfoMenuOpen: false,
    isIxpsMenuOpen: false,
    isNetworsMenuOpen: false,
    isSponsorsMenuOpen: false,
    isPartnersMenuOpen: false,
    isSubmarineMenuOpen: false,
    isDataCentersMenuOpen: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    checkIfLoggedIn() {
      return this.$auth.isAuthenticated ? '/app' : '/'
    },
    popoverClassGiver() {
      let c = 'popover'
      if (this.dark) c += ' dark'
      else c += ' light'
      return c
    },
    imageURL() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
        : 'https://cdn1.infrapedia.com/assets/img/light-mode-logo.svg'
    },
    imageURLSphere() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo-sphere.svg'
        : 'https://cdn1.infrapedia.com/assets/img/light-mode-logo-sphere.svg'
    }
  },
  async mounted() {
    await this.loadPremiumPartners()
  },
  methods: {
    toggleDrawerVisibility() {
      this.isDrawerOpen = !this.isDrawerOpen
    },
    toggleMobileDrawer() {
      return bus.$emit(
        this.isUserNavbar
          ? `${events.TOGGLE_MOBILE_DRAWER_PROFILE}`
          : `${events.TOGGLE_MOBILE_DRAWER}`
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/navbar-styles.scss';
</style>
