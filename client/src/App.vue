<template>
  <div
    class="application"
    :class="{ dark, light: !dark }"
    role="main"
    :style="getDarkStyles"
  >
    <transition mode="out-in" name="fade">
      <component :is="layout" />
    </transition>
  </div>
</template>

<script>
import ProfileLayout from './layouts/profile'
import DefaultLayout from './layouts/default'
import BlogLayout from './layouts/blog'
import NoNav from './layouts/nothing'

export default {
  name: 'App',
  computed: {
    layout() {
      let layout

      if (this.isProfileRoute) {
        layout = ProfileLayout
      } else if (this.isBlogLayout || this.isLoginRoute) {
        layout = BlogLayout
      } else if (this.isRecoverPass) {
        layout = NoNav
      } else {
        layout = DefaultLayout
      }

      return layout
    },
    dark() {
      return this.$store.state.isDark
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
    isBlogLayout() {
      return this.$route.name === 'blog'
    },
    isLoginRoute() {
      return this.$route.name === 'login'
    },
    isProfileRoute() {
      console.log(this.$route)
      return this.$route.name.includes('user')
    }
  }
}
</script>
<style lang="sass">
@import './assets/scss/main.scss'
</style>
