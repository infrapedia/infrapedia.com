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
        <el-card shadow="never" class="pr8 pl8 h100 overflow-y-scroll">
          <header class="header p4">
            <h2 class="title-user-variant m0 color-inherit">
              My activity
            </h2>
          </header>
          <div class="w-fit-full mt2 pb8">
            <el-row :gutter="20" class="pr4 pl6">
              <div v-for="(data, i) in logsData" :key="i">
                <el-col :span="16">
                  <strong
                    ><p class="fs-small truncate">
                      path:
                    </p></strong
                  >
                  <span class="truncate fs-small">
                    {{ data.path }}
                  </span>
                </el-col>
                <el-col :span="8">
                  <small>
                    <p>
                      Register date:
                    </p>
                  </small>
                  <small>
                    <span class="truncate">
                      {{ formatDate(data.rgDate) }}
                    </span>
                  </small>
                </el-col>
              </div>
            </el-row>
          </div>
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
import { usersLogs } from '../../services/api/users'
import { formatDate } from '../../helpers/formatDate'

export default {
  name: 'user',
  data: () => ({
    userData: {},
    loading: false,
    logsData: [],
    formatDate
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  async created() {
    await this.setUserData()
  },
  async mounted() {
    if (Object.keys(this.$route.query).length) this.$router.replace('/user')
    await this.loadLogs()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Object.keys(vm.$route.query).length) vm.$router.replace('/user')
    })
  },
  methods: {
    async loadLogs() {
      const res = await usersLogs({ user_id: this.$auth.user.sub })
      if (res && res.t !== 'err' && res.data && res.data.r) {
        this.logsData = res.data.r
      }
    },
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
