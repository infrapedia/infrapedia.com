<template>
  <div class="application" :class="{ dark, light: !dark }" role="main">
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
      let layout = DefaultLayout
      if (this.isProfileRoute) {
        layout = ProfileLayout
      } else if (this.isRecoverPass)  {
        layout = NoNavLayout
      }
      return layout
    },
    dark() {
      return this.$store.state.isDark
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
