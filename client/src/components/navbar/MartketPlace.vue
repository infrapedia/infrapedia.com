<template>
  <div v-click-outside="closeSheet">
    <div
      aria-haspopup="true"
      class="text-center h-fit-full flex align-items-center"
    >
      <el-button
        type="text"
        :class="{ 'text-white--hsl': dark }"
        class="drawer-opener fs-small"
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
          <h1 class="title w-fit-full mb8">Community Market Place</h1>
          <el-table
            :data="marketplaceData"
            class="w-fit-full"
            :class="{ dark }"
            id="marketplace-banner-table"
            :height="120"
            border
            size="small"
            max-height="620px"
            stripe
          >
            <el-table-column
              label="Date"
              prop="rgDate"
              :formatter="formatDate"
            />
            <el-table-column label="Item">
              <template slot-scope="scope">
                <div v-html="scope.row.item" />
              </template>
            </el-table-column>
            <el-table-column label="Request">
              <template slot-scope="scope">
                <div v-html="scope.row.request" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="Status" />
            <el-table-column fixed="right" label="Operations" width="220">
              <template slot-scope="scope">
                <div class="flex row justify-content-center">
                  <el-button @click="toggleDialog(scope.row)" size="small">
                    Make an offer
                  </el-button>
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
            <el-form-item label="Subject" prop="subject">
              <el-input v-model="dialog.form.subject" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="Message" prop="message">
              <el-input
                ref="textareaInput"
                v-model="dialog.form.message"
                type="textarea"
                rows="4"
              />
            </el-form-item>
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
          @click.stop="sendOffer"
          :loading="isSendingData"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { formatDate } from '../../helpers/formatDate'
import { getUserData } from '../../services/api/auth'
import { getMarketPlaceList, makeAnOffer } from '../../services/api/marketplace'

export default {
  data: () => ({
    marketplaceData: [],
    isSendingData: false,
    isOpen: false,
    dialog: {
      isVisible: false,
      rawMessage: null,
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
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
        message: []
      }
    }
  },
  async mounted() {
    await this.getMarketPlace()
    await this.getUserData()
  },
  methods: {
    async getUserData() {
      if (this.dialog.form.email !== '' || this.dialog.form.name !== '') return

      const res = await getUserData(await this.$auth.getUserID())
      if (res) {
        this.dialog.form.email = res.email
        this.dialog.form.name = res.name
        if (res.user_metadata.lastname) {
          this.dialog.form.name =
            this.dialog.form.name + ' ' + res.user_metadata.lastname
        }
      }
      return res
    },
    async getMarketPlace() {
      const res = await getMarketPlaceList()
      if (res && res.data && res.data.r) {
        this.marketplaceData = res.data.r.map(item => {
          let request = this.formatMessage(item.message)
            .split('Type:')[1]
            .split('<p style="font-size: 14px">')[1]
          let customRequest = item.message.includes('Custom Request: true')

          return {
            raw: item.message,
            rgDate: item.rgDate,
            status: item.status ? 'Open' : 'Closed',
            item: `${
              this.formatMessage(item.message)
                .split('Element:')[1]
                .split('<p style')[0]
            }`,
            request: `${
              customRequest
                ? 'Custom configuration'
                : request
                ? `<p>${request.split('</p>')[0]}`
                : 'None'
            }`
          }
        })
      }
    },
    async sendOffer() {
      try {
        this.isSendingData = true
        const { t } = await makeAnOffer({
          ...this.dialog.form,
          message: `${this.dialog.form.message} <br> <br> <hr /> ${this.dialog.rawMessage}`,
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
      this.dialog.isVisible = true
      this.dialog.form.subject = `Want to make an offer for this request: ${
        data.item.split('</p>')[0]
      } - ${
        data.request.split('<p>')[1]
          ? data.request.split('<p>')[1]
          : data.request
      }`
      this.dialog.rawMessage = data.raw

      setTimeout(() => {
        this.$refs.textareaInput.focus()
      }, 320)
    },
    closeDialog() {
      this.dialog.isVisible = false

      this.dialog.form.message = ''
      this.dialog.form.subject = ''
      this.dialog.rawMessage = null
    },
    formatDate(_, __, value) {
      return formatDate(value)
    },
    formatMessage(value) {
      const v = value.split('The user has the following request:</p>')
      return v[1]
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
