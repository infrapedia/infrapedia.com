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
    link: [
      {
        rel: 'canonical',
        href: `https://www.infrapedia.com`
      }
    ],
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
      },
      // ------------------ FACEBOOK - OPEN GRAPH
      {
        vmid: 'og:title',
        name: 'og:title',
        content:
          'The world’s largest network and datacenter infrastructure atlas.'
      },
      {
        vmid: 'og:description',
        name: 'og:description',
        content:
          "Infrapedia is the world’s largest crowd-sourced map of the global Internet infrastructure. Explore in detail the world's data centers, submarine and terrestrial networks in real-time."
      },
      {
        vmid: 'og:image',
        name: 'og:image',
        content: '/infrapedia-2.jpg'
      },
      // ---------------------- TWITTER
      {
        vmid: 'twitter:title',
        name: 'twitter:title',
        content:
          'The world’s largest network and datacenter infrastructure atlas.'
      },
      {
        vmid: 'twitter:description',
        name: 'twitter:description',
        content:
          "Infrapedia is the world’s largest crowd-sourced map of the global Internet infrastructure. Explore in detail the world's data centers, submarine and terrestrial networks in real-time."
      },
      {
        vmid: 'twitter:image',
        name: 'twitter:image',
        content: '/infrapedia-2.jpg'
      },
      {
        vmid: 'content-language',
        name: 'content-language',
        content: 'en-US'
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
        checkCookie('auth0.is.authenticated') &&
        !localStorage.getItem('once-redirected')
      ) {
        vm.$router.push('/app')
        localStorage.setItem('once-redirected', true)
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
