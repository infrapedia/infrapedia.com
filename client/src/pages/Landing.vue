<template>
  <el-container direction="vertical">
    <h-mobile-drawer
      class="hidden-md-and-up"
      :is-homepage-drawer="true"
      :visibility="isMobileDrawer"
      @close="closeDrawer"
    />
    <h-navbar @toggle-mobile-drawer="toggleDrawerVisibility" />
    <transition
      mode="out-in"
      name="animated faster3x"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
    >
      <home-page />
    </transition>
    <h-footer />
  </el-container>
</template>

<script>
import HFooter from '../components/homepage/Footer'
import HNavbar from '../components/homepage/Navbar'
import HMobileDrawer from '../components/MobileDrawer'
import HomePage from '../components/homepage/HomePage'
import { checkCookie } from '../helpers/cookies'

export default {
  components: {
    HomePage,
    HFooter,
    HNavbar,
    HMobileDrawer
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
    isPoolDialog: false,
    isMobileDrawer: false
  }),
  created() {
    document.querySelector('body').className = 'overflow-y-auto'
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
    closeDrawer() {
      this.isMobileDrawer = false

      const body = document.querySelector('body')
      body.className = this.isMobileDrawer ? 'no-overflow' : 'overflow-y-scroll'
    },
    toggleDrawerVisibility() {
      this.isMobileDrawer = !this.isMobileDrawer

      const body = document.querySelector('body')
      body.className = this.isMobileDrawer ? 'no-overflow' : 'overflow-y-scroll'
    }
  }
}
</script>
