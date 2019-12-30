<template>
  <div class="flex justify-content-center align-items-center w-full h-fit-full">
    <el-card class="p8">
      <h3 class="subheading">
        <template v-if="isUserBlock">
          Please contact
          <a href="mailto:admin@infrapedia.com">admin@infrapedia.com</a> to
          enable your access
        </template>
        <template v-else>
          <span>Hold on. We're redirecting you</span>
        </template>
      </h3>
    </el-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    isUserBlock: false
  }),
  async mounted() {
    try {
      await this.$auth.loginWithRedirect()
    } catch {
      console.warn(this.$auth)
    }
  },
  created() {
    if (
      this.$route.hash &&
      this.$route.hash.includes('error_description=user%20is%20blocked')
    ) {
      this.isUserBlock = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/pages/login-styles.scss';
</style>
