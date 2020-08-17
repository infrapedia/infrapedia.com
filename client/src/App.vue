<template>
  <div
    class="application"
    :class="{ dark, light: !dark, 'no-overflow': isAuthenticated }"
    role="main"
    :style="getDarkStyles"
  >
    <div class="h-fit-content min-height60vh">
      <!-- <transition
        mode="out-in"
        name="animated faster2x"
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
      > -->
      <component :is="layout">
        <router-view :layout.sync="layout" @layout="changeLayout" />
      </component>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
import ProfileLayout from './layouts/profile'
import NoNav from './layouts/nothing'
import LandingPage from './layouts/homepage'
import MapHome from './layouts/default'

export default {
  name: 'App',
  data: () => ({
    layout: LandingPage
  }),
  created() {
    this.handleSharedView()
    if (this.$route.name == 'login') {
      this.layout = NoNav
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    title() {
      return this.mode == 'create' ? 'Create' : 'Edit'
    },
    isAuthenticated() {
      return this.$auth.isAuthenticated
    },
    getDarkStyles() {
      let theme = {}
      if (this.dark) {
        theme = {
          backgroundColor: '#303030'
        }
      }
      return theme
    }
  },
  methods: {
    handleSharedView() {
      const isSharedView =
        this.$route.query['amp;sharedView'] == 'true' ||
        this.$route.query['ampsharedView'] == 'true' ||
        this.$route.query.sharedView == 'true'

      if (isSharedView) {
        const getQueryParams = require('./helpers/getQueryParams').default
        const params = getQueryParams(decodeURIComponent(this.$route.fullPath))
        window.localStorage.setItem('__easePointData', JSON.stringify(params))
      }
    },
    changeLayout(layoutName) {
      const doc = document.querySelector('body')

      switch (layoutName) {
        case 'map-app-layout':
          doc.className = 'no-overflow'
          this.layout = MapHome
          break
        case 'nothing-layout':
          doc.className = 'no-overflow'
          this.layout = NoNav
          break
        case 'profile-layout':
          doc.className = 'no-overflow'
          this.layout = ProfileLayout
          break
        default:
          doc.className = 'overflow-scroll-y-imp'
          this.layout = LandingPage
          break
      }
    }
  }
}
</script>
<style lang="scss">
@import './assets/scss/main.scss';
</style>
