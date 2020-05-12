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
          <el-button
            circle
            icon="el-icon-menu"
            class="no-border hidden-md-and-up color-inherit mt1"
            @click="toggleMobileDrawer"
          />
        </h1>

        <div aria-labelledby="rightnavheading" class="links-wrapper">
          <transition-group
            tag="div"
            class="h-fit-full"
            name="fade"
            mode="out-in"
          >
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
                <a
                  href="https://blog.infrapedia.com"
                  target="_blank"
                  class="list-item pr4 pl4"
                  title="Blog"
                >
                  Blog
                </a>
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

              <i-full-screen-search
                @search-selection="handleItemListSelection"
              />

              <li
                class="inline-block relative"
                data-no-outline="true"
                role="listitem"
              >
                <div
                  class="list-item info-menu pr2 pl2"
                  aria-haspopup="true"
                  data-no-hover-bg="true"
                >
                  <i-filter @open="closeUnwantedOpenMenus" />
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

              <el-divider direction="vertical" class="m0" />

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

              <li class="inline-block relative" data-no-outline="true">
                <div
                  class="list-item user-icon pr1 pl3"
                  aria-haspopup="true"
                  data-no-hover-bg="true"
                >
                  <el-popover
                    :visible-arrow="false"
                    placement="bottom-end"
                    width="220"
                    :popper-class="popoverClassGiver"
                    transition="el-zoom-in-top"
                    trigger="manual"
                    v-model="isUserMenuOpen"
                  >
                    <div
                      slot="reference"
                      class="no-outline circle icon-wrapper"
                      tabindex="0"
                      @click.stop="handleUserButtonDynamics"
                      @keyup.enter.space.stop="handleUserButtonDynamics"
                    >
                      <el-avatar
                        v-if="userImage"
                        size="small"
                        :src="$auth.user.picture"
                      />
                      <fa
                        v-else
                        :icon="['fas', 'user-circle']"
                        class="md-icon user-icon"
                      />
                    </div>
                  </el-popover>
                </div>
              </li>
              <li class="inline-block relative" data-no-outline="true">
                <div
                  class="list-item info-menu pr1 pl1"
                  aria-haspopup="true"
                  data-no-hover-bg="true"
                >
                  <div
                    class="w4 pt2 pb1 pr2 pl2 no-outline icon-wrapper circle"
                    tabindex="0"
                    @click.stop="toggleInfoMenuVisibility"
                    @keyup.enter.space="toggleInfoMenuVisibility"
                  >
                    <el-popover
                      :visible-arrow="false"
                      placement="bottom-end"
                      width="200"
                      transition="el-zoom-in-top"
                      trigger="manual"
                      :popper-class="popoverClassGiver"
                      v-model="isInfoMenuOpen"
                    >
                      <ul
                        class="pt4 pr4 pl4 pb0"
                        :class="{ dark, light: !dark }"
                      >
                        <li
                          v-for="(link, i) in infoMenuLinks.info"
                          :key="i"
                          class="w-fit-full h6 mb4 link-info"
                        >
                          <router-link
                            v-if="link.router"
                            :to="link.url"
                            v-text="link.label"
                            class="inline-block w-inherit color-inherit underline-hover"
                          />
                          <a
                            v-else
                            :href="link.url"
                            v-text="link.label"
                            target="_blank"
                            rel="noopener"
                            class="inline-block w-inherit color-inherit underline-hover"
                          />
                        </li>
                      </ul>
                      <el-divider class="m0" />
                      <ul
                        class="flex justify-content-space-around pt2 p2"
                        :class="{ dark, light: !dark }"
                      >
                        <li
                          v-for="(link, i) in infoMenuLinks.social"
                          :key="i"
                          class="w4 h4 circle-bg link-info social p2"
                        >
                          <a
                            :href="link.url"
                            target="_blank"
                            rel="noopener"
                            class="w-inherit color-inherit vertical-align"
                          >
                            <fa :icon="link.icon" class="sm-icon" />
                          </a>
                        </li>
                      </ul>
                      <fa
                        slot="reference"
                        class="sm-icon outline0"
                        :icon="['fas', 'ellipsis-v']"
                      />
                    </el-popover>
                  </div>
                </div>
              </li>
            </ul>

            <ul class="p0 pr4 m0 h-fit-full" role="group" :key="2" v-else>
              <li class="inline-block relative" data-no-outline="true">
                <a
                  href="https://blog.infrapedia.com"
                  class="list-item pl3 pr3"
                  target="_blank"
                >
                  Blog
                </a>
              </li>
              <li class="inline-block relative" data-no-outline="true">
                <div
                  class="list-item user-icon pr1 pl3"
                  aria-haspopup="true"
                  data-no-hover-bg="true"
                >
                  <el-popover
                    :visible-arrow="false"
                    placement="bottom-end"
                    width="220"
                    transition="el-zoom-in-top"
                    trigger="manual"
                    v-model="isUserMenuOpen"
                  >
                    <header
                      class="header no-selectable h8 flex justify-content-space-between pr7 pl6 pt2 pb2 align-items-center"
                      :class="{ dark, light: !dark }"
                    >
                      <strong class="fs-regular truncate">{{
                        userName
                      }}</strong>
                      <span
                        class="fs-regular cursor-pointer"
                        @click="toggleUserMenuVisibility"
                      >
                        <fa :icon="['fas', 'times']" />
                      </span>
                    </header>
                    <ul class="p1 h-fit" :class="{ dark, light: !dark }">
                      <li class="w-fit-full h10">
                        <el-button
                          type="text"
                          class="inline-block color-inherit"
                        >
                          <router-link
                            to="/app"
                            class="color-inherit"
                            @click="() => (isUserMenuOpen = false)"
                          >
                            <fa :icon="['fas', 'map']" class="mr4 ml4" />
                            Back to map
                          </router-link>
                        </el-button>
                      </li>
                      <li class="w-fit-full h10">
                        <el-button
                          type="text"
                          class="inline-block color-inherit"
                          @click="toggleDarkMode"
                        >
                          <fa :icon="['fas', 'adjust']" class="mr4 ml4" />
                          Toggle {{ dark ? 'light' : 'dark' }} mode
                        </el-button>
                      </li>
                      <!-- <li class="w-fit-full h10">
                        <el-button
                          type="text"
                          class="inline-block color-inherit"
                          @click="goToVersionOne"
                        >
                          <fa
                            :icon="['fas', 'window-maximize']"
                            class="mr4 ml4"
                          />
                          Version 1.0
                        </el-button>
                      </li> -->
                      <li class="w-fit-full h10" @click="logOutUser">
                        <el-button
                          type="text"
                          class="inline-block color-inherit"
                        >
                          <fa :icon="['fas', 'sign-out-alt']" class="mr5 ml4" />
                          <strong>Sign out</strong>
                        </el-button>
                      </li>
                    </ul>
                    <div
                      slot="reference"
                      class="no-outline circle icon-wrapper"
                      tabindex="0"
                      @click.stop="handleUserButtonDynamics"
                      @keyup.enter.space.stop="handleUserButtonDynamics"
                    >
                      <el-avatar
                        v-if="userImage"
                        size="small"
                        :src="$auth.user.picture"
                      />
                      <fa
                        v-else
                        :icon="['fas', 'user-circle']"
                        class="md-icon user-icon"
                      />
                    </div>
                  </el-popover>
                </div>
              </li>
            </ul>
          </transition-group>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import sponsors from '../config/navbarSponsors'
import infoMenuLinks from '../config/infoMenuLinks'
import dataCollection from '../mixins/dataCollection'
import FullScreenSearch from './FullScreenSearch.vue'
import { TOGGLE_DARK } from '../store/actionTypes'
import * as events from '../events/navbar'
import { bus } from '../helpers/eventBus'
import { deleteCookie } from '../helpers/cookies'
// setCookie
// const c_name = '_v-app_inf'

export default {
  name: 'INavbar',
  components: {
    IFilter: () => import('./Filter'),
    ISearch: () => import('./Search'),
    BottomSheet: () => import('./BottomSheet'),
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
    userImage() {
      return this.$auth.user && this.$auth.user.picture
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
    isProfileRoute() {
      let isProfile = false
      if (this.$route.name === 'user' || this.$route.name === 'user-profile') {
        isProfile = true
      }
      return isProfile
    },
    userName() {
      return this.$auth.user.name
    }
    // versionOneLink() {
    //   return process.env.VUE_APP_VERSION_APP_LINK
    // }
  },
  async mounted() {
    await this.loadPremiumPartners()
  },
  methods: {
    toggleDarkMode() {
      return this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
    },
    toggleDrawerVisibility() {
      this.isDrawerOpen = !this.isDrawerOpen
    },
    closeUnwantedOpenMenus() {
      if (this.isInfoMenuOpen) this.isInfoMenuOpen = false
    },
    toggleInfoMenuVisibility() {
      this.isInfoMenuOpen = !this.isInfoMenuOpen
    },
    toggleUserMenuVisibility() {
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    logOutUser() {
      deleteCookie('auth.token-session')
      return this.$auth.logout()
    },
    handleUserButtonDynamics() {
      if (!this.$auth.isAuthenticated) {
        // this.$store.state.isSafariNavigator
        //   ? this.$auth.loginWithPopup()
        this.$auth.loginWithRedirect()
      } else if (this.$route.name.includes('user')) {
        this.toggleUserMenuVisibility()
      } else if (this.$auth.isAuthenticated) this.$router.push('/user')
    },
    toggleMobileDrawer() {
      return bus.$emit(
        this.isUserNavbar
          ? `${events.TOGGLE_MOBILE_DRAWER_PROFILE}`
          : `${events.TOGGLE_MOBILE_DRAWER}`
      )
    }
    // goToVersionOne() {
    //   setCookie(
    //     c_name,
    //     this.versionOneLink,
    //     process.env.VUE_APP_EXP_DAYS_VERSION_DAYS_NOTICE
    //   )

    //   window.location.replace(this.versionOneLink)
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/navbar-styles.scss';
</style>
