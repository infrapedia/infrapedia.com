<template>
  <div
    class="main-wrapper w-full pt24 p4 flex column no-wrap justify-content-center align-items-center h-full"
  >
    <el-image
      class="mt-62"
      src="https://cdn.infrapedia.com/logos/dark-mode-logo.svg"
      fit="contain"
    />
    <div class="mt24">
      <router-link
        to="/user/profile"
        class="inline-block mb4 underline-hover fs-medium"
      >
        <fa :icon="['fas', 'arrow-left']" /> Back
      </router-link>
      <el-card shadow="never" class="p4 w100 h-fit-contain">
        <h3 slot="header" class="p4 mb4 text-center">
          Change password
        </h3>
        <el-form ref="form">
          <el-form-item>
            <el-input
              show-password
              type="password"
              :class="{ dark }"
              placeholder="New password"
              v-model="passw"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              show-password
              type="password"
              :class="{ dark }"
              placeholder="Confirm new password"
              v-model="passwr"
            />
          </el-form-item>
          <el-collapse-transition>
            <el-alert
              v-if="!isPassEqual"
              :closable="false"
              title="The passwords doesn't match"
              show-icon
              type="danger"
            />
          </el-collapse-transition>
          <el-form-item>
            <el-button
              round
              @click="sendData"
              class="w-fit-full"
              type="primary"
            >
              Change password
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { updateUserData } from '../../services/api/auth'

export default {
  data: () => ({
    passw: '',
    passwr: ''
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    isPassEqual() {
      return this.passw === this.passwr
    }
  },
  beforeCreate() {
    this.$emit('layout', 'nothing-layout')
  },
  methods: {
    async sendData() {
      if (!this.isPassEqual) return
      const res = await updateUserData(
        {
          password: this.passw
        },
        { _id: this.$auth.user.sub },
        true
      ).then(() =>
        this.$notify({
          type: 'success',
          title: 'Success!',
          message: 'Password has been changed successfully!'
        })
      )

      if (res && res.statusCode !== 400) {
        this.passw = ''
        this.passwr = ''
        setTimeout(() => {
          this.$router.push('/user/profile')
        }, 1200)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pages/user/recover-password-styles.scss';
</style>
