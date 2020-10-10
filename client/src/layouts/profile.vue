<template>
  <el-container
    class="vph-full"
    id="profile-layout__main-wraper"
    :class="{
      'no-overflow': isMobileProfileDrawer
    }"
  >
    <i-navbar role="navigation" :is-user-navbar="true" />

    <el-aside
      width="200px"
      class="mt12 no-overflow hidden-md-and-down cubic-transition"
      :class="{ 'adjust-width': $route.path.includes('create') }"
    >
      <ul role="group" class="pt7 h-fit-full">
        <template v-for="(link, i) in links">
          <li role="listitem" class="h10" :key="i" :title="link.label">
            <router-link
              exact
              :to="link.url"
              style="width: 90%;"
              :id="
                `${link.label
                  .trim()
                  .toLowerCase()
                  .replace(' ', '-')}-link`
              "
              :class="checkURL(link)"
              class="inline-flex align-items-center pl5 color-inherit h-fit-full w-fit-full no-outline"
            >
              <fa :icon="link.icon" class="cubic-transition icon" />
              <span
                class="label"
                :class="{
                  'transition-all-delay-520ms': !$route.path.includes('create')
                }"
              >
                {{ link.label }}
              </span>
            </router-link>
          </li>
        </template>
      </ul>
    </el-aside>

    <i-message-dialog />
    <i-mobile-profile-drawer
      class="hidden-md-and-up"
      :visibility.sync="isMobileProfileDrawer"
      @close="handleToggleMobileProfileDrawer"
    />

    <transition
      mode="out-in"
      name="animated super-fast"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
    >
      <router-view />
    </transition>

    <i-footer
      class="profile-footer hidden-md-and-down transition-all"
      :class="{
        'is-create-route': $route.path.includes('create?'),
        'is-create-facility-route': $route.path.includes('create-facility')
      }"
    />
    <v-tour
      name="profile-tour"
      :steps="profileTourSteps"
      :callbacks="tourCallbacks"
      :options="{ highlight: true }"
    >
      <template slot-scope="tour">
        <transition
          name="animated faster3x"
          enter-active-class="fadeIn"
          leave-active-class="fadeOut"
        >
          <template v-for="(step, index) of tour.steps">
            <v-step
              v-if="tour.currentStep === index"
              :key="index"
              :step="step"
              :previous-step="tour.previousStep"
              :next-step="tour.nextStep"
              :stop="tour.stop"
              :is-first="tour.isFirst"
              :is-last="tour.isLast"
              :labels="tour.labels"
              :highlight="true"
            >
              <template v-if="tour.currentStep === profileTourSteps.length - 1">
                <div slot="actions">
                  <button @click="tour.previousStep" class="v-step__button">
                    Previous step
                  </button>
                  <button @click="restartVTour" class="v-step__button">
                    Restart tour
                  </button>
                  <button @click="tour.stop" class="v-step__button">
                    Finish
                  </button>
                </div>
              </template>
            </v-step>
          </template>
        </transition>
      </template>
    </v-tour>
  </el-container>
</template>

<script>
import { TOGGLE_DARK } from '../store/actionTypes'
import profileLinks from '../config/profileLinks'
import profileTourSteps from '../config/profileTourSteps'
import * as navbarEvents from '../events/navbar'
import { bus } from '../helpers/eventBus'
import { setCookie } from '../helpers/cookies'
import { getAccessToken } from '../services/api/auth'

const TOUR_DONE_KEY = '__is-profile-tour-done'

export default {
  components: {
    IFooter: () => import('../components/Footer'),
    INavbar: () => import('../components/navbar/Navbar'),
    IMessageDialog: () => import('../components/dialogs/MessageDialog'),
    IMobileProfileDrawer: () => import('../components/MobileDrawerProfile')
  },
  data() {
    return {
      profileTourSteps,
      isMobileProfileDrawer: false,
      tourCallbacks: {
        onStop: this.handleOnTourStop
      }
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    links() {
      return profileLinks.filter(link =>
        !this.$auth.isUserAnAdmin ? !link.adminOnly : link
      )
    }
  },
  async mounted() {
    this.handleTourStart()
    await this.setToken()
  },
  created() {
    bus.$on(
      `${navbarEvents.TOGGLE_MOBILE_DRAWER_PROFILE}`,
      this.handleToggleMobileProfileDrawer
    )
    document.querySelector('body').className = 'no-overflow'
  },
  beforeDestroy() {
    bus.$off(
      `${navbarEvents.TOGGLE_MOBILE_DRAWER_PROFILE}`,
      this.handleToggleMobileProfileDrawer
    )
  },
  methods: {
    handleTourStart() {
      const isTourDoneAlready = window.localStorage.getItem(TOUR_DONE_KEY)
      if (
        !isTourDoneAlready ||
        (isTourDoneAlready && isTourDoneAlready != 'true')
      ) {
        this.$tours['profile-tour'].start()
      }
    },
    async setToken() {
      if (!this.$auth.isAuthenticated) return
      const token = await getAccessToken()
      if (token) {
        setCookie('auth.token-session', token.access_token, 20)
      }
    },
    handleToggleMobileProfileDrawer() {
      this.isMobileProfileDrawer = !this.isMobileProfileDrawer
    },
    restartVTour() {
      this.$tours['profile-tour'].finish()
      this.$tours['profile-tour'].start()
    },
    handleOnTourStop() {
      return window.localStorage.setItem(TOUR_DONE_KEY, true)
    },
    checkURL(link) {
      let obj = {}

      if (this.$route.fullPath == '/user/section/issues-reported') {
        obj = {
          'router-link-exact-active router-link-active': link.url.includes(
            'issues'
          )
        }
      } else if (this.$route.fullPath == '/user/profile/email-providers') {
        obj = {
          'router-link-exact-active router-link-active': link.url.includes(
            'profile'
          )
        }
      } else if (this.$route.query.id) {
        let pathName = link.url.split('/')
        pathName = pathName[pathName.length - 1]
        obj = {
          'router-link-exact-active router-link-active': pathName.includes(
            this.$route.query.id.toLowerCase()
          )
        }
      }
      return obj
    },
    toggleTheme() {
      return this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/profile-styles.scss';
</style>
