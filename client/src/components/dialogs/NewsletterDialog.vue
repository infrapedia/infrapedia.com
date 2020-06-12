<template>
  <el-dialog
    :custom-class="dark ? 'custom-dialog dark' : 'custom-dialog'"
    title="Subscribe to our newsletter!"
    :visible.sync="visibility"
    :before-close="handleClose"
  >
    <el-card class="no-border" shadow="never">
      <el-form :rules="formRules" :model="form" ref="form" class="transparent">
        <el-row :gutter="20">
          <el-col :sm="24" :lg="12">
            <el-form-item label="Name" prop="first_name" required>
              <el-input :class="{ dark }" v-model="form.first_name" />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :lg="12">
            <el-form-item label="Last name" prop="last_name" required>
              <el-input :class="{ dark }" v-model="form.last_name" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Email" prop="email" required>
              <el-input :class="{ dark }" v-model="form.email" />
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
          <el-col :span="24">
            <el-form-item>
              <div class="flex mt4 row justify-content-end">
                <el-button
                  round
                  :disabled="!catchaVerified"
                  :loading="isSendingData"
                  class="w-fit-full"
                  type="primary"
                  @click="sendData"
                >
                  Send
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </el-dialog>
</template>

<script>
import { registerToNewsletter } from '../../services/api/contact'
import VueRecaptcha from 'vue-recaptcha'
import siteKey from '../../config/siteKey'

export default {
  name: 'NewsletterDialog',
  components: {
    VueRecaptcha
  },
  props: {
    visibility: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    isSendingData: false,
    catchaVerified: null,
    form: {
      first_name: '',
      last_name: '',
      email: ''
    }
  }),
  computed: {
    siteKey() {
      return siteKey
    },
    dark() {
      return this.$store.state.isDark
    },
    formRules() {
      return {
        first_name: [
          {
            required: true,
            message: 'Please input your first name',
            trigger: ['change', 'blur']
          }
        ],
        last_name: [
          {
            required: true,
            message: 'Please input your last name',
            trigger: ['change', 'blur']
          }
        ],
        email: [
          {
            type: 'email',
            message: 'Please input a valid email address',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    handleCatchaVerification(v) {
      if (!v) return
      else this.catchaVerified = true
    },
    async sendData() {
      await this.$refs.form.validate(async isValid => {
        if (!isValid || !this.catchaVerified) return

        this.isSendingData = true
        const { t } = await registerToNewsletter(this.form)
        if (t != 'error') {
          this.clearForm()
          this.handleClose()
        }
        this.isSendingData = false
      })
    },
    clearForm() {
      this.$refs.form.resetFields()
    },
    handleClose() {
      this.clearForm()
      this.$emit('close')
    }
  }
}
</script>
