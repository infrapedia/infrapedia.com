<template>
  <el-container direction="vertical">
    <div class="flex justify-content-center align-items-center vph-full">
      <el-card class="p8">
        <div
          class="flex justify-content-center mb4"
          :class="{ animate: !isUserBlock }"
        >
          <el-image
            fit="contain"
            src="https://cdn1.infrapedia.com/assets/img/light-mode-logo-sphere.svg"
          />
        </div>
        <template v-if="isUserBlock">
          <p>
            Please contact
            <a href="mailto:admin@infrapedia.com">admin@infrapedia.com</a> to
            enable your access
          </p>
        </template>
        <template v-else>
          <p class="fs-large">Hold on. We're redirecting you</p>
        </template>
      </el-card>
    </div>
  </el-container>
</template>

<script>
import { deleteCookie } from '../helpers/cookies'

export default {
  data: () => ({
    isUserBlock: false
  }),
  created() {
    if (
      this.$route.hash &&
      this.$route.hash.includes('error_description=user%20is%20blocked')
    ) {
      this.isUserBlock = true
    }
  },
  mounted() {
    try {
      if (!this.$route.query.redirect) {
        setTimeout(() => {
          if (this.$auth.isAuthenticated) {
            this.$router
              .replace('/app')
              .then(() => {})
              // eslint-disable-next-line
              .catch(err => {
                // Ignore
              })
          } else {
            deleteCookie('auth0.is.authenticated')
            // this.$notify({
            //   title: 'Something wrong happened...',
            //   message:
            //     'There has been an error while trying to validate your current session... We will try to set you online again.',
            //   type: 'info'
            // })
            this.$auth.loginWithRedirect()
          }
        }, 3200)
      } else {
        setTimeout(() => {
          this.$auth.loginWithRedirect()
        }, 2000)
      }
    } catch {
      // Ignore
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/pages/login-styles.scss';
</style>
