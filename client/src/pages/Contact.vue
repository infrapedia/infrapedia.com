<template>
  <div class="main-wrapper mb20">
    <el-divider class="m0 mb20" />
    <div class="inner-wrapper">
      <header class="description_title">
        <h1 class="title">
          Contact us
        </h1>
        <p class="text">
          Submit your queries here and we will get back to you as soon as
          possible.
        </p>
      </header>
      <el-card class="form-wrapper p8 round">
        <header class="mb4">
          <h2 class="title md">
            Send us a Message
          </h2>
        </header>
        <el-form
          :rules="formRules"
          ref="contactForm"
          :model="form"
          class="transparent"
        >
          <el-row :gutter="20">
            <el-col :sm="24" :lg="12">
              <el-form-item label="First Name" prop="first_name" required>
                <el-input
                  v-model="form.first_name"
                  autofocus
                  :class="{ dark }"
                />
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
                  placeholder="optional"
                  :class="{ dark }"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="12">
              <el-form-item label="Email" prop="email" required>
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
        <footer>
          <el-divider></el-divider>
          <p class="text">
            If you’re enjoying our blog,
            <el-button
              type="text"
              :class="{ dark }"
              @click="toggleNewsletterDialog"
              class="cursor-pointer fs-medium underline transparent no-border"
              >subscribe</el-button
            >
            to our Newsletter and never miss a thing.
          </p>
        </footer>
      </el-card>
    </div>
    <newsletter-dialog
      :visibility="isNewsLetterDialog"
      @close="toggleNewsletterDialog"
    />
  </div>
</template>

<script>
import { sendContactForm } from '../services/api/contact'
import NewsletterDialog from '../components/dialogs/NewsletterDialog'
import VueRecaptcha from 'vue-recaptcha'
import siteKey from '../config/siteKey'

export default {
  components: {
    VueRecaptcha,
    NewsletterDialog
  },
  data: () => ({
    catchaVerified: null,
    isNewsLetterDialog: false,
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
  head: {
    title: 'Infrapedia | Contact Us | Global Internet Infrastructure Map',
    link: [
      {
        rel: 'canonical',
        href: `${window.origin}/contact`
      }
    ]
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
    toggleNewsletterDialog() {
      this.isNewsLetterDialog = !this.isNewsLetterDialog
    },
    async sendData() {
      await this.$refs.contactForm.validate(async isValid => {
        if (!isValid || !this.catchaVerified) return
        this.isSendingData = true
        const { t } = await sendContactForm(this.form)
        if (t != 'error') {
          this.$refs.contactForm.resetFields()
        }
        this.isSendingData = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/contact-styles.scss';
</style>
