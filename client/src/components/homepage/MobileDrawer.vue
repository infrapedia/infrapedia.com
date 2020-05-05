<template>
  <transition
    tag="div"
    mode="out-in"
    name="animated faster"
    enter-active-class="slideInLeft"
    leave-active-class="slideOutLeft"
  >
    <el-card
      v-if="visibility"
      shadow="hover"
      :class="{ dark, light: !dark }"
      class="drawer-wrapper"
    >
      <div class="inner-wrapper">
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
        <ul role="list">
          <li v-for="(link, i) in links" :key="i" role="listitem">
            <router-link
              v-if="i === 0"
              :key="i"
              :to="checkIfLoggedIn"
              class="el-button no-border w-fit-full text-left transparent p4 underline-hover"
            >
              {{ link.label }}
            </router-link>
            <router-link
              v-else
              :key="i"
              :to="link.url"
              class="el-button no-border w-fit-full text-left transparent p4 underline-hover"
            >
              {{ link.label }}
            </router-link>
          </li>
        </ul>
        <div class="text-center mt12 w80" id="sponsors-wrapper">
          <el-divider />
          <h2 class="m0 mb10">
            Sponsors
          </h2>
          <ul role="list">
            <li class="block relative" data-no-outline="true" role="listitem">
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
              class="block relative mt8"
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
          </ul>
        </div>
      </div>
    </el-card>
  </transition>
</template>

<script>
export default {
  data: () => ({
    links: [
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
        label: 'About us',
        url: '/about'
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
  props: {
    visibility: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    '$route.path'(path) {
      if (path) {
        this.toggleVisibility()
      }
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    checkIfLoggedIn() {
      return this.$auth.isAuthenticated ? '/app' : '/'
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
    goToRoute(link) {
      if (this.$route.path != link) {
        this.toggleVisibility()
        this.$router.push(link)
      }
    },
    toggleVisibility() {
      return this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/homepage/homepage-mobile-drawer-styles.scss';
</style>
