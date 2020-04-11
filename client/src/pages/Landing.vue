<template>
  <home-page />
</template>

<script>
import HomePage from '../components/homepage/HomePage'
import { checkCookie } from '../helpers/cookies'

export default {
  components: {
    HomePage
  },
  beforeCreate() {
    this.$emit('layout', 'landing-layout')
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      if (
        checkCookie('auth0.is.authenticated') ||
        (await vm.$auth.checkAuthStatus()) === true ||
        window.location.search.includes('code=')
      ) {
        vm.$router
          .replace('/login')
          .then(() => {})
          // eslint-disable-next-line
          .catch(err => {
            // Ignore
          })
      }
    })
  }
}
</script>
