<template>
  <el-dialog
    :visible.sync="isVisible"
    width="80%"
    top="28vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        Report your issue
      </h1>
    </header>
    <el-form
      :model="form"
      :rules="formRules"
      class="pr6 pl6"
      ref="form"
    >
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="First Name" prop="name">
            <el-input v-model="form.name" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Last Name" prop="lastname">
            <el-input v-model="form.lastname" :class="{ dark }" />
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
            <el-input
              type="textarea"
              :class="{ dark }"
              v-model="form.issue"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <footer class="footer flex justify-content-space-between pr0 pl6">
      <small class="inline-block mt2">
        <span class="text-red">*</span> indicates required field
      </small>
      <div>
        <el-button
          plain
          type="info"
          class="mr2"
          @click="closeDialog"
        >
          Cancel
        </el-button>
        <el-button
          :disabled="isFormUncomplete"
          type="primary"
          class="w24"
          plain
          @click="submitForm('form')"
        >
          Report
        </el-button>
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import { TOGGLE_ISSUES_DIALOG } from '@/store/actionTypes'

export default {
  data: () => ({
    form: {
      name: '',
      email: '',
      issue: '',
      lastname: ''
    },
    formRules: {
      name: [
        { required: true, message: 'Please input your first name', trigger: 'blur' },
        { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
      ],
      lastname: [
        { required: true, message: 'Please input your last name name', trigger: 'blur' },
        { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
      ],
      company: [
        { required: true, message: 'Company name is required', trigger: 'blur' }
      ],
      email: [
        { required: true, message: 'Please input your email', trigger: 'blur' },
        { type: 'email', required: true, message: 'Please input a valid email', trigger: 'change' }
      ],
      issue: [
        { required: true, message: 'Please input the issue', trigger: 'blur' },
        { min: 10, message: 'Issue length should be at least 10', trigger: 'blur' }
      ],
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
      const { name, lastname, email, issue } = this.form
      let isDisabled = true
      if (
        name !== '' &&
        lastname !== '' &&
        email !== '' &&
        issue !== ''
      ) {
        isDisabled = false
      }
      return isDisabled
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  methods: {
    submitForm(formRef) {
      this.$refs[formRef].validate((valid) => {
        if (valid) alert('submit!')
        else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.$store.commit(`${TOGGLE_ISSUES_DIALOG}`, false)
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        email: '',
        issue: '',
        lastname: ''
      }
    }
  }
}
</script>
