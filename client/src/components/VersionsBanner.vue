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
        In case this is your first time here, we have a 1.0 version that you can
        check out
        <a target="_blank" :href="versionOneLink"> {{ versionOneLink }} </a> so
        you can decide which one you prefer. You can set v1.0 as preferred with
        the link below.
        <br />
        <br />
        Go to version 1.0 and set as preferred:
        <span
          @click="setPreferenceCookie"
          class="cursor-pointer underline-hover"
          :href="versionOneLink"
          v-text="versionOneLink"
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
import { setCookie, checkCookie, getCookie } from '../helpers/cookies'

const c_name = '_v-app_inf'

export default {
  name: 'VersionsBanner',
  data: () => ({
    visible: false
  }),
  computed: {
    versionOneLink() {
      return process.env.VUE_APP_VERSION_APP_LINK
    }
  },
  mounted() {
    setTimeout(() => {
      checkCookie(c_name) && getCookie(c_name) === this.versionOneLink
        ? window.location.assign(this.versionOneLink)
        : checkCookie(c_name)
        ? null
        : this.toggleVisibility()
    }, 820)
  },
  methods: {
    toggleVisibility() {
      this.visible = !this.visible
      if (!this.visible) {
        setCookie(
          c_name,
          window.location.origin,
          process.env.VUE_APP_EXP_DAYS_VERSION_DAYS_NOTICE
        )
      }
    },
    setPreferenceCookie() {
      setCookie(
        c_name,
        this.versionOneLink,
        process.env.VUE_APP_EXP_DAYS_VERSION_DAYS_NOTICE
      )

      window.location.assign(this.versionOneLink)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/versions-banner-styles.scss';
</style>
