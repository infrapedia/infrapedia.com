<template>
  <el-container direction="vertical">
    <cookie-consent :message="cc.message" :href="cc.href" />
    <h-navbar />
    <transition mode="out-in" name="fade">
      <slot />
    </transition>
    <h-footer />
  </el-container>
</template>

<script>
import HFooter from '../components/homepage/Footer'
import HNavbar from '../components/homepage/Navbar'

export default {
  name: 'homepage',
  data: () => ({
    cc: {
      message:
        'This website uses cookies to improve your experience. Visit our Privacy Policy page for more information about cookies and how we use them.',
      href:
        'https://networkatlas.com/wp-content/uploads/2019/03/privacy-policy.pdf'
    }
  }),
  components: {
    HFooter,
    HNavbar
  }
}
</script>
