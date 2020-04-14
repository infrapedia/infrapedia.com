<template>
  <el-container direction="vertical">
    <cookie-consent :message="cc.message" :href="cc.href" />
    <h-mobile-drawer
      :visibility="isMobileDrawer"
      @close="toggleDrawerVisibility"
    />
    <h-navbar @toggle-mobile-drawer="toggleDrawerVisibility" />
    <transition
      mode="out-in"
      name="animated faster3x"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
    >
      <slot />
    </transition>
    <h-footer />
  </el-container>
</template>

<script>
import HFooter from '../components/homepage/Footer'
import HNavbar from '../components/homepage/Navbar'
import HMobileDrawer from '../components/homepage/MobileDrawer'

export default {
  name: 'homepage',
  components: {
    HFooter,
    HNavbar,
    HMobileDrawer
  },
  data: () => ({
    isMobileDrawer: false,
    cc: {
      message:
        'This website uses cookies to improve your experience. Visit our Privacy Policy page for more information about cookies and how we use them.',
      href:
        'https://networkatlas.com/wp-content/uploads/2019/03/privacy-policy.pdf'
    }
  }),
  methods: {
    toggleDrawerVisibility() {
      const body = document.querySelector('body')
      this.isMobileDrawer = !this.isMobileDrawer
      body.className = this.isMobileDrawer ? 'no-overflow' : 'overflow-y-scroll'
    }
  }
}
</script>
