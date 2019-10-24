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

      <transition name="fade" mode="out-in">
        <router-view />
      </transition>

      <el-button
        class="circle absolute w10 h10 flex align-items-center justify-content-center"
        id="toggleTheme"
        @click.stop="toggleTheme"
      >
        <div class="mt-2">
            <!-- enter-active-class="animated faster slideInUp"
            leave-active-class="animated faster slideInDown" -->
          <transition-group
            name="fade"
            mode="in-out"
            tag="div"
          >
            <span :key="2" class="icon vertical-align align-items-center" v-if="dark">
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
              </svg>
            </span>
            <span :key="1" class="icon vertical-align align-items-center" v-else>
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z" />
              </svg>
            </span>
          </transition-group>
        </div>
      </el-button>

      <i-footer role="contentinfo" class="ml60 mb3" />
    </el-container>
</template>

<script>
import INavbar from '@/components/Navbar'
import IFooter from '@/components/Footer'
import { TOGGLE_DARK } from '../store/actionTypes'

export default {
  components: {
    IFooter,
    INavbar
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    toggleTheme() {
      this.$store.commit(`${TOGGLE_DARK}`, !this.dark)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/profile-styles.scss';
</style>
