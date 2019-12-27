<template>
  <div
    class="main-wrapper w-full pt24 p4 flex column no-wrap align-items-center h-full"
  >
    <el-image
      class="mt12"
      src="https://cdn.infrapedia.com/logos/dark-mode-logo.svg"
      fit="contain"
    />
    <el-card shadow="never" class="p4 w120 mt24">
      <h3 slot="header" class="p2 text-center">
        Change password
      </h3>
      <el-form ref="form">
        <el-form-item>
          <el-input
            show-password
            type="password"
            placeholder="New password"
            v-model="passw"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            show-password
            type="password"
            placeholder="Confirm new password"
            v-model="passwr"
          />
        </el-form-item>
        <el-form-item>
          <el-button round @click="sendData" class="w-fit-full">
            Change password
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    passw: '',
    passwr: ''
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pages/user/recover-password-styles.scss';
</style>
