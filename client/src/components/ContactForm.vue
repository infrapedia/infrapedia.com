<template>
  <div class="form-wrapper">
    <el-form
      :rules="formRules"
      ref="contactForm"
      :model="form"
      class="transparent"
    >
      <el-row :gutter="15">
        <el-col :sm="24" :lg="12">
          <el-form-item label="First Name" prop="first_name" required>
            <el-input v-model="form.first_name" autofocus :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :lg="12">
          <el-form-item label="Last name" prop="last_name" required>
            <el-input v-model="form.last_name" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :lg="12">
          <el-form-item label="Company" prop="company">
            <el-input
              v-model="form.company"
              placeholder="Optional"
              :class="{ dark }"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :lg="12">
          <el-form-item label="Email" prop="email" type="email" required>
            <el-input v-model="form.email" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :lg="24">
          <el-form-item label="Subject" prop="subject" required>
            <el-input v-model="form.subject" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Message" prop="message" required>
            <el-input
              type="textarea"
              :rows="4"
              v-model="form.message"
              :class="{ dark }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="overflow-hidden">
            <vue-recaptcha
              ref="catpcha"
              :sitekey="siteKey"
              :loadRecaptchaScript="true"
              @verify="handleCatchaVerification"
              @error="() => (catchaVerified = false)"
              @expired="() => (catchaVerified = false)"
            />
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <div class="flex mt4 row justify-content-end">
              <el-button
                round
                :loading="isSendingData"
                class="w-fit-full"
                type="primary"
                @click="sendData"
                :disabled="!catchaVerified"
              >
                Send
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import VueRecaptcha from 'vue-recaptcha'
import siteKey from '../config/siteKey'
// import { sendContactForm } from '../services/api/contact'

export default {
  name: 'ContactForm',
  components: {
    VueRecaptcha
  },
  props: ['handleSubmit'],
  data: () => ({
    catchaVerified: null,
    isSendingData: false,
    form: {
      email: '',
      subject: '',
      first_name: '',
      last_name: '',
      company: '',
      message: ''
    }
  }),
  created: function() {
    this.fillForm()
  },
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
        ],
        subject: [
          {
            required: true,
            message: 'A subject is required',
            trigger: ['blur', 'change']
          }
        ],
        message: [
          {
            required: true,
            message: 'A message is required',
            trigger: ['change', 'blur']
          },
          {
            min: 15,
            message: 'Length should be at least 15',
            trigger: 'blur'
          }
        ],
        company: []
      }
    }
  },
  methods: {
    handleCatchaVerification(v) {
      if (!v) return
      else this.catchaVerified = true
    },
    async sendData() {
      await this.$refs.contactForm.validate(async isValid => {
        if (!isValid || !this.catchaVerified) return
        this.isSendingData = true
        await this.handleSubmit(this.form)
        this.$refs.contactForm.resetFields()
        if (this.$refs.captcha) {
          this.$refs.captcha.reset()
        }
        this.isSendingData = false
      })
    },
    fillForm() {
      if (this.$auth.user) {
        this.form.first_name = this.$auth.user.given_name
        this.form.last_name = this.$auth.user.family_name
        this.form.email = this.$auth.user.email
      } else {
        this.form.first_name = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './../assets/scss/components/contact-dialog-styles.scss';
</style>
