<template>
  <el-container class="vph-full no-overflow">
    <i-navbar role="navigation" :is-user-navbar="true" />

    <el-aside class="pt9 no-overflow">
      <ul role="group" class="pt10 h-fit-full">
        <li
          role="listitem"
          class="h18"
          v-for="(link, i) in profileLinks"
          :key="i"
        >
          <router-link
            exact
            :to="link.url"
            class="inline-flex align-items-center pl8 color-inherit h-fit-full w-fit-full no-outline"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>
    </el-aside>
    <transition name="fade" mode="out-in"><router-view /></transition>

    <i-theme-toggler @click="toggleTheme" />
    <i-footer role="contentinfo" class="ml80 mb3" />
  </el-container>
</template>

<script>
import IThemeToggler from '../components/ThemeToggler'
import { TOGGLE_DARK } from '../store/actionTypes'
import INavbar from '../components/Navbar'
import IFooter from '../components/Footer'
import { bus } from '../helpers/eventBus'
import { TOGGLE_THEME } from '../events'

export default {
  components: {
    IFooter,
    INavbar,
    IThemeToggler
  },
  data: () => ({
    profileLinks: [
      {
        label: 'Account',
        url: '/user'
      },
      {
        label: 'Profile',
        url: '/user/profile'
      },
      {
        label: 'Cables',
        url: '/user/section/cables'
      },
      {
        label: 'Organizations',
        url: '/user/section/orgs'
      },
      {
        label: 'Networks',
        url: '/user/section/networks'
      },
      {
        label: 'CLS',
        url: '/user/section/cls'
      }
    ]
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    toggleTheme() {
      bus.$emit(`${TOGGLE_THEME}`)
      this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
      console.warn('TOGGLING THEME FROM PROFILE LAYOUT!!')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/profile-styles.scss';
</style>
