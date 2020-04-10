<template>
  <div
    class="application"
    :class="{ dark, light: !dark, 'no-overflow': !isHomePageRoute }"
    role="main"
    :style="getDarkStyles"
  >
    <versions-banner />
    <transition mode="out-in" name="fade">
      <component :is="layout" />
    </transition>
  </div>
</template>

<script>
import DashboardLayout from './layouts/dashboard'
import ProfileLayout from './layouts/profile'
import DefaultLayout from './layouts/default'
import BlogLayout from './layouts/blog'
import NoNav from './layouts/nothing'
import VersionsBanner from './components/VersionsBanner'
import HomePageLayout from './layouts/homepage'

export default {
  name: 'App',
  components: {
    VersionsBanner
  },
  async created() {
    this.checkIfIsNotSecure()
    this.handleSharedView()
  },
  computed: {
    layout() {
      let layout

      if (this.isHomePageRoute) {
        layout = HomePageLayout
      } else if (this.isProfileRoute) {
        layout = ProfileLayout
      } else if (this.isBlogLayout || this.isLoginRoute) {
        layout = BlogLayout
      } else if (this.isRecoverPass) {
        layout = NoNav
      } else if (this.isDashboard) {
        layout = DashboardLayout
      } else if (this.$auth.isAuthenticated) {
        layout = DefaultLayout
      }

      return layout
    },
    dark() {
      return this.$store.state.isDark
    },
    isHomePageRoute() {
      return (
        !this.isProfileRoute &&
        !this.$auth.isAuthenticated &&
        !this.isRecoverPass &&
        !this.isLoginRoute &&
        !this.isDashboard &&
        !this.isBlogLayout
      )
    },
    getDarkStyles() {
      let theme = {}
      if (this.dark) {
        theme = {
          backgroundColor: '#303030'
        }
      }
      return theme
    },
    isRecoverPass() {
      return this.$route.name === 'change-password'
    },
    isDashboard() {
      return (
        this.$route.name === 'dashboard' || this.$route.name === 'marketplace'
      )
    },
    isBlogLayout() {
      return this.$route.name === 'blog'
    },
    isLoginRoute() {
      return this.$route.name === 'login'
    },
    isProfileRoute() {
      return this.$route.name.includes('user')
    }
  },
  methods: {
    checkIfIsNotSecure() {
      if (
        process.env.NODE_ENV === 'production' &&
        window.location.protocol !== 'https:'
      ) {
        window.location.replace(
          `https:${window.location.href.substring(
            window.location.protocol.length
          )}`
        )
      }
    },
    handleSharedView() {
      if (
        this.$route.query &&
        !window.localStorage.getItem('__easePointData')
      ) {
        window.localStorage.setItem(
          '__easePointData',
          JSON.stringify(this.$route.query)
        )
      }
    }
  }
}
</script>
<style lang="scss">
@import './assets/scss/main.scss';
</style>
