<template>
  <el-dialog
    :visible.sync="isVisible"
    width="74vw"
    top="12vh"
    :before-close="closeDialog"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        <span class="capitalize">Mannual Submit Form</span>
      </h1>
      <el-divider class="m1" />
      <p class="p1 text-justify">
        Unfortunately, verifying your KMZ file did not succeed. Help us by
        submitting your file manually through this form. Our engineers will take
        care of it or contact you with any questions.
      </p>
    </header>
    <el-form class="pr2 pl2" v-loading="loading">
      <el-row :gutter="15">
        <el-col
          v-for="(field, i) of formFields"
          :key="i"
          :md="24"
          :lg="12"
          :xl="12"
        >
          <el-form-item class="capitalize" :label="field.label + ':'">
            <div class="inline text-left">
              <template v-if="typeof field.value != 'string'">
                <el-tag
                  v-for="(value, indx) in field.value"
                  :closable="false"
                  :key="indx"
                  class="m0 mt1 mr1"
                >
                  {{ value.name ? value.name : value }}
                </el-tag>
              </template>
              <div class="inline text-left" v-else>
                {{ field.value }}
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="File">
            <dragger class="mt12" :is-raw-file="true" @raw-file="setFile" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-alert
            v-if="fileSelected"
            type="success"
            class="mt4"
            title="File loaded correctly"
            :closable="false"
            show-icon
          />
        </el-col>
        <el-col :span="24" class="mt4">
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
          :disabled="!catchaVerified"
          type="primary"
          class="w28"
          plain
          @click="submitForm"
          :loading="isSendingData"
          @keyup.enter.space="submitForm"
        >
          Submit
        </el-button>
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
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    isSendingData: false,
    catchaVerified: null,
    fileSelected: false,
    loading: false,
    form: {
      file: '',
      information: ''
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    siteKey() {
      return siteKey
    },
    formFields() {
      const form = Object.keys(this.formData).map(key => ({
        label: key,
        value: this.formData[key]
      }))
      return form
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  watch: {
    isVisible(bool) {
      if (bool) return
      this.$refs.catpcha.reset()
    }
  },
  methods: {
    setFile(file) {
      this.fileSelected = false
      this.form.file = file
      this.fileSelected = true
    },
    handleCatchaVerification(v) {
      if (!v) return
      else this.catchaVerified = true
    },
    async submitForm() {
      this.isSendingData = true
      const res = await editElemnt({
        user_id: await this.$auth.getUserID(),
        ...this.form
      })
      if (res && res.t && res.t != 'error') this.closeDialog()
      this.isSendingData = false
    },
    closeDialog() {
      this.$emit('close')
      // this.$store.commit(`${TOGGLE_ALERT_DIALOG}`, false)
      // this.form = {
      //   email: '',
      //   phone: {
      //     num: '',
      //     valid: null
      //   }
      // }
    }
  }
}
</script>
