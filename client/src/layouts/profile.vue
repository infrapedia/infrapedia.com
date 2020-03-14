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
              :class="checkURL(link)"
              class="inline-flex align-items-center pl8 color-inherit h-fit-full w-fit-full no-outline"
            >
              <fa :icon="link.icon" class="mr2" /> {{ link.label }}
            </router-link>
          </li>
        </template>
      </ul>
    </el-aside>

    <i-message-dialog />

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
    />
  </el-container>
</template>

<script>
import { TOGGLE_DARK } from '../store/actionTypes'
import profileLinks from '../config/profileLinks'
import profileTourSteps from '../config/profileTourSteps'

const TOUR_DONE_KEY = '__is-profile-tour-done'

export default {
  components: {
    INavbar: () => import('../components/Navbar'),
    IFooter: () => import('../components/Footer'),
    IMessageDialog: () => import('../components/dialogs/MessageDialog')
  },
  data() {
    return {
      profileLinks,
      profileTourSteps,
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
  },
  methods: {
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
