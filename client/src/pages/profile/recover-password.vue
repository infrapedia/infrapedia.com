<template>
  <el-container
    direction="vertical"
    class="no-overflow vph-full pt12 p4 flex column align-items-center"
    style="background-color: #333232;"
  >
    <el-image class="block w40" :src="logoUrl" fit="contain" />
    <div class="mt14">
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
  </el-container>
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
    logoUrl() {
      return 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
    },
    isPassEqual() {
      return this.passw == this.passwr
    }
  },
  methods: {
    async sendData() {
      if (!this.isPassEqual) return
      const res = await updateUserData(
        {
          password: this.passw
        },
        { _id: await this.$auth.getUserID() },
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
