<template>
  <div class="min-height60vh">
    <home-page />
    <votation-dialog
      :is-visible="isPoolDialog"
      @close="() => (isPoolDialog = false)"
    />
  </div>
</template>

<script>
import HomePage from '../components/homepage/HomePage'
import { checkCookie } from '../helpers/cookies'
import VotationDialog from '../components/dialogs/VotationDialog'
import { checkUserVote } from '../services/api/voting'
import debounce from '../helpers/debounce'

export default {
  components: {
    HomePage,
    VotationDialog
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
  data: () => ({
    isPoolDialog: false
  }),
  beforeCreate() {
    this.$emit('layout', 'landing-layout')
  },
  async created() {
    await this.checkVote()
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
  },
  methods: {
    checkVote: debounce(async function() {
      const { t } = (await checkUserVote('')) || {
        t: 'error'
      }
      if (t && t != 'error') {
        this.isPoolDialog = true
      }
    }, 1200)
  }
}
</script>
