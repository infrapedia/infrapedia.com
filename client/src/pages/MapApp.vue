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
import { setCookie } from '../helpers/cookies'
import { getAccessToken } from '../services/api/auth'
import MapOverlay from '../components/mainMap/MapOverlay'
import { getElementIdByType } from '../services/api'
import { PARAMS_SELECTION } from '../events'
import { bus } from '../helpers/eventBus'
import { getMetaDataTagsFromSelectionType } from '../helpers'

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
    IVerificationDialog: () =>
      import('../components/dialogs/VerificationDialog')
  },
  data: () => ({
    EDIT_CABLE,
    BUY_CAPACITY,
    openEditDialog: false,
    metaData: {
      title: 'Infrapedia | Global Internet Infrastructure Map',
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
          // vmid: 'og:site_name',
          name: 'og:site_name',
          content: 'Infrapedia'
        },
        /// IF HUBERT EVER LEAVES INFRAPEDIA THIS SHOULD BE REMOVED
        {
          // vmid: 'og:title',
          name: 'fb:admins',
          content: '100006549764818'
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
    }
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
    handleCurrentMetaTagsUpdate(data) {
      if (!data) {
        this.metaData = {
          title: 'Infrapedia | Global Internet Infrastructure Map',
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
              // vmid: 'og:site_name',
              name: 'og:site_name',
              content: 'Infrapedia'
            },
            /// IF HUBERT EVER LEAVES INFRAPEDIA THIS SHOULD BE REMOVED
            {
              // vmid: 'og:title',
              name: 'fb:admins',
              content: '100006549764818'
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
        }
        this.$router.replace('/app')
      } else {
        this.$once('focus-changed', async function handleFocusChanged(focus) {
          const url = `/app/${focus.type}/${data.slug}`

          this.metaData = {
            ...(await getMetaDataTagsFromSelectionType({
              name: data.name,
              slug: data.slug,
              type: focus.type,
              owners: data.owners,
              url: window.origin + url
            }))
          }
          this.$router.replace(url)
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
