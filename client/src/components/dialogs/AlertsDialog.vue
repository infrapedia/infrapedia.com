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
        <span class="capitalize">Create Alert</span>
      </h1>
    </header>
    <el-form class="pr2 pl2" ref="form" v-loading="loading">
      <el-row :gutter="15">
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="Email" prop="company">
            <el-input v-model="form.email" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="Phone number">
            <div class="el-input">
              <i-phone-input
                inputClasses="el-input__inner issues-dialog"
                v-model="form.phone.num"
                @onInput="validatePhoneNumber"
                class="m0 p0 el-input__inner"
              />
            </div>
            <el-collapse-transition>
              <el-alert
                type="error"
                class="mt2 h8"
                show-icon
                title="This phone number is not valid"
                :closable="false"
                v-if="form.phone.num && !form.phone.valid"
              />
            </el-collapse-transition>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <vue-recaptcha
            ref="catpcha"
            :sitekey="siteKey"
            :loadRecaptchaScript="true"
            @verify="handleCatchaVerification"
            @error="() => (catchaVerified = false)"
            @expired="() => (catchaVerified = false)"
          />
        </el-col>
      </el-row>
    </el-form>
    <footer class="footer flex wrap justify-content-end pr0 pl6 mt4">
      <div>
        <el-button plain type="info" class="mr2" @click="closeDialog"
          >Cancel</el-button
        >
        <el-button
          :disabled="isFormUncomplete"
          type="primary"
          class="w28"
          plain
          @click="submitForm"
          :loading="isSendingData"
          @keyup.enter.space="submitForm"
          >Create alert</el-button
        >
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getUserData } from '../../services/api/auth'
import { createAlert } from '../../services/api/alerts'
import { TOGGLE_ALERT_DIALOG } from '../../store/actionTypes'
import { getSelectionTypeNumber } from '../../helpers/getSelectionTypeNumber'
import VueRecaptcha from 'vue-recaptcha'
import siteKey from '../../config/siteKey'

export default {
  components: {
    VueRecaptcha
  },
  data: () => ({
    isSendingData: false,
    catchaVerified: null,
    loading: false,
    siteKey,
    form: {
      email: '',
      phone: {
        num: '',
        valid: null
      }
    }
  }),
  computed: {
    ...mapState({
      focus: state => state.map.focus,
      dark: state => state.isDark
    }),
    isVisible: {
      get() {
        return this.$store.state.isAlertDialog
      },
      set() {
        return this.closeDialog()
      }
    },
    isFormUncomplete() {
      const emptyFields = Object.keys(this.form).filter(key => !this.form[key])
      return emptyFields.length || !this.catchaVerified ? true : false
    },
    customDialogClass() {
      return this.dark ? 'alerts-dialog dark' : 'alerts-dialog light'
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
        const { user_metadata } = userData

        this.form.email = user_metadata.email
          ? user_metadata.email
          : userData.email
        this.form.phone = user_metadata.phonenumber
          ? user_metadata.phonenumber
          : {
              num: '',
              valid: null
            }
      }
      this.loading = false
    },
    validatePhoneNumber({ number, isValid }) {
      try {
        this.form.phone = {
          num: number,
          valid: isValid
        }
      } catch {
        // Ignore
      }
    },
    async submitForm() {
      this.isSendingData = true
      const res = await createAlert({
        user_id: this.$auth.user.sub,
        elemnt: this.focus.id,
        t: getSelectionTypeNumber(this.focus.type),
        ...this.form
      })
      if (res && res.t && res.t !== 'error') this.closeDialog()
      this.isSendingData = false
    },
    closeDialog() {
      this.$store.commit(`${TOGGLE_ALERT_DIALOG}`, false)
      this.form = {
        email: '',
        phone: {
          num: '',
          valid: null
        }
      }
    }
  }
}
</script>
