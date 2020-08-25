<template>
  <div
    class="application"
    :class="{ dark, light: !dark, 'no-overflow': isAuthenticated }"
    role="main"
    :style="getDarkStyles"
  >
    <cookie-consent :message="cc.message" :href="cc.href" />
    <transition
      tag="div"
      mode="out-in"
      name="animated super-fast"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.handleSharedView()
    console.log('APP created!!')
  },
  computed: {
    cc() {
      return {
        message:
          'This website uses cookies to improve your experience. Visit our Privacy Policy page for more information about cookies and how we use them.',
        href: window.origin + '/privacy-policy'
      }
    },
    dark() {
      return this.$store.state.isDark
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
    }
  }
}
</script>
<style lang="scss">
@import './assets/scss/main.scss';
</style>
