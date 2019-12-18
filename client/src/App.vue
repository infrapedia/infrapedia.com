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
// import NoNavLayout from './layouts/nonav'
import ProfileLayout from './layouts/profile'
import DefaultLayout from './layouts/default'

export default {
  name: 'App',
  computed: {
    layout() {
      let layout

      if (this.isProfileRoute) {
        layout = ProfileLayout
      } else if (!this.isRecoverPass) {
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
    isProfileRoute() {
      let isProfile = false
      if (this.$route.name.includes('user')) {
        isProfile = true
      }
      return isProfile
    }
  }
}
</script>
<style lang="sass">
@import './assets/scss/main.scss'
</style>
