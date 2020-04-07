<template>
  <el-container class="vph-full no-overflow">
    <i-navbar role="navigation" :is-user-navbar="true" />

    <el-aside class="mt12 oveflow-y-auto no-overflow-x hidden-md-and-down">
      <ul role="group" class="pt10 h-fit-full">
        <template v-for="(link, i) in profileLinks">
          <li role="listitem" class="h18" :key="i">
            <router-link
              exact
              :to="link.url"
              style="width: 90%"
              :id="
                `${link.label
                  .trim()
                  .toLowerCase()
                  .replace(' ', '-')}-link`
              "
              :class="checkURL(link) || isCurrentStep"
              class="inline-flex align-items-center pl8 color-inherit h-fit-full w-fit-full no-outline"
            >
              <fa :icon="link.icon" class="mr2" /> {{ link.label }}
            </router-link>
          </li>
        </template>
      </ul>
    </el-aside>

    <i-message-dialog />
    <i-mobile-profile-drawer
      :visibility.sync="isMobileProfileDrawer"
      @close="handleToggleMobileProfileDrawer"
    />

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>

    <i-footer
      role="contentinfo"
      id="footer-profile"
      class="mb1 ml80 hidden-md-and-down"
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

const TOUR_DONE_KEY = '__is-profile-tour-done'

export default {
  components: {
    INavbar: () => import('../components/Navbar'),
    IFooter: () => import('../components/Footer'),
    IMessageDialog: () => import('../components/dialogs/MessageDialog'),
    IMobileProfileDrawer: () => import('../components/MobileDrawerProfile')
  },
  data() {
    return {
      profileLinks,
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
    }
  },
  mounted() {
    const isTourDoneAlready = window.localStorage.getItem(TOUR_DONE_KEY)
    if (
      !isTourDoneAlready ||
      (isTourDoneAlready && isTourDoneAlready !== 'true')
    ) {
      this.$tours['profile-tour'].start()
    }
    console.log(this.$tours['profile-tour'])

    bus.$on(
      `${navbarEvents.TOGGLE_MOBILE_DRAWER_PROFILE}`,
      this.handleToggleMobileProfileDrawer
    )
  },
  methods: {
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

      if (this.$route.fullPath === '/user/section/issues-reported') {
        obj = {
          'router-link-exact-active router-link-active': link.url.includes(
            'issues'
          )
        }
      } else if (this.$route.fullPath === '/user/profile/email-providers') {
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
