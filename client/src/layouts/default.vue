<template>
  <div>
    <cookie-consent :message="cc.message" :href="cc.href" />
    <i-navbar role="navigation" />
    <template>
      <i-sidebar
        @buy-capacity="openBuyDialog"
        @edit-cable="handleEditCable"
        @report-issue="openIssuesDialog"
      />
      <i-buy-dialog />
      <i-issues-dialog />
      <user-cables-button />
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </template>
    <i-footer role="contentinfo" class="ml20 hidden-sm-and-down" />
  </div>
</template>

<script>
import INavbar from '@/components/Navbar'
import IFooter from '@/components/Footer'
import ISidebar from '@/components/Sidebar'
import IBuyDialog from '@/components/dialogs/BuyDialog'
import IIssuesDialog from '@/components/dialogs/IssuesDialog'
import { BUY_CAPACITY, EDIT_CABLE } from '../events/sidebar'
import {
  BUY_TYPE,
  TOGGLE_BUY_DIALOG,
  TOGGLE_ISSUES_DIALOG
} from '../store/actionTypes'
import UserCablesButton from '../components/UserCablesButton'

export default {
  components: {
    IFooter,
    INavbar,
    ISidebar,
    IBuyDialog,
    IIssuesDialog,
    UserCablesButton
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
  async mounted() {
    // console.log(this.$auth)
    if (this.$auth && this.$auth.isAuthenticated) {
      await this.setToken()
    }
  },
  methods: {
    async setToken() {
      const token = await this.$auth.getIdTokenClaims()
      window.localStorage.setItem('auth.token-session', token.__raw)
    },
    openBuyDialog(option) {
      this.$store.commit(`${BUY_TYPE}`, { title: option })
      this.$store.commit(`${TOGGLE_BUY_DIALOG}`, true)
    },
    openIssuesDialog() {
      this.$store.commit(`${TOGGLE_ISSUES_DIALOG}`, true)
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
