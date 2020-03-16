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
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
          <el-form-item label="Company name" prop="company">
            <el-input v-model="form.company" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="24" :lg="12" :xl="8">
          <el-form-item label="Full Name" prop="fullname">
            <el-input v-model="form.fullname" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="24" :lg="12" :xl="8">
          <el-form-item label="Phone number">
            <div class="el-input">
              <i-phone-input
                inputClasses="el-input__inner issues-dialog"
                v-model="form.phonenumber.num"
                @onInput="validatePhoneNumber"
                class="m0 p0 el-input__inner"
              />
            </div>
            <el-collapse-transition>
              <el-alert
                type="error"
                class="mt2 h8"
                show-icon
                title="This phone number is not valid"
                :closable="false"
                v-if="form.phonenumber.num && !form.phonenumber.valid"
              />
            </el-collapse-transition>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="24" :lg="12" :xl="12">
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
            <div class="block">
              <el-form-item prop="rack">
                <span slot="label">
                  <span class="text-red">*</span> Rack total
                </span>
                <br />
                <div class="block">
                  <el-slider
                    class="relative"
                    id="rack-slider"
                    v-model="form.totalRack"
                    show-input
                    input-size="small"
                  />
                </div>
              </el-form-item>
            </div>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item label="Message" prop="message">
            <el-input
              type="textarea"
              rows="4"
              v-model="form.message"
              :class="{ dark }"
            />
          </el-form-item>
        </el-col>
        <template v-if="isEitherSubseaOrTerrestrialNetwork">
          <el-col :span="12">
            <el-form-item label="From (A-end)" prop="fromA">
              <autocomplete-google
                @place-changed="handleAddressChanged($event, 'a')"
                size="regular"
                id="pointA"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="To (B-end)" prop="toB">
              <autocomplete-google
                @place-changed="handleAddressChanged($event, 'b')"
                size="regular"
                id="pointB"
              />
            </el-form-item>
          </el-col>
        </template>
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
          :disabled="isFormUncomplete"
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

export default {
  components: {
    VueRecaptcha,
    AutocompleteGoogle
  },
  data: () => ({
    capacities: ['1GB', '10GB', '100GB', 'Others'],
    loading: false,
    siteKey,
    isSendingData: false,
    catchaVerified: null,
    form: {
      company: '',
      email: '',
      fullname: '',
      capacity: '',
      totalRack: 0,
      message: '',
      phonenumber: {
        num: '',
        valid: null
      }
    },
    formRules: {
      phonenumber: [],
      message: [],
      fromA: [],
      toB: [],
      fullname: [
        {
          required: true,
          message: 'Please input your fullname',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: 'Length should be 3 to 10',
          trigger: 'blur'
        }
      ],
      company: [
        { required: true, message: 'Company name is required', trigger: 'blur' }
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
    isEitherSubseaOrTerrestrialNetwork() {
      return this.focus && this.focus.type.toLowerCase() === 'cable'
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
      return (this.buyType && this.buyType.title) || ''
    },
    isFormUncomplete() {
      // TODO: fix this form uncomplete checker for when using & !using: totalRack
      const emptyFields = Object.keys(this.form).filter(key => !this.form[key])
      return (emptyFields.length &&
        this.dialogTitle === 'Datacenter' &&
        emptyFields.includes('totalRack')) ||
        !this.catchaVerified
        ? true
        : false
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  watch: {
    isVisible(bool) {
      if (!bool) return this.$refs.catpcha.reset()
      return this.setUserData()
    }
  },
  methods: {
    handleCatchaVerification(v) {
      if (!v) return
      else this.catchaVerified = true
    },
    async setUserData() {
      if (!this.$auth || !this.$auth.user) return
      const userData = await getUserData(this.$auth.user.sub)

      if (userData) {
        this.loading = true
        const { user_metadata } = userData

        this.form.fullname = user_metadata.name
          ? user_metadata.name
          : userData.name
        this.form.email = user_metadata.email
          ? user_metadata.email
          : userData.email
        this.form.company = user_metadata.companyname
          ? user_metadata.companyname
          : ''
        this.form.phonenumber = user_metadata.phonenumber
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
          console.log(place, inputTarget)
          break
        default:
          console.log(place, inputTarget)
          break
      }
    },
    async sendBuyRequest() {
      this.isSendingData = true
      const data = {
        cable: this.$store.state.map.currentSelection.name,
        type: this.dialogTitle,
        ...this.form
      }

      const res = await sendMessage({
        email: data.email,
        phone: data.phonenumber,
        message:
          data.message !== ''
            ? data.message
            : `Hi, ${data.fullname} (${data.email})
          , you asked to buy an amount of ${data.capacity} for ${data.cable}(${data.type})`,
        elemnt: this.focus.id,
        user_id: this.$auth.user.sub,
        t: getSelectionTypeNumber(this.focus.type)
      })

      if (res && res.status && res.status !== 'error') {
        this.closeDialog()
      }
      this.isSendingData = false
    },
    validatePhoneNumber({ number, isValid }) {
      try {
        this.form.phonenumber = {
          num: number,
          valid: isValid
        }
      } catch {
        // Ignore
      }
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
      this.form = {
        company: '',
        email: '',
        message: '',
        fullname: '',
        capacity: '',
        totalRack: 0,
        phonenumber: {
          num: '',
          valid: null
        }
      }
      this.$store.commit(`${BUY_TYPE}`, null)
    }
  }
}
</script>
