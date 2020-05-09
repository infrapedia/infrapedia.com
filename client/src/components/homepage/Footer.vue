<template>
  <el-footer height="100%" class="footer p0 pt20 pb20">
    <div class="inner-wrapper">
      <div class="logo-wrapper">
        <h1 class="logo-title inline-block">
          <router-link to="/">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
        </h1>
        <a
          target="_blank"
          href="https://www.google.com/maps/place/South+San+Francisco,+California+94083,+EE.+UU./@37.6500162,-122.4187548,15z/data=!3m1!4b1!4m5!3m4!1s0x808f79ac2e06d7eb:0x899aea1b64c95f9b!8m2!3d37.65!4d-122.41"
          class="fs-small mt4 inline-block w-fit-full underline-hover"
        >
          San Francisco, California 94083, US
        </a>
        <p class="fs-small mt4">
          {{ year }} Copyright, All Rights Reserved by Infrapedia Inc.
        </p>
      </div>
      <!-- <el-divider class="transparent w80 hidden-md-and-down"></el-divider> -->
      <div class="links-wrapper">
        <h3 class="title-link m0 mb8">Explore</h3>
        <ul role="group">
          <li class="list-item mb6" v-for="(link, i) in exploreLinks" :key="i">
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
                v-if="i === 0"
                :key="i"
                :to="checkIfLoggedIn"
                class="underline-hover color-inherit"
              >
                {{ link.label }}
              </router-link>
              <router-link
                v-else
                :key="i"
                :to="link.url"
                class="underline-hover color-inherit"
              >
                {{ link.label }}
              </router-link>
            </template>
          </li>
        </ul>
      </div>
      <div class="links-wrapper">
        <h3 class="title-link m0 mb8">Company</h3>
        <ul role="group">
          <li
            class="list-item mb6"
            v-for="(link, i) in infoMenuLinks.info"
            :key="i"
          >
            <template v-if="link.footer">
              <a
                v-if="link.openTab"
                :href="link.url"
                target="_blank"
                class="underline-hover color-inherit"
              >
                {{ link.label }}
              </a>
              <router-link
                v-else
                :to="link.url"
                class="underline-hover color-inherit"
                v-text="link.label"
              />
            </template>
          </li>
          <li class="list-item mb6">
            <router-link
              class="underline-hover color-inherit"
              to="/terms-and-conditions"
            >
              Terms & Conditions
            </router-link>
          </li>
          <li class="list-item mb6">
            <router-link
              class="underline-hover  color-inherit"
              to="/privacy-policy"
            >
              Privacy Policy
            </router-link>
          </li>
        </ul>
      </div>
      <div class="links-wrapper">
        <h3 class="title-link m0 mb8">Social</h3>
        <ul role="group">
          <li
            class="list-item mb6"
            v-for="(link, i) in infoMenuLinks.social"
            :key="i"
          >
            <a
              :href="link.url"
              target="_blank"
              class="underline-hover color-inherit"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </el-footer>
</template>

<script>
import infoMenuLinks from '../../config/infoMenuLinks'
import currentYear from '../../helpers/currentYear'

export default {
  name: 'HFooter',
  data: () => ({
    infoMenuLinks,
    exploreLinks: [
      {
        label: 'Home',
        url: '/'
      },
      {
        label: 'Blog',
        url: 'https://blog.infrapedia.com',
        tab: true
      },
      {
        label: 'Services',
        url: '/services'
      },
      {
        label: 'Sponsorships',
        url: '/sponsors'
      }
    ]
  }),
  computed: {
    year() {
      return currentYear()
    },
    checkIfLoggedIn() {
      return this.$auth.isAuthenticated ? '/app' : '/'
    },
    imageURL() {
      return !this.dark
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/homepage/footer-homepage-styles.scss';
</style>
