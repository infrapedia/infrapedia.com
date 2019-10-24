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
            <ul class="p0 m0 h-fit-full" role="group" :key="1" v-if="!isProfileRoute">
              <li class="inline-block relative" tabindex="0" role="listitem">
                <div class="list-item pr4 pl4" aria-haspopup="true">
                  Our Partners
                  <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
                </div>
              </li>
              <el-divider direction="vertical" class="m0" />
              <li class="inline-block relative" tabindex="0" role="listitem">
                <div class="list-item pr4 pl4" aria-haspopup="true">
                  Submarine Cables
                  <i
                    aria-hidden="true"
                    class="el-icon-arrow-down icon sm-icon ml1"
                  />
                </div>
              </li>
              <el-divider direction="vertical" class="m0" />
              <li class="inline-block relative" tabindex="0" role="listitem">
                <div class="list-item pr4 pl4" aria-haspopup="true">
                  Data Centers
                  <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
                </div>
              </li>
              <el-divider direction="vertical" class="m0" />
              <li class="inline-block relative" tabindex="0" role="listitem">
                <div class="list-item pr6 pl6" aria-haspopup="true">
                  IXPs
                  <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
                </div>
              </li>
              <el-divider direction="vertical" class="m0" />
              <li class="inline-block relative" tabindex="0" role="listitem">
                <div class="list-item pr4 pl4" aria-haspopup="true">
                  Networks
                  <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
                </div>
              </li>
              <li class="inline-block relative" data-no-outline="true" role="listitem">
                <div
                  class="list-item info-menu pr1 pl1"
                  aria-haspopup="true"
                  data-no-hover-bg="true"
                >
                  <i-search />
                </div>
              </li>
              <li class="inline-block relative" data-no-outline="true" role="listitem">
                <div
                  class="list-item info-menu pr3 pl3"
                  aria-haspopup="true"
                  data-no-hover-bg="true"
                >
                  <i-filter />
                </div>
              </li>
              <el-divider direction="vertical" class="m0" />
              <li class="inline-block relative" role="listitem">
                <div class="list-item sponsors-menu" aria-haspopup="true">
                  <el-popover
                    placement="bottom-end"
                    width="320"
                    transition="el-zoom-in-top"
                    trigger="manual"
                    v-model="isSponsorsMenuOpen"
                  >
                    <div class="p2">
                      <header class="flex justify-content-end">
                        <span
                          class="inline-block mr2 cursor-pointer"
                          @click="toggleSponsorsMenuVisibility"
                          @keyup.enter.space="toggleSponsorsMenuVisibility"
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
                      <fa :icon="['fas', 'user-circle']" class="md-icon" />
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
                    @click="toggleInfoMenuVisibility"
                    @keyup.enter.space="toggleInfoMenuVisibility"
                  >
                    <el-popover
                      :visible-arrow="false"
                      placement="bottom-end"
                      width="200"
                      transition="el-zoom-in-top"
                      trigger="manual"
                      v-model="isInfoMenuOpen"
                    >
                      <ul class="pt4 pr4 pl4 pb0">
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
                      <ul class="flex justify-content-space-around pt2 p2">
                        <li
                          v-for="(link, i) in infoMenuLinks.social"
                          :key="i"
                          class="w4 h4 circle-bg link-info p2"
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
                      <fa slot="reference" class="sm-icon outline0" :icon="['fas', 'ellipsis-v']" />
                    </el-popover>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="p0 m0 h-fit-full" role="group" :key="2" v-else>
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
                    trigger="click"
                  >
                    <header
                      class="header no-selectable h8 flex justify-content-space-between pr7 pl6 pt2 pb2 align-items-center"
                      :class="{ dark, light: !dark }"
                    >
                      <strong class="fs-regular truncate">{{ userName }}</strong>
                      <span class="fs-regular cursor-pointer">
                        <fa :icon="['fas', 'times']" />
                      </span>
                    </header>
                    <ul class="p1 h-fit">
                      <li class="w-fit-full h10">
                        <el-button type="text" class="inline-block color-inherit">
                          <router-link to="/" class="color-inherit">
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
import IFilter from './Filter'
import ISearch from './Search'
import infoMenuLinks from '../config/infoMenuLinks'

export default {
  name: 'INavbar',
  components: {
    'i-filter': IFilter,
    'i-search': ISearch
  },
  data: () => ({
    search: '',
    infoMenuLinks,
    isUserMenuOpen: false,
    isInfoMenuOpen: false,
    isSponsorsMenuOpen: false,
    sponsors: [
      {
        url: 'https://www.catchpoint.com/',
        alt: 'catchpoint advertiser',
        src: 'https://cdn.infrapedia.com/sponsors/catchpoint-logo.f5a07e5f.jpg'
      },
      {
        url:
          'https://ipv4.global/?utm_source=digitalads&utm_medium=banner&utm_campaign=networkatlas&utm_content=sidebar',
        alt: 'ipv4 advertiser',
        src: 'https://cdn.infrapedia.com/sponsors/ipv4-global-logo.033610fc.jpg'
      },
      {
        url: 'https://www.infrapedia.com/',
        alt: 'ad space available',
        src: 'https://storage.googleapis.com/infrapedia_bucket/sponsors/ads.png'
      }
    ]
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    imageURL() {
      return this.theme
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    },
    isProfileRoute() {
      return this.$route.name === 'profile'
    },
    userName() {
      return 'Manuel Blanco'
    }
  },
  async mounted() {
    // Sponsors need to be open at first load
    await setTimeout(() => (this.isSponsorsMenuOpen = true), 100)
    // And close after 10 seconds
    await setTimeout(() => (this.isSponsorsMenuOpen = false), 10000)
  },
  methods: {
    toggleSponsorsMenuVisibility() {
      this.isSponsorsMenuOpen = !this.isSponsorsMenuOpen
    },
    toggleInfoMenuVisibility() {
      this.isInfoMenuOpen = !this.isInfoMenuOpen
    },
    toggleUserMenuVisibility() {
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    userRegistration() {
      if (this.$store.state.isOnline && !this.isProfileRoute) {
        this.toggleUserMenuVisibility()
        this.$router.push('/profile')
      } else this.toggleUserMenuVisibility()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/navbar-styles.scss';
</style>
