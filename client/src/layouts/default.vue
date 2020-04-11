<template>
  <div>
    <cookie-consent :message="cc.message" :href="cc.href" />
    <i-navbar role="navigation" />
    <template>
      <i-sidebar
        @buy-capacity="openBuyDialog"
        @edit-cable="handleEditCable"
        @report-issue="openIssuesDialog"
        @create-alert="openAlertsDialog"
      />
      <i-buy-dialog />
      <i-issues-dialog />
      <i-alerts-dialog />
      <i-verification-dialog />
      <i-edit-dialog
        :is-dialog="openEditDialog"
        help-text="Upload kmz or geojson"
        @close="() => (openEditDialog = false)"
      />
      <user-cables-button />
      <div class="h-fit-content min-height60vh">
        <slot />
      </div>
    </template>
    <i-footer role="contentinfo" class="ml20 hidden-sm-and-down" />
  </div>
</template>

<script>
import INavbar from '@/components/Navbar'
import IFooter from '@/components/Footer'
import { BUY_CAPACITY, EDIT_CABLE } from '../events/sidebar'
import {
  BUY_TYPE,
  TOGGLE_BUY_DIALOG,
  TOGGLE_ALERT_DIALOG,
  TOGGLE_ISSUES_DIALOG
} from '../store/actionTypes'
import { disableAlert } from '../services/api/alerts'
import Sidebar from '../components/Sidebar.vue'
import { checkCookie, setCookie } from '../helpers/cookies'

export default {
  components: {
    IFooter,
    INavbar,
    ISidebar: Sidebar,
    IBuyDialog: () => import('../components/dialogs/BuyDialog'),
    UserCablesButton: () => import('../components/UserCablesButton'),
    IIssuesDialog: () => import('../components/dialogs/IssuesDialog'),
    IAlertsDialog: () => import('../components/dialogs/AlertsDialog'),
    IEditDialog: () => import('../components/dialogs/EditDialog'),
    IVerificationDialog: () =>
      import('../components/dialogs/VerificationDialog')
  },
  data: () => ({
    BUY_CAPACITY,
    EDIT_CABLE,
    openEditDialog: false,
    cc: {
      message:
        'This website uses cookies to improve your experience. Visit our Privacy Policy page for more information about cookies and how we use them.',
      href:
        'https://networkatlas.com/wp-content/uploads/2019/03/privacy-policy.pdf'
    }
  }),
  async mounted() {
    if (
      this.$auth &&
      this.$auth.isAuthenticated &&
      checkCookie('auth0.is.authenticated')
    ) {
      await this.setToken()
    }
  },
  methods: {
    async setToken() {
      const token = await this.$auth.getIdTokenClaims()
      if (token) setCookie('auth.token-session', token.__raw, 20)
    },
    openBuyDialog(option) {
      this.$store.commit(`${BUY_TYPE}`, { title: option })
      return this.$store.commit(`${TOGGLE_BUY_DIALOG}`, true)
    },
    openIssuesDialog() {
      return this.$store.state.map.currentSelection.hasAlert
        ? this.disableCurrentSelectionAlert()
        : this.$store.commit(`${TOGGLE_ISSUES_DIALOG}`, true)
    },
    async disableCurrentSelectionAlert() {
      const { focus } = this.$store.state.map
      return await disableAlert({
        t: focus.type,
        elemnt: focus.id,
        user_id: this.$auth.user.sub
      })
    },
    openAlertsDialog() {
      return this.$store.commit(`${TOGGLE_ALERT_DIALOG}`, true)
    },
    async handleEditCable({ _id, owner, terrestrial }) {
      if (this.$auth && this.$auth.isAuthenticated) {
        let queryType = terrestrial ? 'terrestrial-network' : 'subsea'
        return owner === this.$auth.user.sub
          ? this.$router.push(
              `/user/section/create?id=${queryType}&item=${_id}`
            )
          : (this.openEditDialog = true)
      } else {
        // this.$store.state.isSafariNavigator
        // ?
        // this.$auth.loginWithPopup()
        // :
        this.$auth.loginWithRedirect()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/profile-styles.scss';
</style>
