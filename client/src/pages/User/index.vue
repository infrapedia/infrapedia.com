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
    <el-card shadow="never" class="p8">
      <div class="flex justify-content-space-between">
        <div>
          <p class="m0 fs-large">
            <strong> {{ userName }} </strong>
          </p>
          <p class="mt6 fs-small">{{ userCompany }}</p>
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
      <el-col :span="10">
        <el-card shadow="never" class="pr8 pl8 h100">
          <header class="header p4">
            <h2 class="title-user-variant m0 color-inherit">
              My activity
            </h2>
          </header>
        </el-card>
      </el-col>
      <el-col :span="14">
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
export default {
  name: 'user',
  computed: {
    userName() {
      return 'Jhon Doe'
    },
    userCompany() {
      return 'FARWQA'
    },
    dark() {
      return this.$store.state.isDark
    }
  },
  mounted() {
    if (Object.keys(this.$route.query).length) this.$router.replace('/user')
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Object.keys(vm.$route.query).length) vm.$router.replace('/user')
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pages/user/account-styles.scss';
</style>
