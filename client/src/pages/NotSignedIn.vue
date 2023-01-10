<template>
  <div>
    <INavbar role="navigation"  class="blur" />
    <el-image class="mt12 blur" :src="imgUrl" fit="contain" />
    <i-register-dialog :visible="isRegisterDialogVisible" />
  </div>
</template>

<script>
import IFooter from '../components/Footer'
import INavbar from '../components/navbar/Navbar'
import { getAccessToken } from '../services/api/auth'
import { deleteCookie, checkCookie, setCookie } from '../helpers/cookies'

export default {
  components: {
    IFooter,
    INavbar,
    HMobileMenu: () => import('../components/navbar/MobileMenu'),
    IRegisterDialog: () => import("../components/dialogs/PromoteRegistration"),
  },
  data: () => ({
    isRegisterDialogVisible: false
  }),
  computed: {
    imgUrl() {
      return require('../assets/map_screenshot.png')
    }
  },
  async mounted() {
    document.querySelector('body').className = 'no-overflow'
    await this.checkUserAuthState()
  },
  methods: {
    async checkUserAuthState() {
      await this.$nextTick()
      if (this.$auth.isAuthenticated) {
        await this.setToken()
        this.$router.go()
      } else deleteCookie('auth.token-session')

      if (!this.$auth.isAuthenticated && !checkCookie('auth.token-session')) {
        this.isRegisterDialogVisible = true
      }
    },
    async setToken() {
      const token = await getAccessToken()
      if (token) {
        setCookie('auth.token-session', token.access_token, 20)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.blur {
  filter: blur(4px)
}
@import '../assets/scss/layouts/profile-styles.scss';
</style>
