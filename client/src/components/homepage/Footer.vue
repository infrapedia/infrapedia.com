<template>
  <el-footer height="100%" class="footer pt10 pb10">
    <div class="inner-wrapper p4">
      <div class="logo-wrapper">
        <h1 class="logo-title inline-block">
          <router-link to="/">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
        </h1>
        <p class="fs-small m0 ml1 mt4">v{{ packageVersion }}</p>
        <!-- <a
          target="_blank"
          href="https://www.google.com/maps/place/South+San+Francisco,+California+94083,+EE.+UU./@37.6500162,-122.4187548,15z/data=!3m1!4b1!4m5!3m4!1s0x808f79ac2e06d7eb:0x899aea1b64c95f9b!8m2!3d37.65!4d-122.41"
          class="fs-small text-white mt4 ml1 inline-block w-fit-full underline-hover"
        >
          San Francisco, California 94083, US
        </a> -->
        <p class="fs-small mt4 ml1">
          ©️ {{ year }} Copyright, All Rights Reserved by Infrapedia.
        </p>
      </div>
      <div class="links-wrapper">
        <div class="inner">
          <div class="link-list">
            <h3 class="title-link m0 mb4">Explore</h3>
            <ul role="group">
              <li
                class="list-item mb3"
                v-for="(link, i) in exploreLinks"
                :key="i"
              >
                <a
                  v-if="link.tab"
                  :href="link.url"
                  target="_blank"
                  class="underline-hover color-inherit"
                >
                  {{ link.label }}
                </a>
                <template v-else>
                  <router-link
                    v-if="i == 0 && $auth.isAuthenticated"
                    :key="i"
                    to="/"
                    class="underline-hover color-inherit"
                  >
                    {{ link.label }}
                  </router-link>
                  <router-link
                    v-else-if="i != 0"
                    :key="`${i}`"
                    :to="link.url"
                    class="underline-hover color-inherit"
                  >
                    {{ link.label }}
                  </router-link>
                </template>
              </li>
            </ul>
          </div>
          <div class="link-list">
            <h3 class="title-link m0 mb4">Company</h3>
            <ul role="group">
              <div class="flex column">
                <template v-for="(link, i) in infoMenuLinks.info">
                  <li
                    class="list-item mb3"
                    :key="i"
                    v-if="link.openTab && link.footer"
                    :data-index-link="link.footer.order"
                  >
                    <a :href="link.url" class="underline-hover color-inherit">
                      {{ link.label }}
                    </a>
                  </li>
                  <li
                    class="list-item mb3"
                    :key="`${i}`"
                    v-else-if="link.footer"
                    :data-index-link="link.footer.order"
                  >
                    <router-link
                      :to="link.url"
                      class="underline-hover color-inherit"
                      v-text="link.label"
                    />
                  </li>
                </template>
                <li class="list-item mb4" data-index-link="6">
                  <router-link
                    class="underline-hover  color-inherit"
                    to="/privacy-policy"
                  >
                    Privacy Policy
                  </router-link>
                </li>
                <li class="list-item mb4" data-index-link="5">
                  <router-link
                    class="underline-hover color-inherit"
                    to="/terms-and-conditions"
                  >
                    Terms & Conditions
                  </router-link>
                </li>
              </div>
            </ul>
          </div>
        </div>
        <div class="social-links mt12">
          <a
            v-for="(link, i) in infoMenuLinks.social"
            :key="i"
            :href="link.url"
            target="_blank"
            class="underline-hover color-inherit"
          >
            <fa :icon="link.icon" class="fs-medium" />
          </a>
        </div>
      </div>
    </div>
  </el-footer>
</template>

<script>
import infoMenuLinks from '../../config/infoMenuLinks'
import currentYear from '../../helpers/currentYear'
import pkg from '../../../package.json'

export default {
  name: 'HFooter',
  data: () => ({
    exploreLinks: [
      {
        label: 'Home',
        url: '/'
      },
      // {
      //   label: 'Services',
      //   url: '/services'
      // },
      {
        label: 'FAQ',
        url: '/faq'
      }
    ]
  }),
  computed: {
    year() {
      return currentYear()
    },
    infoMenuLinks() {
      return infoMenuLinks
    },
    packageVersion() {
      return pkg.version
    },
    checkIfLoggedIn() {
      return this.$auth.isAuthenticated ? '/' : '/'
    },
    imageURL() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/img/light-mode-logo.svg'
        : 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/homepage/footer-homepage-styles.scss';
</style>
