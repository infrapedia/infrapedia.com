<template>
  <el-dialog
    :visible.sync="isVisible"
    width="80%"
    top="28vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">Report your issue</h1>
    </header>
    <el-form :model="form" :rules="formRules" class="pr6 pl6" ref="form">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="Full Name" prop="name">
            <el-input v-model="form.fullname" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="Email" prop="email">
            <el-input type="email" v-model="form.email" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Issue" prop="issue">
            <el-input type="textarea" :class="{ dark }" v-model="form.issue" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <footer class="footer flex justify-content-space-between pr0 pl6">
      <small class="inline-block mt2">
        <span class="text-red">*</span> indicates required field
      </small>
      <div>
        <el-button plain type="info" class="mr2" @click="closeDialog"
          >Cancel</el-button
        >
        <el-button
          :disabled="isFormUncomplete"
          type="primary"
          class="w24"
          plain
          @click="submitForm('form')"
          @keyup.enter.space="submitForm('form')"
          >Report</el-button
        >
      </div>
    </footer>
  </el-dialog>
</template>

<script>
// import { createIssue } from '../../services/api/issues'
import { TOGGLE_ISSUES_DIALOG } from '@/store/actionTypes'
import { getUserData } from '../../services/api/auth'

export default {
  data: () => ({
    form: {
      email: '',
      issue: '',
      elemnt: '',
      phonenumber: {
        num: '',
        valid: null
      },
      fullname: ''
    },
    formRules: {
      phonenumber: [],
      lastname: [
        {
          required: true,
          message: 'Please input your full name',
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
      issue: [
        {
          required: true,
          message: 'Please input the issue',
          trigger: ['blur', 'change']
        },
        {
          min: 10,
          message: 'Issue length should be at least 10',
          trigger: 'blur'
        }
      ]
    }
  }),
  computed: {
    isVisible: {
      get() {
        return this.$store.state.isIssueDialog
      },
      set() {
        return this.closeDialog()
      }
    },
    dark() {
      return this.$store.state.isDark
    },
    isFormUncomplete() {
      const emptyFields = Object.keys(this.form).filter(key => !this.form[key])
      return emptyFields.length ? true : false
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  watch: {
    isVisible(bool) {
      if (!bool) return
      this.setUserData()
    }
  },
  methods: {
    async setUserData() {
      if (!this.$auth || !this.$auth.user) return
      const userData = await getUserData(this.$auth.user.sub)

      if (userData) {
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
      }
    },
    async sendIssueRequest() {
      console.warn('NOT DONE YET')
      // const { focus } = this.$store.state.map

      // const res = await createIssue({
      //   user_id: this.$auth.user.sub,
      //   ...this.form,
      //   id: focus.id,
      //   t: focus.type === 'fac' || focus.type === 'facility' ? 3 : 1
      // })
      // if (res && res.t !== 'error') this.closeDialog()
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
        if (valid) this.sendIssueRequest()
        else return false
      })
    },
    closeDialog() {
      this.$store.commit(`${TOGGLE_ISSUES_DIALOG}`, false)
      this.$refs.form.resetFields()
      this.form = {
        email: '',
        issue: '',
        elemnt: '',
        phonenumber: {
          num: '',
          valid: null
        },
        fullname: ''
      }
    }
  }
}
</script>
