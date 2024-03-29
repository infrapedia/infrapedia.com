<template>
  <transition
    tag="div"
    mode="out-in"
    name="animated faster"
    enter-active-class="slideInLeft"
    leave-active-class="slideOutLeft"
  >
    <div
      v-if="visibility"
      class="el-card is-hover-shadow drawer-wrapper"
      shadow="hover"
      :class="{ dark, light: !dark }"
    >
      <header
        class="h14 w-fit-full pr4 pl4 pb2 flex justify-content-space-between align-items-center"
        :class="{ dark, light: !dark }"
      >
        <router-link to="/">
          <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
        </router-link>
        <el-button
          @click="toggleVisibility"
          type="text"
          circle
          :class="{ dark }"
        >
          <fa :icon="['fas', 'times']" />
        </el-button>
      </header>
      <ul role="group" class="p0 w-fit-full h-fit-full overflow-y-auto mb12">
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
            :class="{ dark, light: !dark, 'hidden-md-and-down': i > 1 }"
          >
            <fa :icon="link.icon" class="mr2" /> {{ link.label }}
          </el-button>
        </li>
      </ul>
      <i-footer class="footer relative m0 pb12" style="width: 80%" />
    </div>
  </transition>
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
        ? 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
        : 'https://cdn1.infrapedia.com/assets/img/light-mode-logo.svg'
    },
    drawerClass() {
      return this.dark ? 'profile-drawer dark' : 'profile-drawer light'
    }
  },
  methods: {
    goToRoute(link) {
      this.toggleVisibility()
      if (this.$route.path !== link) {
        this.$router.push(link)
      }
    },
    toggleVisibility() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/components/mobile-drawer-profile-styles.scss';
</style>
