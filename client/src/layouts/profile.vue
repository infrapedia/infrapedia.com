<template>
  <el-container class="vph-full no-overflow">
    <i-navbar role="navigation" :is-user-navbar="true" />

    <el-aside class="pt9 no-overflow">
      <ul role="group" class="pt10 h-fit-full">
        <li
          role="listitem"
          class="h18"
          v-for="(link, i) in profileLinks"
          :key="i"
        >
          <router-link
            exact
            :to="link.url"
            :class="checkURL(link)"
            class="inline-flex align-items-center pl8 color-inherit h-fit-full w-fit-full no-outline"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>
    </el-aside>
    <transition name="fade" mode="out-in"><router-view /></transition>

    <i-theme-toggler @click="toggleTheme" />
    <i-footer role="contentinfo" class="ml80 mb3" />
  </el-container>
</template>

<script>
import IThemeToggler from '../components/ThemeToggler'
import { TOGGLE_DARK } from '../store/actionTypes'
import profileLinks from '../config/profileLinks'
import INavbar from '../components/Navbar'
import IFooter from '../components/Footer'

export default {
  components: {
    IFooter,
    INavbar,
    IThemeToggler
  },
  data: () => ({
    profileLinks
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  async mounted() {
    if (!this.$auth.user) {
      await this.$auth.loginWithRedirect().then(async () => this.setToken())
    }
  },
  methods: {
    checkURL(link) {
      let obj = {}
      if (!this.$route.query.id) return obj
      else if (this.$route.query.id) {
        let pathName = link.url.split('/')
        pathName = pathName[pathName.length - 1]
        obj = {
          'router-link-exact-active router-link-active':
            this.$route.query.id.toLowerCase() === pathName
        }
      }
      return obj
    },
    async setToken() {
      const token = await this.$auth.getIdTokenClaims()
      window.localStorage.setItem('auth.token-session', token.__raw)
    },
    toggleTheme() {
      return this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/profile-styles.scss';
</style>
