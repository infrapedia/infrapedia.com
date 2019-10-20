<template>
  <header class="header fixed h12 w-full no-padding">
    <div class="header-inner-wrapper w-full flex relative h-fit-full">
      <div class="flex no-padding navbar-wrapper w-full justify-content-space-between pr6 pl6">
        <h1 class="logo-title">
          <router-link to="/">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
        </h1>
        <ul class="links-wrapper p0 m0 h-fit-full">
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              Our Partners
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              Submarine Cables
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              Data Centers
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              IXPs
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              Networks
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <li class="inline-block relative" data-no-outline="true">
            <div class="list-item info-menu pr1 pl1" aria-haspopup="true" data-no-hover-bg="true">
              <i-search />
            </div>
          </li>
          <li class="inline-block relative" data-no-outline="true">
            <div class="list-item info-menu pr3 pl3" aria-haspopup="true" data-no-hover-bg="true">
              <i-filter />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block relative">
            <div class="list-item sponsors-menu" aria-haspopup="true">
              <el-popover
                placement="bottom-end"
                width="320"
                trigger="manual"
                v-model="isSponsorsMenuOpen"
              >
                <div>
                  <header class="flex justify-content-end">
                    <span
                      class="inline-block mr2 cursor-pointer"
                      @click="toggleSponsorsMenuVisibility"
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
            <div class="list-item user-icon pr1 pl3" aria-haspopup="true" data-no-hover-bg="true">
              <div class="no-outline circle icon-wrapper" tabindex="0">
                <fa :icon="['fas', 'user-circle']" class="md-icon" />
              </div>
            </div>
          </li>
          <li class="inline-block relative" data-no-outline="true">
            <div class="list-item info-menu pr1 pl1" aria-haspopup="true" data-no-hover-bg="true">
              <div class="p2 no-outline icon-wrapper circle" tabindex="0" data-rotate="true">
                <i aria-hidden="true" class="el-icon-more icon sm-icon" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import IFilter from './Filter'
import ISearch from './Search'

export default {
  name: 'INavbar',
  components: {
    'i-filter': IFilter,
    'i-search': ISearch
  },
  data: () => ({
    search: '',
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
    imageURL() {
      return this.theme
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    }
  },
  methods: {
    toggleSponsorsMenuVisibility() {
      this.isSponsorsMenuOpen = !this.isSponsorsMenuOpen
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/navbar-styles.scss';
</style>
