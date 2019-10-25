<template>
  <div
    class="application" :class="{ dark, light: !dark }"
    role="main"
    :style="getDarkStyles"
  >
    <transition mode="out-in" name="fade">
      <keep-alive>
        <component :is="layout" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import ProfileLayout from './layouts/profile'
import DefaultLayout from './layouts/default'
import NoNavLayout from './layouts/default'

export default {
  name: 'App',
  computed: {
    layout() {
      let layout = NoNavLayout
      if (this.isProfileRoute) {
        layout = ProfileLayout
      } else if (!this.isRecoverPass)  {
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
      return this.$route.name === 'nonav'
    },
    isProfileRoute() {
      let isProfile = false
      if (this.$route.name === 'user' || this.$route.name === 'user-profile') {
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
