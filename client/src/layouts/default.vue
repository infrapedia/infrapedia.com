<template>
  <div>
    <cookie-consent :message="cc.message" :href="cc.href" />
    <i-navbar role="navigation" />
    <template>
      <i-sidebar @buy-capacity="openDialog" @edit-cable="handleEditCable" />
      <i-buy-dialog />
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
import IBuyDialog from '@/components/BuyDialog'
import { BUY_CAPACITY, EDIT_CABLE } from '../events'
import { TOGGLE_BUY_DIALOG, BUY_TYPE } from '../store/actionTypes'

export default {
  components: {
    IFooter,
    INavbar,
    ISidebar,
    IBuyDialog
  },
  data: () => ({
    BUY_CAPACITY,
    EDIT_CABLE,
    cc: {
      message:
        'This website uses cookies to improve your experience. Visit our Privacy Policy page for more information about cookies and how we use them.',
      href:
        'https://networkatlas.com/wp-content/uploads/2019/03/privacy-policy.pdf'
    }
  }),
  methods: {
    openDialog(option) {
      this.$store.commit(`${BUY_TYPE}`, { title: option })
      this.$store.commit(`${TOGGLE_BUY_DIALOG}`, true)
    },
    handleEditCable() {
      console.warn('NOT DONE YET')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/profile-styles.scss';
</style>
