<template>
  <el-dialog
    :visible.sync="isVisible"
    width="80%"
    top="12vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        Buy Now! -
        <span class="capitalize">{{ dialogTitle }}</span>
      </h1>
    </header>
    <el-form
      :model="form"
      :rules="formRules"
      class="pr2 pl2"
      ref="form"
      v-loading="loading"
    >
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="24" :lg="24" :xl="12">
          <el-form-item label="Company name" prop="company">
            <el-input v-model="form.company" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="24" :lg="24" :xl="12">
          <el-form-item label="Full Name" prop="fullname">
            <el-input v-model="form.fullname" :class="{ dark }" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="Email" prop="email">
            <el-input type="email" v-model="form.email" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <template v-if="dialogTitle !== 'Other'">
          <el-col v-if="dialogTitle !== 'Datacenter'" :md="24" :lg="12">
            <el-form-item label="Capacity" prop="capacity">
              <el-select
                class="w-fit-full"
                :class="{ dark }"
                filterable
                v-model="form.capacity"
                placeholder="Select an option"
              >
                <el-option
                  v-for="option in capacities"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item
              :required="isRackRequired"
              prop="totalRack"
              label="Rack total"
            >
              <div class="w-fit-full inline-block">
                <div class="block">
                  <el-slider
                    class="relative"
                    id="rack-slider"
                    :disabled="isCustomRequest"
                    v-model="form.totalRack"
                    show-input
                    input-size="small"
                  />
                </div>
                <el-checkbox v-model="isCustomRequest" @change="resetRackTotal">
                  Custom request
                </el-checkbox>
              </div>
            </el-form-item>
          </el-col>
        </template>
        <template v-if="isBackboneSelection">
          <el-col :md="24" :xl="12">
            <el-form-item
              label="From (A-end)"
              required
              prop="address.pointA"
              ref="pointA"
            >
              <autocomplete-google
                @place-changed="handleAddressChanged($event, 'a')"
                size="regular"
                id="pointA"
              />
            </el-form-item>
          </el-col>
          <el-col :md="24" :xl="12">
            <el-form-item
              label="To (Z-end)"
              required
              prop="address.pointB"
              ref="pointB"
            >
              <autocomplete-google
                @place-changed="handleAddressChanged($event, 'b')"
                size="regular"
                id="pointB"
              />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item
            label="Message"
            prop="message"
            :required="
              isOthersCapacitySelection ||
                dialogTitle == 'Other' ||
                isCustomRequest
            "
          >
            <span
              v-if="isOthersCapacitySelection || isCustomRequest"
              class="error-message"
            >
              - {{ messageWhenRequired }}
            </span>
            <el-input
              type="textarea"
              rows="4"
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
      </el-row>
    </el-form>
    <footer class="footer flex wrap justify-content-space-between pr0 pl6 mt4">
      <small class="inline-block mt2 mb4">
        <span class="text-red">*</span> indicates required field
      </small>
      <div>
        <el-button plain type="info" class="mr2" @click="closeDialog"
          >Cancel</el-button
        >
        <el-button
          :disabled="!catchaVerified"
          type="primary"
          class="w-fit-content"
          plain
          @click="submitForm('form')"
          :loading="isSendingData"
          @keyup.enter.space="submitForm('form')"
          >Submit Request</el-button
        >
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getUserData } from '../../services/api/auth'
import { sendMessage } from '../../services/api/messages'
import { TOGGLE_BUY_DIALOG, BUY_TYPE } from '../../store/actionTypes'
import { getSelectionTypeNumber } from '../../helpers/getSelectionTypeNumber'
import VueRecaptcha from 'vue-recaptcha'
import siteKey from '../../config/siteKey'
import AutocompleteGoogle from '../../components/AutocompleteGoogle'
import validateEmail from '../../helpers/validateEmail'
import buyMessageFormatter from '../../helpers/buyMessageFormatter'

export default {
  components: {
    VueRecaptcha,
    AutocompleteGoogle
  },
  data: () => ({
    capacities: ['1Gbps', '10Gbps', '100Gbps', 'Fiber', 'Other'],
    loading: false,
    siteKey,
    isSendingData: false,
    catchaVerified: null,
    isCustomRequest: false,
    form: {
      company: '',
      email: '',
      fullname: '',
      capacity: '',
      totalRack: 0,
      message: '',
      address: {
        pointA: null,
        pointB: null
      }
    },
    formRules: {
      message: [],
      'address.pointA': [
        {
          required: true,
          message: 'Please input an A point',
          trigger: ['blur', 'change']
        }
      ],
      'address.pointB': [
        {
          required: true,
          message: 'Please input a Z point',
          trigger: ['blur', 'change']
        }
      ],
      totalRack: [],
      fullname: [
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
      company: [
        {
          required: true,
          message: 'Company name is required',
          trigger: ['blur', 'change']
        }
      ],
      email: [
        { required: true, message: 'Please input your email', trigger: 'blur' },
        {
          type: 'email',
          required: true,
          message: 'Please input a valid email',
          trigger: 'change'
        }
      ],
      capacity: [
        {
          required: true,
          message: 'Please select the desired capacity',
          trigger: 'change'
        }
      ]
    }
  }),
  computed: {
    ...mapState({
      buyType: state => state.buyType,
      dark: state => state.isDark,
      focus: state => state.map.focus
    }),
    messageWhenRequired() {
      if (this.dialogTitle === '') return ''
      else {
        let message =
          'Please, describe your Capacity requirement in more detail in the Message field below.'
        if (this.dialogTitle.trim() == 'Transit') {
          message =
            'Please, describe your Transit requirement in more detail in the Message field below.'
        } else if (
          this.dialogTitle.trim() == 'Datacenter' &&
          this.isCustomRequest
        ) {
          message =
            'Please, describe your custom request details in the Message field below.'
        }
        return message
      }
    },
    isRackRequired() {
      return this.isCustomRequest ? false : true
    },
    isOthersCapacitySelection() {
      return this.form.capacity == 'Other'
    },
    isBackboneSelection() {
      return this.focus && this.dialogTitle.toLowerCase() == 'backbone'
    },
    isVisible: {
      get() {
        return this.$store.state.isBuyDialog
      },
      set() {
        return this.closeDialog()
      }
    },
    dialogTitle() {
      return this.buyType && this.buyType.title ? this.buyType.title : ''
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  watch: {
    isVisible(bool) {
      if (!bool) {
        this.$refs.catpcha.reset()
        this.isCustomRequest = false
      } else this.setUserData()
    }
  },
  methods: {
    resetRackTotal(bool) {
      if (bool) {
        this.form.totalRack = 0
      }
    },
    handleCatchaVerification(v) {
      if (!v) return
      else this.catchaVerified = true
    },
    async setUserData() {
      if (!this.$auth.user) return
      const userData = await getUserData(await this.$auth.getUserID())

      if (userData) {
        this.loading = true
        const { user_metadata } = userData

        this.form.fullname =
          user_metadata && user_metadata.name
            ? user_metadata.name
            : validateEmail(userData.name)
            ? ''
            : userData.name
        this.form.email =
          user_metadata && user_metadata.email
            ? user_metadata.email
            : userData.email
        this.form.company =
          user_metadata && user_metadata.companyname
            ? user_metadata.companyname
            : ''
        this.form.phonenumber =
          user_metadata && user_metadata.phonenumber
            ? user_metadata.phonenumber
            : {
                num: '',
                valid: null
              }

        this.loading = false
      }
    },
    handleAddressChanged(place, inputTarget) {
      switch (inputTarget) {
        case 'b':
          this.form.address.pointB = { ...place }
          this.$refs.pointB.clearValidate()
          break
        default:
          this.form.address.pointA = { ...place }
          this.$refs.pointA.clearValidate()
          break
      }
    },
    async sendBuyRequest() {
      this.isSendingData = true
      const data = {
        element: this.$store.state.map.currentSelection.name,
        type: this.focus.type.toLowerCase(),
        custom: this.isCustomRequest,
        buyType: this.dialogTitle,
        ...this.form
      }

      const userID = await this.$auth.getUserID()
      const message = buyMessageFormatter({
        data,
        userID
      })

      const res = await sendMessage({
        email: data.email,
        message,
        user_id: userID,
        elemnt: this.focus.id,
        t: getSelectionTypeNumber(this.focus.type)
      })

      if (res && res.t && res.t != 'error') {
        this.closeDialog()
      }
      this.isSendingData = false
    },
    submitForm(formRef) {
      this.$refs[formRef].validate(valid => {
        if (valid) this.sendBuyRequest()
        else return false
      })
    },
    closeDialog() {
      this.$store.commit(`${TOGGLE_BUY_DIALOG}`, false)
      this.$refs.form.resetFields()
      this.catchaVerified = null
      this.form = {
        company: '',
        email: '',
        message: '',
        fullname: '',
        capacity: '',
        totalRack: 0,
        address: {
          pointA: null,
          pointB: null
        }
      }
      this.$store.commit(`${BUY_TYPE}`, null)
    }
  }
}
</script>
