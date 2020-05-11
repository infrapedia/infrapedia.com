<template>
  <div
    class="main-wrapper overflow-y-auto w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <header class="mb8 flex row nowrap justify-content-space-between">
      <h1 class="title-user color-inherit">
        <router-link to="/user/profile">
          <fa :icon="['fas', 'arrow-left']" class="fs-regular mr2 mb1" />
        </router-link>
        Email providers
      </h1>

      <el-tag
        size="medium"
        class="cursor-pointer"
        @click="toggleProviderInfoDialog(true)"
      >
        Current email provider:
        <span class="capitalize"> {{ currentEmailProvider }} </span>
      </el-tag>
    </header>
    <div class="flex row wrap w-fit-full">
      <div
        v-for="(provider, i) in emailProviders.providers"
        :key="i"
        class="w40 h40 box transition-all mr4 flex justify-content-center p4"
        :class="{ selected: provider.value === emailProviders.selected }"
        @click="changeProviderSelected(provider.value)"
      >
        <el-image :src="provider.img" lazy fit="contain" />
      </div>
    </div>
    <el-divider :class="{ dark }" />
    <el-card class="mt4 transition-all p4" v-loading="loading">
      <el-form :model="form" :rules="formRules" ref="form">
        <el-form-item prop="email" label="From email">
          <el-input
            v-model="form.email"
            :class="{ dark }"
            placeholder="From email"
          />
        </el-form-item>
        <el-collapse-transition>
          <el-form-item
            :prop="APIkeyProp"
            label="API key"
            v-if="emailProviderSelected !== 'smtp'"
          >
            <el-input
              type="password"
              v-model="form.apiKey"
              :class="{ dark }"
              :placeholder="placeholderApiKey"
            />
            <small>Your {{ placeholderApiKey }}</small>
          </el-form-item>
        </el-collapse-transition>
        <el-collapse-transition>
          <template v-if="this.emailProviderSelected === 'mailgun'">
            <div>
              <el-form-item prop="domain" label="Domain">
                <el-input
                  v-model="form.domain"
                  :class="{ dark }"
                  placeholder="Domain"
                />
                <small>Your domain registered with Mailgun</small>
              </el-form-item>
              <el-form-item label="Region">
                <el-radio-group v-model="form.region">
                  <el-radio label="us">Mailgun US</el-radio>
                  <el-radio label="eu">Mailgun EU</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </template>
        </el-collapse-transition>
        <el-collapse-transition>
          <template v-if="emailProviderSelected === 'smtp'">
            <div>
              <el-form-item prop="host" label="Host">
                <el-input
                  :class="{ dark }"
                  v-model="form.host"
                  placeholder="your.smtp.host.com"
                />
                <small>Hostname or IP address of your SMTP server.</small>
              </el-form-item>
              <el-form-item prop="port" label="Port">
                <el-input-number
                  v-model="form.port"
                  :class="{ dark }"
                  placeholder="482"
                />
                <br />
                <small
                  >Port used by your SMTP server. Common ports include 25, 465,
                  and 587. Please avoid using port 25 if you can, since many
                  providers have limitations on this port.</small
                >
              </el-form-item>
              <el-form-item prop="username" label="Username">
                <el-input
                  v-model="form.username"
                  :class="{ dark }"
                  placeholder="SMTP Username"
                />
              </el-form-item>
              <el-form-item prop="password" label="Password">
                <el-input
                  type="password"
                  v-model="form.password"
                  :class="{ dark }"
                  placeholder="SMTP Password"
                />
              </el-form-item>
            </div>
          </template>
        </el-collapse-transition>
        <el-form-item>
          <div class="flex justify-content-end">
            <el-button @click="clear" class="mr4" plain>
              Cancel
            </el-button>
            <el-button type="warning" @click="save">
              Save
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      :visible.sync="providerInfoDialog.isVisible"
      width="30%"
      title="Email provider information"
      :before-close="() => toggleProviderInfoDialog(false)"
    >
      <el-form>
        <el-form-item label="From">
          <el-input
            type="password"
            show-password
            v-model="providerInfoDialog.data.from"
          />
        </el-form-item>
        <el-form-item label="apiKey">
          <el-input
            type="password"
            show-password
            v-model="providerInfoDialog.data.apiKey"
          />
        </el-form-item>
        <el-form-item>
          <div class="flex justify-content-end">
            <el-button plain @click="toggleProviderInfoDialog(false)">
              Close
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  configProviders,
  activeEmailProvider
} from '../../services/api/alerts.js'
import { providers } from '../../config/emailProviders'

export default {
  data() {
    let vm = this
    return {
      loading: false,
      providerInfoDialog: {
        isVisible: false,
        data: {}
      },
      currentEmailProvider: 'None',
      emailProviders: {
        providers,
        selected: 'mandrill'
      },
      form: {
        email: '',
        apiKey: '',
        domain: '',
        region: 'us',
        port: '',
        host: '',
        password: ''
      },
      formRules: {
        email: [
          {
            required: true,
            message: 'Please input your email',
            trigger: 'blur',
            type: 'email'
          },
          {
            message: 'Please input a valid email',
            trigger: 'change',
            type: 'email'
          }
        ],
        apiKeyM: [
          {
            required: true,
            message: 'Please input your Mandrill API key',
            trigger: 'blur',
            validator: () => {
              const { apiKey } = vm.form
              if (apiKey === '') {
                return new Error('This field cannot be empty')
              }
            }
          }
        ],
        apiKeyMG: [
          {
            required: true,
            message: 'Please input your Mailgun API key',
            trigger: 'blur',
            validator: () => {
              const { apiKey } = vm.form
              if (apiKey === '') {
                return new Error('This field cannot be empty')
              }
            }
          }
        ],
        apiKeySG: [
          {
            required: true,
            message: 'Please input your SendGrip API key',
            trigger: 'blur',
            validator: () => {
              const { apiKey } = vm.form
              if (apiKey === '') {
                return new Error('This field cannot be empty')
              }
            }
          }
        ],
        domain: [
          {
            required: true,
            message: 'Please input your domain registered with Mailgun',
            trigger: 'blur'
          }
        ],
        host: [
          {
            required: true,
            message: 'Please input your smtp host',
            trigger: 'blur'
          }
        ],
        port: [
          {
            required: true,
            message: 'Please input your smtp port',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: 'Please input your username',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please input your password',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  beforeCreate() {
    this.$emit('layout', 'profile-layout')
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    isSMTP() {
      return this.emailProviderSelected === 'smtp'
    },
    emailProviderSelected() {
      return this.emailProviders.selected
    },
    placeholderApiKey() {
      let placeholder = 'Mandrill API key'

      if (this.emailProviderSelected === 'mandrill') {
        placeholder = 'Mandrill API key'
      } else if (this.emailProviderSelected === 'mailgun') {
        placeholder = 'Mailgun API key'
      } else if (this.emailProviderSelected === 'sendgrid') {
        placeholder = 'Sendgrid API Key'
      }

      return placeholder
    },
    APIkeyProp() {
      let prop = 'apiKeyM'
      if (this.emailProviderSelected === 'mandrill') {
        prop = 'apiKeyM'
      } else if (this.emailProviderSelected === 'mailgun') {
        prop = 'apiKeyMG'
      } else if (this.emailProviderSelected === 'sendgrid') {
        prop = 'apiKeySG'
      }
      return prop
    }
  },
  mounted() {
    this.getCurrentEmailProvider()
  },
  methods: {
    toggleProviderInfoDialog(bool) {
      this.providerInfoDialog.isVisible = bool
    },
    async getCurrentEmailProvider() {
      this.currentEmailProvider = 'Loading ...'
      const res = await activeEmailProvider({
        user_id: await this.$auth.getUserID()
      })
      if (res && res.data && res.data.r) {
        if (res.data.r.length) {
          this.currentEmailProvider = res.data.r[0].provider
          this.providerInfoDialog.data = {
            from: res.data.r[0].options.from,
            apiKey: res.data.r[0].options.apiKey
          }
        } else this.currentEmailProvider = 'None'
      }
    },
    changeProviderSelected(p) {
      this.form.apiKey = ''
      this.emailProviders.selected = p
    },
    async save() {
      this.loading = true
      const res = await configProviders({
        user_id: await this.$auth.getUserID(),
        ...this.form,
        provider: this.emailProviderSelected
      })
      if (res && res.data && res.data.t !== 'error') {
        this.clear()
        this.getCurrentEmailProvider()
      }
      this.loading = false
    },
    clear() {
      this.emailProviders.selected = 'mandrill'
      this.form = {
        email: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pages/user/email-providers-styles.scss';
</style>
