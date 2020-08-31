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
      <router-view />
    </transition>
    <h-footer />
  </el-container>
</template>

<script>
import HFooter from '../components/homepage/Footer'
import HNavbar from '../components/homepage/Navbar'
import HMobileDrawer from '../components/MobileDrawer'

export default {
  name: 'homepage',
  components: {
    HFooter,
    HNavbar,
    HMobileDrawer
  },
  data: () => ({
    isMobileDrawer: false
  }),
  created() {
    document.querySelector('body').className = 'overflow-y-auto'
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
