<template>
  <transition
    tag="div"
    mode="in-out"
    name="animated faster"
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
  >
    <el-card
      v-if="isVisible"
      shadow="hover"
      :class="{ dark, light: !dark }"
      class="drawer-wrapper overflow-y vph-full absolute w-fit-full"
      style="top: 0; left: 0; z-index: 2000000000000000"
    >
      <header class="header" :class="{ dark, light: !dark }">
        <div class="flex column align-items-center justify-content-center pt6">
          <router-link to="/app" class="h10 w24">
            <el-image :src="imageURL" fit="scale-down" lazy />
          </router-link>
          <el-divider class="m0 mb2" />
        </div>
        <div
          class="flex justify-content-space-between pr7 pl6 pt2 pb4 align-items-center"
        >
          <strong class="fs-regular truncate">{{ userName }}</strong>
          <span
            class="fs-regular cursor-pointer"
            @click="toggleVisibility(false)"
          >
            <fa :icon="['fas', 'times']" />
          </span>
        </div>
      </header>
      <ul class="p1 h-fit" :class="{ dark, light: !dark }">
        <template v-if="isUserAuthenticated">
          <li class="w-fit-full">
            <el-button
              type="text"
              class="inline-block color-inherit w-fit-full p0"
              @click="toggleVisibility(false)"
            >
              <router-link
                :to="currentRoute.to"
                class="color-inherit pl4 pr4 inline-block underline-hover h8 flex align-items-center"
              >
                {{ currentRoute.label }}
              </router-link>
            </el-button>
          </li>
          <li class="w-fit-full" v-if="currentRoute.to != '/app'">
            <router-link
              to="/user/profile"
              class="el-button h10 pl4 pr4 el-button--text color-inherit w-fit-full text-left inline-block underline-hover"
            >
              Profile
            </router-link>
          </li>
        </template>
        <li class="w-fit-full h10">
          <el-button
            type="text"
            class="inline-block capitalize w-fit-full text-left pl4 pr4 color-inherit"
            @click="toggleDarkMode"
          >
            <span class="mode-label dark" :class="{ active: dark }">
              Dark Mode
            </span>
            /
            <span class="mode-label light" :class="{ active: !dark }"
              >Light Mode
            </span>
          </el-button>
        </li>
        <el-divider class="mt2 mb2" />
        <div class="list-wrapper flex column">
          <li
            v-for="(link, i) in infoMenuLinks.info"
            :key="i"
            :data-index-link="link.menu.order"
            class="w-fit-full h10"
          >
            <router-link
              v-if="link.router"
              :to="link.url"
              v-text="link.label"
              class="el-button pl4 pr4 el-button--text inline-block w-inherit color-inherit underline-hover text-left pl4 pr4"
            />
            <a
              v-else
              :href="link.url"
              v-text="link.label"
              rel="noopener"
              class="el-button pl4 pr4 el-button--text inline-block w-inherit color-inherit underline-hover text-left pl4 pr4"
            />
          </li>
        </div>
        <el-divider class="mt2 mb2" />
        <ul
          class="flex justify-content-space-around pt2 p2"
          :class="{ dark, light: !dark }"
        >
          <li
            v-for="(link, i) in infoMenuLinks.social"
            :key="i"
            class="seamless-hoverw4 h4 p2 vertical-align circle"
          >
            <a
              :href="link.url"
              target="_blank"
              rel="noopener"
              class="color-inherit"
            >
              <fa :icon="link.icon" class="sm-icon" />
            </a>
          </li>
        </ul>
        <el-divider class="mt2 mb2" />
        <li class="w-fit-full h10">
          <el-button
            type="text"
            class="inline-block w-fit-full text-left pl4 pr4 color-inherit"
            @click="handleActionButton"
          >
            <strong>{{ isUserAuthenticated ? 'Sign out' : 'Login' }}</strong>
            <!-- <fa :icon="['fas', 'sign-out-alt']" class="ml4" /> -->
          </el-button>
        </li>
      </ul>
    </el-card>
  </transition>
</template>

<script>
import { TOGGLE_DARK } from '../../store/actionTypes'
import { deleteCookie } from '../../helpers/cookies'
import infoMenuLinks from '../../config/infoMenuLinks'
import { bus } from '../../helpers/eventBus'
import { TOGGLE_THEME } from '../../events'
import ClickOutside from 'vue-click-outside'
import * as events from '../../events/navbar'

export default {
  data: () => ({
    isVisible: false
  }),
  created() {
    bus.$on(`${events.TOGGLE_MOBILE_MENU}`, this.tapFromNavbar)
  },
  beforeDestroy() {
    bus.$off(`${events.TOGGLE_MOBILE_MENU}`, this.tapFromNavbar)
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    infoMenuLinks() {
      return infoMenuLinks
    },
    isUserAuthenticated() {
      return this.$auth.isAuthenticated
    },
    imageURL() {
      return 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
    },
    userName() {
      return this.$auth.user ? this.$auth.user.name : ''
    },
    currentRoute() {
      return this.$route.path.includes('/user')
        ? {
            label: 'Back to map',
            to: '/app'
          }
        : {
            label: 'Dashboard',
            to: '/user'
          }
    },
    userImage() {
      return this.$auth.user && this.$auth.user.picture
    },
    popoverClassGiver() {
      let c = 'popover'
      if (this.dark) c += ' dark'
      else c += ' light'
      return c
    }
  },
  methods: {
    tapFromNavbar() {
      this.toggleVisibility(!this.isVisible)
    },
    closeMenu() {
      this.toggleVisibility(false)
    },
    toggleVisibility(bool) {
      this.isVisible = bool
    },
    toggleDarkMode() {
      if (this.currentRoute.to == '/app') {
        this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
      } else {
        bus.$emit(`${TOGGLE_THEME}`)
      }
    },
    handleActionButton() {
      if (this.isUserAuthenticated) {
        deleteCookie('auth.token-session')
        this.$auth.logout()
      } else {
        this.$auth.loginWithRedirect()
      }
    }
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/menu-navbar-styles.scss';
.drawer-wrapper {
  z-index: 2000;
}
.el-card {
  border-radius: 0;
}
.el-card.dark {
  background-color: $light-charcoal;
  border-color: $light-charcoal;
}
.el-card.light {
  background-color: $white-full;
  border: none !important;
}
</style>
