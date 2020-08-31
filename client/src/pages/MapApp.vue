<template>
  <div>
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
        <map-overlay />
      </div>
    </template>
    <i-footer role="contentinfo" class="ml20 hidden-sm-and-down" />
  </div>
</template>

<script>
import IFooter from '../components/Footer'
import INavbar from '../components/navbar/Navbar'
import { BUY_CAPACITY, EDIT_CABLE } from '../events/sidebar'
import {
  BUY_TYPE,
  IS_DRAWING,
  TOGGLE_BUY_DIALOG,
  TOGGLE_ALERT_DIALOG,
  TOGGLE_ISSUES_DIALOG
} from '../store/actionTypes'
import { disableAlert } from '../services/api/alerts'
import Sidebar from '../components/Sidebar.vue'
import { setCookie } from '../helpers/cookies'
import { getAccessToken } from '../services/api/auth'
import MapOverlay from '../components/mainMap/MapOverlay'

export default {
  components: {
    IFooter,
    INavbar,
    MapOverlay,
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
    openEditDialog: false
  }),
  head: {
    title: 'Infrapedia | Global Internet Infrastructure Map',
    meta: [
      {
        name: 'application-name',
        content: 'Infrapedia | Global Internet Infrastructure Map'
      },
      {
        name: 'keywords',
        content:
          'custom maps, fiber optics maps, internet infrastructure map, live map, consulting, data center, sponsorship, ads, telecommunications'
      },
      {
        name: 'description',
        content:
          'Navigate through the World’s Largest Live Map of the Global Internet Infrastructure. All the data you need for free in a crowd-sourced platform.'
      }
    ]
  },
  created() {
    document.querySelector('body').className = 'no-overflow'
  },
  async mounted() {
    if (this.$auth.isAuthenticated) {
      await this.setToken()
    }
  },
  methods: {
    beforeRouteLeave(to, from, next) {
      if (this.$store.state.isDrawing) {
        this.$store.commit(`${IS_DRAWING}`, false)
      }
      next()
    },
    async setToken() {
      const token = await getAccessToken()
      if (token) {
        setCookie('auth.token-session', token.access_token, 20)
      }
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
        user_id: await this.$auth.getUserID()
      })
    },
    openAlertsDialog() {
      return this.$store.commit(`${TOGGLE_ALERT_DIALOG}`, true)
    },
    async handleEditCable({ _id, owner, terrestrial }) {
      if (this.$auth && this.$auth.isAuthenticated) {
        let queryType = terrestrial ? 'terrestrial-network' : 'subsea'
        return owner == (await this.$auth.getUserID())
          ? this.$router.push(
              `/user/section/create?id=${queryType}&item=${_id}`
            )
          : (this.openEditDialog = true)
      } else {
        this.$auth.loginWithRedirect()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/profile-styles.scss';
</style>
