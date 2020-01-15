<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <header class="mb8">
      <h1 class="title-user color-inherit">
        Account
      </h1>
    </header>
    <el-card shadow="never" class="p8" v-loading="loading">
      <div class="flex justify-content-space-between">
        <div>
          <p class="m0 fs-large">
            <strong>
              {{
                userData.user_metadata && userData.user_metadata.name
                  ? user_metadata.namename
                  : userData.name
              }}
            </strong>
          </p>
          <p class="mt6 fs-small">
            {{ userData.company ? userData.company : 'Company: Unknown' }}
          </p>
        </div>
        <router-link
          id="profileBtn"
          to="/user/profile"
          class="inline-block w28 h7 mr1 color-inherit p1 vertical-align round fs-regular"
        >
          See my profile
        </router-link>
      </div>
    </el-card>

    <el-row :gutter="50" class="mt10">
      <el-col :md="24" :lg="10">
        <el-card shadow="never" class="pr8 pl8 h100">
          <header class="header p4">
            <h2 class="title-user-variant m0 color-inherit">
              My activity
            </h2>
          </header>
        </el-card>
      </el-col>
      <el-col :md="24" :lg="14">
        <el-card shadow="never" class="pr8 pl8 h100">
          <header class="header p4">
            <h2 class="title-user-variant m0 color-inherit">
              Map
            </h2>
          </header>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserData } from '../../services/api/auth'

export default {
  name: 'user',
  data: () => ({
    userData: {},
    loading: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  async created() {
    await this.setUserData()
  },
  mounted() {
    if (Object.keys(this.$route.query).length) this.$router.replace('/user')
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Object.keys(vm.$route.query).length) vm.$router.replace('/user')
    })
  },
  methods: {
    async setUserData() {
      if (!this.$auth || !this.$auth.user) return
      this.loading = true
      const userData = await getUserData(this.$auth.user.sub)
      if (userData) {
        const { user_metadata } = userData
        this.userData = {
          name: user_metadata.name ? user_metadata.name : userData.name,
          company: user_metadata.companyname ? user_metadata.companyname : ''
        }
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pages/user/account-styles.scss';
</style>
