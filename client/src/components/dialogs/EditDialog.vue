<template>
  <el-dialog
    :visible.sync="isDialog"
    width="40%"
    top="12vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        <span class="capitalize">Edit information</span>
      </h1>
    </header>
    <el-form class="pr2 pl2" ref="form" v-loading="loading">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item label="File">
            <dragger class="mt12" :is-raw-file="true" @raw-file="setFile" />
          </el-form-item>
        </el-col>
        <el-alert
          v-if="fileSelected"
          type="success"
          class="mt4"
          title="File loaded correctly"
          :closable="false"
          show-icon
        />
        <el-col :span="24">
          <el-form-item label="Information">
            <el-input type="textarea" rows="4" v-model="form.information" />
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
          >Send</el-button
        >
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import { editElemnt } from '../../services/api/uploads'
import VueRecaptcha from 'vue-recaptcha'
import siteKey from '../../config/siteKey'

export default {
  components: {
    VueRecaptcha,
    Dragger: () => import('../../components/Dragger')
  },
  data: () => ({
    siteKey,
    loading: false,
    isSendingData: false,
    catchaVerified: null,
    fileSelected: false,
    form: {
      information: '',
      file: ''
    }
  }),
  props: {
    isDialog: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isVisible(bool) {
      if (!bool) return this.$refs.catpcha.reset()
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    isVisible: {
      get() {
        return this.isDialog
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
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  methods: {
    handleCatchaVerification(v) {
      if (!v) return
      else this.catchaVerified = true
    },
    setFile(file) {
      this.fileSelected = false
      this.form.file = file
      this.fileSelected = true
    },
    async submitForm() {
      this.isSendingData = true
      const res = await editElemnt({
        user_id: this.$auth.user.sub,
        ...this.form
      })
      if (res && res.t && res.t !== 'error') this.closeDialog()
      this.isSendingData = false
    },
    closeDialog() {
      this.form = {
        information: '',
        file: ''
      }
      return this.$emit('close')
    }
  }
}
</script>
