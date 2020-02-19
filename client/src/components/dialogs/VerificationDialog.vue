<template>
  <el-dialog
    :visible.sync="isVisible"
    width="40%"
    top="12vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        <span class="capitalize">Request to verify ownership</span>
      </h1>
    </header>
    <el-form class="pr2 pl2" v-loading="loading">
      <el-form-item label="Email">
        <el-input type="email" v-model="email" :class="{ dark }" />
      </el-form-item>
      <el-form-item>
        <vue-recaptcha
          ref="catpcha"
          :sitekey="siteKey"
          :loadRecaptchaScript="true"
          @verify="handleCatchaVerification"
          @error="() => (catchaVerified = false)"
          @expired="() => (catchaVerified = false)"
        />
      </el-form-item>
    </el-form>
    <footer class="footer flex wrap justify-content-end pr0 pl6">
      <div>
        <el-button
          :class="{ dark }"
          plain
          type="info"
          class="mr2"
          @click="closeDialog"
          >Cancel</el-button
        >
        <el-button
          :disabled="isFormUncomplete"
          type="primary"
          plain
          :class="{ dark }"
          @click="submitForm"
          :loading="sendingData"
          @keyup.enter.space="submitForm"
          >Send request</el-button
        >
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getUserData } from '../../services/api/auth'
import { verifyElement } from '../../services/api/users'
import { MAP_FOCUS_ON } from '../../store/actionTypes/map'
import { TOGGLE_VERIFICATION_DIALOG } from '../../store/actionTypes'
import { getSelectionTypeNumber } from '../../helpers/getSelectionTypeNumber'
import VueRecaptcha from 'vue-recaptcha'
import siteKey from '../../config/siteKey'

export default {
  components: {
    VueRecaptcha
  },
  data: () => ({
    siteKey,
    email: '',
    loading: false,
    sendingData: false,
    catchaVerified: null
  }),
  computed: {
    ...mapState({
      focus: state => state.map.focus,
      dark: state => state.isDark
    }),
    isVisible: {
      get() {
        return this.$store.state.isVerificationDialog
      },
      set() {
        return this.closeDialog()
      }
    },
    isFormUncomplete() {
      return this.email === '' || !this.catchaVerified ? true : false
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  watch: {
    isVisible(bool) {
      if (!bool) return this.$refs.catpcha.reset()
      this.setUserData()
    }
  },
  methods: {
    handleCatchaVerification(v) {
      if (!v) return
      else this.catchaVerified = true
    },
    async setUserData() {
      if (!this.$auth || !this.$auth.user) return
      this.loading = true
      const userData = await getUserData(this.$auth.user.sub)

      if (userData) {
        this.email = userData.user_metadata.email
          ? userData.user_metadata.email
          : userData.email
      }
      this.loading = false
    },
    async submitForm() {
      this.sendingData = true
      const res = await verifyElement({
        user_id: this.$auth.user.sub,
        email: this.email,
        elemnt: this.focus.id,
        type: getSelectionTypeNumber(this.focus.type)
      })
      this.sendingData = false
      if (res && res.t !== 'error') {
        this.closeDialog()
      }
    },
    closeDialog() {
      this.$store.commit(`${TOGGLE_VERIFICATION_DIALOG}`, false)
      this.$store.commit(`${MAP_FOCUS_ON}`, null)
      this.email = ''
    }
  }
}
</script>
