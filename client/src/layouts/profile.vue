<template>
  <el-container class="vph-full no-overflow">
    <i-navbar role="navigation" :is-user-navbar="true" />

    <el-aside class="pt9 no-overflow">
      <ul role="group" class="pt10 h-fit-full">
        <li role="listitem" class="h18">
          <router-link
            exact
            to="/user"
            class="inline-flex align-items-center pl8 color-inherit h-fit-full w-fit-full no-outline"
          >
            Account
          </router-link>
        </li>
        <li role="listitem" class="h18">
          <router-link
            exact
            to="/user/profile"
            class="inline-flex align-items-center pl8 color-inherit h-fit-full w-fit-full no-outline"
          >
            Profile
          </router-link>
        </li>
      </ul>
    </el-aside>
    <transition name="fade" mode="out-in"><router-view /></transition>

    <i-theme-toggler @click="toggleTheme" />
    <i-footer role="contentinfo" class="ml60 mb3" />
  </el-container>
</template>

<script>
import IThemeToggler from '../components/ThemeToggler'
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
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    toggleTheme() {
      bus.$emit(`${TOGGLE_THEME}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/profile-styles.scss';
</style>
