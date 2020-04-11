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
    if (checkCookie('auth0.is.authenticated')) {
      return this.$router.replace('/')
    }
    this.$emit('layout', 'landing-layout')
  }
}
</script>
