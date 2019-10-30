<template>
  <div>
    <cookie-consent :message="cc.message" :href="cc.href" />
    <i-navbar role="navigation" />
    <template>
      <i-sidebar />
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </template>
    <i-footer role="contentinfo" />
  </div>
</template>

<script>
import INavbar from '@/components/Navbar'
import IFooter from '@/components/Footer'
import ISidebar from '@/components/Sidebar'

export default {
  components: {
    IFooter,
    INavbar,
    ISidebar
  },
  data: () => ({
    cc: {
      message:
        'This website uses cookies to improve your experience. Visit our Privacy Policy page for more information about cookies and how we use them.',
      href:
        'https://networkatlas.com/wp-content/uploads/2019/03/privacy-policy.pdf'
    }
  })
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/profile-styles.scss';
</style>
