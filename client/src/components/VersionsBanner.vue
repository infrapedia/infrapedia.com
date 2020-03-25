<template>
  <transition
    mode="out-in"
    name="animated faster"
    enter-active-class="fadeInDown"
    leave-active-class="fadeOutUp"
  >
    <div
      v-if="visible"
      class="banner-wrapper flex row wrap align-items-center justify-content-center w-fit-full p8 absolute seamless-shadow text-center"
    >
      <p class="p0 m0 font-medium fs-medium">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
        ipsum dicta, iusto ab facilis hic tempora fugit, eligendi maxime cum est
        commodi odio. Nisi aliquid esse, iste laborum id dolores!.
        <br />
        <br />
        Go to version 1.0 and set as preferred:
        <span
          @click="setPreferenceCookie"
          class="cursor-pointer underline-hover"
          :href="versionTwoLink"
          v-text="versionTwoLink"
        />
      </p>
      <el-button
        class="ml4 mt-12"
        icon="el-icon-close"
        @click="toggleVisibility"
      />
    </div>
  </transition>
</template>

<script>
import {
  setCookie
  // checkCookie
} from '../helpers/cookies'

const c_name = '_v-app_inf'

export default {
  name: 'VersionsBanner',
  data: () => ({
    visible: false
  }),
  computed: {
    versionTwoLink() {
      return process.env.VUE_APP_VERSION_APP_LINK
    }
  },
  mounted() {
    // setTimeout(() => {
    //   checkCookie(c_name)
    //     ? window.location.assign(this.versionTwoLink)
    //     : this.toggleVisibility()
    // }, 820)
  },
  methods: {
    toggleVisibility() {
      this.visible = !this.visible
    },
    setPreferenceCookie() {
      setCookie(
        c_name,
        `Prefers: ${this.versionTwoLink}`,
        process.env.VUE_APP_EXP_DAYS_VERSION_DAYS_NOTICE
      )

      window.location.assign(this.versionTwoLink)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/versions-banner-styles.scss';
</style>
