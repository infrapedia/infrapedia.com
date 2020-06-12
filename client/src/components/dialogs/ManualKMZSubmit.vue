<template>
  <el-dialog
    :visible.sync="isVisible"
    :width="dialogWidth"
    top="12vh"
    :before-close="closeDialog"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        <span class="capitalize">Submit Form</span>
      </h1>
      <el-divider class="m1" />
      <p class="p1 text-justify">
        Unfortunately, verifying your KMZ file did not succeed. Help us by
        submitting your file manually through this form. Our engineers will take
        care of it or contact you with any questions.
      </p>
    </header>
    <cables-form
      :mode="'edit'"
      :form="formData"
      :show-title="false"
      :is-manual-kmz-upload="true"
      :is-sending-data="isSendingData"
      @send-data="submitForm"
    />

    <el-form class="pb6 pt6 pr8 pl8 mt-12">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="File" required>
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
          :disabled="isSendButtonDisabled"
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
import siteKey from '../../config/siteKey'
import CablesForm from '../../components/userCreationForms/cables'
import VueRecaptcha from 'vue-recaptcha'
import { getUserData } from '../../services/api/auth'
import { getSelectionTypeNumber } from '../../helpers/getSelectionTypeNumber'

export default {
  components: {
    CablesForm,
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
      required: true
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
    isSendButtonDisabled() {
      let isDisabled = false
      if (
        !this.catchaVerified ||
        this.form.file === '' ||
        this.formData.cls.length <= 0 ||
        this.formData.owners.length <= 0
      ) {
        isDisabled = true
      } else isDisabled = false
      return isDisabled
    },
    dialogWidth() {
      return window.innerWidth < 890 ? '74vw' : '54vw'
    },
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
    async constructInformationString(data) {
      const keys = Object.keys(data)
      const formData = { ...data }
      let final_string = ''
      let values = ''
      let user = {}
      let str = ''

      {
        let { user_metadata, ...userData } = (await getUserData(
          await this.$auth.getUserID()
        )) || {
          user_metadata: { lastname: '', email: '', name: '' },
          userData: { name: '', email: '' }
        }

        user = {
          name:
            user_metadata && user_metadata.name
              ? user_metadata.name
              : userData.name,
          email:
            user_metadata && user_metadata.email
              ? user_metadata.email
              : userData.email,
          lastname:
            user_metadata && user_metadata.lastname
              ? user_metadata.lastname
              : name.split(' ')[1]
              ? name.split(' ')[1]
              : ''
        }
        str = `The user: ${user.name} ${user.lastname} (${user.email}) couln't upload their kmz`
      }

      for (let key of keys) {
        if (key == 'file') continue
        values =
          values +
          `
            <div>
              <p style="font-size: 14px; margin: .8rem 0;">
                ${key}: ${
            !Array.isArray(formData[key])
              ? formData[key]
              : formData[key]
                  .map(function formatItem(item) {
                    if (typeof item == 'string') return item
                    else if (item.name) return item.name
                    else return JSON.stringify(item)
                  })
                  .join()
          }
              </p>
            </div>
          `
      }
      final_string = str + values
      return final_string
    },
    async submitForm() {
      this.isSendingData = true

      const { t } = (await editElemnt({
        information: await this.constructInformationString(this.formData),
        t: getSelectionTypeNumber(this.$route.query.id),
        user_id: await this.$auth.getUserID(),
        element: this.formData._id,
        file: this.form.file
      })) || { t: 'error' }

      if (t != 'error') {
        this.closeDialog()
        this.$router.go(-1)
      }
      this.isSendingData = false
    },
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>
