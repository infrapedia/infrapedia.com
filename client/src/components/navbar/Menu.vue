<template>
  <el-popover
    :visible-arrow="false"
    placement="bottom-end"
    width="220"
    v-click-outside="closeMenu"
    transition="el-zoom-in-top"
    trigger="manual"
    v-model="isVisible"
  >
    <header
      class="header h8 flex justify-content-space-between pr7 pl6 pt2 pb2 align-items-center"
      :class="{ dark, light: !dark }"
    >
      <strong class="fs-regular truncate">{{ userName }}</strong>
      <span class="fs-regular cursor-pointer" @click="toggleVisibility(false)">
        <fa :icon="['fas', 'times']" />
      </span>
    </header>
    <ul class="p1 h-fit" :class="{ dark, light: !dark }">
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
          @click="logOutUser"
        >
          <strong>Sign out</strong>
          <!-- <fa :icon="['fas', 'sign-out-alt']" class="ml4" /> -->
        </el-button>
      </li>
    </ul>
    <div
      slot="reference"
      class="no-outline circle icon-wrapper"
      tabindex="0"
      @click="toggleVisibility(!isVisible)"
      @keyup.enter.space="toggleVisibility(!isVisible)"
    >
      <el-avatar v-if="userImage" size="small" :src="$auth.user.picture" />
      <fa v-else :icon="['fas', 'user-circle']" class="md-icon user-icon" />
    </div>
  </el-popover>
</template>

<script>
import { TOGGLE_DARK } from '../../store/actionTypes'
import { deleteCookie } from '../../helpers/cookies'
import infoMenuLinks from '../../config/infoMenuLinks'
import { bus } from '../../helpers/eventBus'
import { TOGGLE_THEME } from '../../events'
import ClickOutside from 'vue-click-outside'

export default {
  data: () => ({
    isVisible: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    infoMenuLinks() {
      return infoMenuLinks
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
    logOutUser() {
      deleteCookie('auth.token-session')
      this.$auth.logout()
    }
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/menu-navbar-styles.scss';
</style>
