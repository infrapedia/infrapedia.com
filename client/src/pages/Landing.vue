<template>
  <div class="min-height60vh">
    <home-page />
  </div>
</template>

<script>
import HomePage from '../components/homepage/HomePage'
import { checkCookie } from '../helpers/cookies'

export default {
  components: {
    HomePage
  },
  head: {
    title: 'Global Internet Infrastructure Map | Infrapedia',
    meta: [
      {
        name: 'application-name',
        content:
          'Global Internet Infrastructure Map | Telecommunications and Data Center Infrastructure'
      },
      {
        name: 'description',
        content:
          "Infrapedia is the world’s largest crowd-sourced map of the global Internet infrastructure. Explore in detail the world's data centers, submarine and terrestrial networks in real-time."
      },
      {
        name: 'keywords',
        content:
          'internet map, global internet infrastructure, submarine cable map. telecommunications, network pops, world internet structure'
      }
    ]
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
