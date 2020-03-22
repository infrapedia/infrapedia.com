<template>
  <div class="drawer-wrapper" :class="{ dark, light: !dark }">
    <!-- <el-button
      circle
      icon="el-icon-menu"
      class="no-border color-inherit w8 vertical-align mt1"
      @click="toggleVisibility"
      :class="{ dark, light: !dark }"
    /> -->
    <el-drawer
      size="100%"
      :visible.sync="visibility"
      direction="ltr"
      :before-close="toggleVisibility"
      :custom-class="drawerClass"
      :append-to-body="true"
    >
      <div>
        <header
          class="h14 pr4 pl4 pb2 flex justify-content-space-between align-items-center"
          :class="{ dark, light: !dark }"
        >
          <router-link to="/">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
          <span
            class="inline-block w4 h4 icon mt2 fs-medium p2 transition-all circle vertical-align cursor-pointer"
            :class="{ dark, light: !dark }"
            @click="toggleVisibility"
          >
            <fa :icon="['fas', 'times']" />
          </span>
        </header>
        <ul role="group" class="p0 h-fit-full">
          <li
            role="listitem"
            class="h18"
            v-for="(link, i) in profileLinks"
            :key="i"
          >
            <el-button
              plain
              type="text"
              class="inline-flex no-border-radius align-items-center pl8 color-inherit h-fit-full w-fit-full no-outline"
              @click="goToRoute(link.url)"
              :class="{ dark, light: !dark }"
            >
              <fa :icon="link.icon" class="mr2" /> {{ link.label }}
            </el-button>
          </li>
        </ul>
        <i-footer class="footer relative m0" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import profileLinks from '../config/profileLinks'

export default {
  components: {
    IFooter: () => import('./Footer')
  },
  data: () => ({
    profileLinks
  }),
  props: {
    visibility: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    imageURL() {
      return this.dark
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    },
    drawerClass() {
      return this.dark ? 'profile-drawer dark' : 'profile-drawer light'
    }
  },
  methods: {
    goToRoute(link) {
      this.toggleVisibility()
      if (this.$route.path !== link) {
        return this.$router.push(link)
      }
    },
    toggleVisibility() {
      return this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/components/mobile-drawer-profile-styles.scss';
</style>
