<template>
  <div v-click-outside="closeSheet">
    <div
      aria-haspopup="true"
      class="text-center h-fit-full flex align-items-center"
    >
      <el-button
        type="text"
        :class="{ 'text-white--hsl': dark }"
        class="drawer-opener fs-small font-regular mt-1"
        @click="toggleVisibility"
      >
        Market Place
        <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon" />
      </el-button>
      <transition
        tag="div"
        enter-active-class="animated faster slideInDown"
        leave-active-class="animated faster slideOutUp"
        mode="out-in"
      >
        <div
          v-if="isOpen"
          class="wrapper flex column bg-white pr6 pl6 pt12"
          :class="{
            'bg-white': !dark,
            'bg-charcoal': dark
          }"
        >
          <header class="relative">
            <h1 class="title mb8 inline-block">Community Market Place</h1>
            <el-button
              circle
              class="close-btn no-border"
              icon="el-icon-close"
              @click="closeSheet"
            />
          </header>

          <el-table
            :data="marketplaceData"
            class="w-fit-full"
            :class="{ dark }"
            id="marketplace-banner-table"
            :height="120"
            border
            v-loading="loading"
            size="small"
            max-height="620px"
            stripe
          >
            <el-table-column
              label="Date"
              prop="rgDate"
              :formatter="formatDate"
            />
            <el-table-column label="Request">
              <template slot-scope="scope">
                <div v-html="scope.row.request" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="Status" />
            <el-table-column fixed="right" label="Operations" width="220">
              <template slot-scope="scope">
                <div class="flex row justify-content-center">
                  <el-tooltip
                    effect="dark"
                    :disabled="isLoggedIn"
                    placement="top-start"
                    content="You need to login before making an offer"
                  >
                    <el-button
                      @click="toggleDialog(scope.row)"
                      size="small"
                      :disabled="!isLoggedIn"
                    >
                      Make an offer
                    </el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </transition>
    </div>
    <el-dialog
      :show-close="false"
      :append-to-body="true"
      :visible.sync="dialog.isVisible"
    >
      <div slot="title" class="flex w-fit-full justify-content-space-between">
        <span class="el-dialog__title">
          Make An Offer
        </span>
        <el-button type="text" class="p0 m0" @click.stop="closeDialog">
          <span class="fs-medium cursor-pointer">
            <fa :icon="['fas', 'times']" />
          </span>
        </el-button>
      </div>
      <el-form :model="dialog.form" :rules="dialogFormRules" ref="dialogForm">
        <el-row :gutter="20">
          <el-col :md="24" :lg="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="dialog.form.name" />
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="Email" prop="email">
              <el-input v-model="dialog.form.email" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="Organization" prop="organization">
              <el-input v-model="dialog.form.organization" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="Subject" prop="subject">
              <el-input v-model="dialog.form.subject" disabled />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="Message" prop="message" required>
              <el-input
                ref="textareaInput"
                v-model="dialog.form.message"
                type="textarea"
                rows="4"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb4">
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
      <el-collapse v-if="dialog.rawMessage">
        <el-collapse-item title="From Request">
          <div v-html="dialog.rawMessage" />
        </el-collapse-item>
      </el-collapse>
      <span slot="footer" class="flex row wrap flex-end">
        <el-button @click.stop="closeDialog" class="mr4">Cancel</el-button>
        <el-button
          type="primary"
          @click.stop="validateForm"
          :disabled="!catchaVerified"
          :loading="isSendingData"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import siteKey from '../../config/siteKey'
import ClickOutside from 'vue-click-outside'
import { formatDate } from '../../helpers/formatDate'
import { getUserData } from '../../services/api/auth'
import { formatMarketPlaceData } from '../../helpers/buyMessageFormatter'
import { getMarketPlaceList, makeAnOffer } from '../../services/api/marketplace'
import { checkCookie } from '../../helpers/cookies'

export default {
  components: {
    VueRecaptcha: () => import('vue-recaptcha')
  },
  data: () => ({
    marketplaceData: [],
    isSendingData: false,
    catchaVerified: null,
    isOpen: false,
    loading: false,
    dialog: {
      isVisible: false,
      rawMessage: null,
      altRawMessage: null,
      form: {
        name: '',
        email: '',
        subject: '',
        message: '',
        organization: ''
      }
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    isLoggedIn() {
      return checkCookie('auth.token-session') && this.$auth.isAuthenticated
    },
    siteKey() {
      return siteKey
    },
    dialogFormRules() {
      return {
        name: [
          {
            required: true,
            message: 'Please input your full name',
            trigger: 'blur'
          },
          {
            max: 50,
            message: 'Length should be max 50',
            trigger: ['change', 'blur']
          }
        ],
        organization: [
          {
            required: true,
            message: 'Please input your organization name',
            trigger: 'blur'
          },
          {
            max: 50,
            message: 'Length should be max 50',
            trigger: ['change', 'blur']
          }
        ],
        email: [
          {
            required: true,
            message: 'Please input your email',
            trigger: 'blur'
          },
          {
            type: 'email',
            required: true,
            message: 'Please input a valid email',
            trigger: 'change'
          }
        ],
        subject: [],
        message: [
          {
            required: true,
            message: 'A Message is required',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    isOpen(bool) {
      if (bool) {
        this.getMarketPlace()
      }
    }
  },
  async mounted() {
    await this.getUserData()
  },
  methods: {
    handleCatchaVerification(v) {
      if (!v) return
      else this.catchaVerified = true
    },
    async getUserData() {
      if (this.dialog.form.email !== '' || this.dialog.form.name !== '') return

      const res = await getUserData(await this.$auth.getUserID())
      if (res) {
        this.dialog.form.email = res.email
        this.dialog.form.name = res.name
        if (res.user_metadata && res.user_metadata.lastname) {
          this.dialog.form.name =
            this.dialog.form.name + ' ' + res.user_metadata.lastname
        }
      }
      return res
    },
    async getMarketPlace() {
      this.loading = true
      const res = await getMarketPlaceList()
      if (res && res.data && res.data.r) {
        this.marketplaceData = res.data.r
          .map(formatMarketPlaceData)
          .filter(t => t)
      }
      this.loading = false
    },
    validateForm() {
      return this.$refs.dialogForm.validate(valid => {
        if (valid && this.catchaVerified) this.sendOffer()
        else return false
      })
    },
    async sendOffer() {
      try {
        this.isSendingData = true
        const { t } = await makeAnOffer({
          ...this.dialog.form,
          message: `${this.dialog.form.message} <br> <br> <hr /> ${this.dialog.rawMessage} <br> <br> <hr /> ${this.dialog.altRawMessage}`,
          user_id: await this.$auth.getUserID()
        })

        if (t != 'error') this.closeDialog()
      } catch (err) {
        console.error(err)
      } finally {
        this.isSendingData = false
      }
    },
    async toggleDialog(data) {
      try {
        this.dialog.isVisible = true
        this.dialog.altRawMessage = data.message
        this.dialog.rawMessage = data.request
        this.dialog.form.subject = `Want to make an offer for this request: ${data.subject.replace(
          '</p>',
          ''
        )}`

        setTimeout(() => {
          this.$refs.textareaInput.focus()
        }, 320)
      } catch (err) {
        console.error(err)
      }
    },
    closeDialog() {
      this.dialog.isVisible = false

      this.dialog.altRawMessage = null
      this.dialog.rawMessage = null
      this.dialog.form.message = ''
      this.dialog.form.subject = ''
      this.dialog.form.organization = ''
    },
    formatDate(_, __, date) {
      return formatDate(date)
    },
    toggleVisibility() {
      this.isOpen = !this.isOpen
    },
    closeSheet() {
      if (this.dialog.isVisible) return
      this.isOpen = false
    }
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/marketplace-navbar-styles.scss';
</style>
