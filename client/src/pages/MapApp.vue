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
      <i-register-dialog
        :visible="isRegisterDialogVisible"
        @close="closeRegisterDialog"
      />
      <user-cables-button />
      <h-mobile-menu class="hidden-md-and-up" />
      <market-place :is-mobile="true" />
      <div class="h-fit-content min-height60vh">
        <map-overlay @map-loaded="checkUserAuthState" />
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
import { setCookie } from '../helpers/cookies'
import { getAccessToken } from '../services/api/auth'
import MapOverlay from '../components/mainMap/MapOverlay'
import { getElementIdByType } from '../services/api'
import { PARAMS_SELECTION } from '../events'
import { bus } from '../helpers/eventBus'
import { getMetaDataTagsFromSelectionType } from '../helpers'
import metadata from '../config/map_metadata.json'

export default {
  components: {
    IFooter,
    INavbar,
    MapOverlay,
    ISidebar: () => import('../components/Sidebar.vue'),
    IBuyDialog: () => import('../components/dialogs/BuyDialog'),
    UserCablesButton: () => import('../components/UserCablesButton'),
    IIssuesDialog: () => import('../components/dialogs/IssuesDialog'),
    IAlertsDialog: () => import('../components/dialogs/AlertsDialog'),
    IEditDialog: () => import('../components/dialogs/EditDialog'),
    IRegisterDialog: () => import('../components/dialogs/PromoteRegistration'),
    IVerificationDialog: () =>
      import('../components/dialogs/VerificationDialog'),
    HMobileMenu: () => import('../components/navbar/MobileMenu'),
    MarketPlace: () => import('../components/navbar/MartketPlace')
  },
  data: () => ({
    EDIT_CABLE,
    BUY_CAPACITY,
    metaData: {
      title: metadata.title,
      meta: metadata.meta,
      link: [
        {
          rel: 'canonical',
          href: `${
            window.origin.includes('www')
              ? window.origin
              : 'https://www.infrapedia.com'
          }/`
        }
      ]
    },
    openEditDialog: false,
    isRegisterDialogVisible: false
  }),
  computed: {
    focus() {
      return this.$store.state.map.focus
    }
  },
  head() {
    return this.metaData
  },
  async created() {
    document.querySelector('body').className = 'no-overflow'

    const { params } = this.$route
    if (params.type && params.slug) {
      const res = await getElementIdByType({
        type: params.type,
        slug: params.slug
      })
      if (res && res.data && res.data.r) {
        bus.$emit(`${PARAMS_SELECTION}`, {
          option: params.type,
          id: res.data.r
        })
      }
    }
  },
  async mounted() {
    if (this.$auth.isAuthenticated) {
      await this.setToken()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.isDrawing) {
      this.$store.commit(`${IS_DRAWING}`, false)
    }
    next()
  },
  watch: {
    '$store.state.map.currentSelection'(data) {
      this.handleCurrentMetaTagsUpdate(data)
    },
    '$store.state.isSidebar'(bool) {
      if (!bool) {
        this.handleCurrentMetaTagsUpdate(bool)
      }
    },
    focus(f) {
      this.$emit('focus-changed', f)
    }
  },
  methods: {
    closeRegisterDialog() {
      this.isRegisterDialogVisible = false
    },
    checkUserAuthState() {
      setTimeout(() => {
        if (!this.$auth.isAuthenticated) {
          this.isRegisterDialogVisible = true
        }
      }, 12000)
    },
    handleCurrentMetaTagsUpdate(data) {
      if (!data) {
        this.metaData = metadata
        if (Object.keys(this.$route.params).length > 0) {
          this.$router.replace('/')
        }
      } else {
        this.$once('focus-changed', async function handleFocusChanged(focus) {
          if (!focus) {
            this.metaData = {
              title: metadata.title,
              meta: metadata.meta,
              link: [
                {
                  rel: 'canonical',
                  href: `${
                    window.origin.includes('www')
                      ? window.origin
                      : 'https://www.infrapedia.com'
                  }/`
                }
              ]
            }
            return
          }
          const url = `/${focus.type}/${data.slug}`

          this.metaData = {
            ...(await getMetaDataTagsFromSelectionType({
              name: data.name,
              slug: data.slug,
              type: focus.type,
              owners: data.owners ? data.owners : [],
              url:
                `${
                  window.origin.includes('www')
                    ? window.origin
                    : 'https://www.infrapedia.com'
                }` + url
            }))
          }

          if (this.$route.fullPath !== url) {
            this.$router.replace(url)
          }
        })
      }
    },
    async setToken() {
      const token = await getAccessToken()
      if (token) {
        setCookie('auth.token-session', token.access_token, 20)
      }
    },
    openBuyDialog(option) {
      this.$store.commit(`${BUY_TYPE}`, { title: option })
      this.$store.commit(`${TOGGLE_BUY_DIALOG}`, true)
    },
    openIssuesDialog() {
      this.$store.state.map.currentSelection.hasAlert
        ? this.disableCurrentSelectionAlert()
        : this.$store.commit(`${TOGGLE_ISSUES_DIALOG}`, true)
    },
    async disableCurrentSelectionAlert() {
      const { focus } = this.$store.state.map
      await disableAlert({
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
        owner == (await this.$auth.getUserID())
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
