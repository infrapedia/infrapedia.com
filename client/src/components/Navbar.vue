<template>
  <header class="header fixed h12 w-full no-padding">
    <div class="header-inner-wrapper w-full flex relative h-fit-full">
      <div class="flex no-padding navbar-wrapper w-full justify-content-space-between pr6 pl6">
        <h1 class="logo-title">
          <router-link to="/">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
        </h1>

        <div aria-labelledby="rightnavheading" class="links-wrapper">
          <transition-group name="fade" mode="out-in">
            <ul class="p0 m0 h-fit-full" role="group" :key="1" v-if="!isUserNavbar">

              <li
                class="inline-block no-selectable relative"
                role="listitem"
              >
                <el-popover
                  trigger="manual"
                  v-model="isPartnersMenuOpen"
                  :visible-arrow="false"
                >
                  <i-list
                    option="partners"
                    @click="handleItemListSelection"
                    @load-more="handleLoadMoreItems('partners')"
                  />
                  <div
                    slot="reference"
                    aria-haspopup="true"
                    class="list-item pr4 pl4 no-selectable"
                    @click.stop="handlePremiumSelection"
                    @keyup.enter.space="handlePremiumSelection"
                  >
                    Our Partners
                    <i
                      aria-hidden="true"
                      class="el-icon-arrow-down icon sm-icon ml1"
                    />
                  </div>
                </el-popover>
              </li>
              <el-divider direction="vertical" class="m0" />

              <li
                class="inline-block no-selectable relative"
                role="listitem"
              >
                <el-popover
                  trigger="manual"
                  :visible-arrow="false"
                  v-model="isSubmarineMenuOpen"
                  @after-leave="clearSubsea"
                >
                  <i-list
                    option="submarine"
                    @click="handleItemListSelection"
                    @load-more="handleLoadMoreItems('submarine')"
                  />
                    <div
                      slot="reference"
                      aria-haspopup="true"
                      class="list-item pr4 pl4 no-selectable"
                      @click.stop="handleSubmarineSelection"
                      @keyup.enter.space="handleSubmarineSelection"
                    >
                      Submarine Cables
                      <i
                        aria-hidden="true"
                        class="el-icon-arrow-down icon sm-icon ml1"
                      />
                    </div>
                </el-popover>
              </li>
              <el-divider direction="vertical" class="m0" />

              <li
                class="inline-block no-selectable relative"
                role="listitem"
              >
                <el-popover
                  trigger="manual"
                  :visible-arrow="false"
                  v-model="isDataCentersMenuOpen"
                  @after-leave="clearDataCenters"
                >
                <i-list
                  option="dataCenters"
                  @click="handleItemListSelection"
                  @load-more="handleLoadMoreItems('dataCenters')"
                />
                  <div
                    slot="reference"
                    aria-haspopup="true"
                    class="list-item pr4 pl4 no-selectable"
                    @click.stop="handleDataCenterSelection"
                    @keyup.enter.space="handleDataCenterSelection"
                  >
                    Data Centers
                    <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
                  </div>
                </el-popover>
              </li>

                <el-divider direction="vertical" class="m0" />
              <li
                class="inline-block no-selectable relative"
                role="listitem"
              >
                <el-popover
                  trigger="manual"
                  :visible-arrow="false"
                  v-model="isIxpsMenuOpen"
                  @after-leave="clearIxps"
                >
                  <i-list
                    option="ixps"
                    @click="handleItemListSelection"
                    @load-more="handleLoadMoreItems('ixps')"
                  />
                  <div
                    slot="reference"
                    aria-haspopup="true"
                    class="list-item pr6 pl6 no-selectable"
                    @click.stop="handleIxpsSelection"
                    @keyup.enter.space="handleIxpsSelection"
                  >
                    IXPs
                    <i
                      aria-hidden="true"
                      class="el-icon-arrow-down icon sm-icon ml1"
                    />
                  </div>
                </el-popover>
              </li>

              <el-divider direction="vertical" class="m0" />
              <li
                class="inline-block no-selectable relative"
                role="listitem"
              >
                <el-popover
                  trigger="manual"
                  :visible-arrow="false"
                  v-model="isNetworsMenuOpen"
                  @after-leave="clearNetworks"
                >
                  <i-list
                    option="networks"
                    @click="handleItemListSelection"
                    @load-more="handleLoadMoreItems('networks')"
                  />
                    <div
                      slot="reference"
                      class="list-item pr4 pl4 no-selectable"
                      aria-haspopup="true"
                      @click.stop="handleNetworksSelection"
                      @keyup.enter.space="handleNetworksSelection"
                    >
                      Networks
                      <i
                        aria-hidden="true"
                        class="el-icon-arrow-down icon sm-icon ml1"
                      />
                    </div>
                  </el-popover>
                </li>

              <li class="inline-block relative" data-no-outline="true" role="listitem">
                <div
                  class="list-item info-menu pr1 pl1"
                  aria-haspopup="true"
                  data-no-hover-bg="true"
                >
                  <i-search @search-selection="handleItemListSelection" />
                </div>
              </li>
              <li class="inline-block relative" data-no-outline="true" role="listitem">
                <div
                  class="list-item info-menu pr3 pl3"
                  aria-haspopup="true"
                  data-no-hover-bg="true"
                >
                  <i-filter @open="closeUnwantedOpenMenus" />
                </div>
              </li>
              <el-divider direction="vertical" class="m0" />
              <li class="inline-block relative" role="listitem">
                <div class="list-item sponsors-menu" aria-haspopup="true">
                  <el-popover
                    placement="bottom-end"
                    width="320"
                    :popper-class="popoverClassGiver"
                    transition="el-zoom-in-top"
                    trigger="manual"
                    v-model="isSponsorsMenuOpen"
                  >
                    <div class="p2 sponsors-wrapper" :class="{ dark, light: !dark }">
                      <header class="flex justify-content-end">
                        <span
                          class="inline-block mr2 cursor-pointer"
                          @click.stop="() => isSponsorsMenuOpen = false"
                          @keyup.enter.space="() => isSponsorsMenuOpen = false"
                        >
                          <fa :icon="['fas', 'times']" class="sm-icon" />
                        </span>
                      </header>
                      <div class="flex justify-content-space-around no-border">
                        <a
                          v-for="(sponsor, i) in sponsors"
                          :key="i"
                          target="_blank"
                          :href="sponsor.url"
                        >
                          <el-image
                            :src="sponsor.src"
                            fit="contain"
                            class="w24 h24"
                            :alt="sponsor.alt"
                            referrer-policy="strict-origin-when-cross-origin"
                          />
                        </a>
                      </div>
                    </div>
                    <el-button
                      id="sponsorsBtn"
                      slot="reference"
                      class="m0 w-fit-full h-fit-full no-border vertical-align p4"
                      @click.stop="toggleSponsorsMenuVisibility"
                    >
                      <fa :icon="['fas', 'star']" class="sm-icon mr3" />
                      <font size="2" class="link">Sponsors</font>
                    </el-button>
                  </el-popover>
                </div>
              </li>
              <el-divider direction="vertical" class="m0" />

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
                    <template v-if="isProfileRoute">
                      <header
                        class="header no-selectable h8 flex justify-content-space-between pr7 pl6 pt2 pb2 align-items-center"
                        :class="{ dark, light: !dark }"
                      >
                        <strong class="fs-regular truncate">{{ userName }}</strong>
                        <span class="fs-regular cursor-pointer" @click="toggleUserMenuVisibility">
                          <fa :icon="['fas', 'times']" />
                        </span>
                      </header>
                      <ul class="p1 h-fit">
                        <li class="w-fit-full h10">
                          <el-button type="text" class="inline-block color-inherit">
                            <fa :icon="['fas', 'map']" class="mr4 ml4" />
                            <router-link to="/" class="color-inherit">Back to map</router-link>
                          </el-button>
                        </li>
                        <li class="w-fit-full h10">
                          <el-button
                            type="text"
                            class="inline-block color-inherit"
                          >
                            <fa :icon="['fas', 'sign-out-alt']" class="mr5 ml4" />
                            <strong>Sign out</strong>
                          </el-button>
                        </li>
                      </ul>
                    </template>
                    <div
                      slot="reference"
                      class="no-outline circle icon-wrapper"
                      tabindex="0"
                      @click="userRegistration"
                      @keyup.enter.space="userRegistration"
                    >
                      <fa :icon="['fas', 'user-circle']" class="md-icon user-icon" />
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
                          <a
                            :href="link.url"
                            v-text="link.label"
                            target="_blank"
                            rel="noopener"
                            class="inline-block w-inherit color-inherit"
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
                      <strong class="fs-regular truncate">{{ userName }}</strong>
                      <span
                        class="fs-regular cursor-pointer"
                        @click="toggleUserMenuVisibility"
                      >
                        <fa :icon="['fas', 'times']" />
                      </span>
                    </header>
                    <ul class="p1 h-fit" :class="{ dark, light: !dark }">
                      <li class="w-fit-full h10">
                        <el-button type="text" class="inline-block color-inherit">
                          <router-link
                            to="/"
                            class="color-inherit"
                            @click="() => isUserMenuOpen = false"
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
                      @click="userRegistration"
                      @keyup.enter.space="userRegistration"
                    >
                      <fa :icon="['fas', 'user-circle']" class="md-icon" />
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
import IList from './List'
import IFilter from './Filter'
import ISearch from './Search'
import sponsors from '../config/navbarSponsors'
import infoMenuLinks from '../config/infoMenuLinks'
import dataCollection from '../mixins/dataCollection'

export default {
  name: 'INavbar',
  components: {
    IList,
    IFilter,
    ISearch
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
    isUserMenuOpen: false,
    isInfoMenuOpen: false,
    isIxpsMenuOpen: false,
    isNetworsMenuOpen: false,
    isSponsorsMenuOpen: false,
    isPartnersMenuOpen: false,
    isSubmarineMenuOpen: false,
    isDataCentersMenuOpen: false,
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    popoverClassGiver() {
      let c = 'popover'
      if (this.dark) c += ' dark'
      else c += ' light'
      return c
    },
    imageURL() {
      return this.dark
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    },
    isProfileRoute() {
      let isProfile = false
      if (this.$route.name === 'user' || this.$route.name === 'user-profile') {
        isProfile = true
      }
      return isProfile
    },
    userName() {
      return 'Jhon Doe'
    }
  },
  async mounted() {
    // Sponsors need to be open at first load
    await setTimeout(() => (this.isSponsorsMenuOpen = true), 100)
    // And close after 10 seconds
    await setTimeout(() => (this.isSponsorsMenuOpen = false), 10000)
    document.addEventListener('click', this.closeUnwantedOpenMenus)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeUnwantedOpenMenus)
  },
  methods: {
    closeUnwantedOpenMenus(e) {
      const menus = [
        'isIxpsMenuOpen',
        'isNetworsMenuOpen',
        'isSponsorsMenuOpen',
        'isPartnersMenuOpen',
        'isSubmarineMenuOpen',
        'isDataCentersMenuOpen'
      ]

      for (let menu of menus) {
        if (this[menu]) this[menu] = false
      }
      if (e || this.isInfoMenuOpen) this.isInfoMenuOpen = false
    },
    toggleMenu(name) {
      if (!name) return
      let menuName = name.toLowerCase()
      this.closeUnwantedOpenMenus()
      switch(menuName) {
        case 'partners':
          this.isPartnersMenuOpen = !this.isPartnersMenuOpen
          break
        case 'datacenters':
          this.isDataCentersMenuOpen = !this.isDataCentersMenuOpen
          break
        case 'submarine':
          this.isSubmarineMenuOpen = !this.isSubmarineMenuOpen
          break
        case 'ixps':
          this.isIxpsMenuOpen = !this.isIxpsMenuOpen
          break
        case 'networks':
          this.isNetworsMenuOpen = !this.isNetworsMenuOpen
          break
      }
    },
    toggleSponsorsMenuVisibility() {
      this.closeUnwantedOpenMenus()
      this.isSponsorsMenuOpen = !this.isSponsorsMenuOpen
    },
    toggleInfoMenuVisibility() {
      this.closeUnwantedOpenMenus()
      this.isInfoMenuOpen = !this.isInfoMenuOpen
    },
    toggleUserMenuVisibility() {
      this.closeUnwantedOpenMenus()
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    userRegistration() {
      if (this.$store.state.isOnline && !this.isProfileRoute) {
        this.$router.push('/user')
      } else this.toggleUserMenuVisibility()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/navbar-styles.scss';
</style>
