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
    <el-form class="pr6 pl6">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="First Name*">
            <el-input v-model="form.name" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Last Name*">
            <el-input v-model="form.lastname" :class="{ dark }" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="Email*">
            <el-input type="email" v-model="form.email" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Issue*">
            <el-input v-model="form.issue" :class="{ dark }" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <footer class="footer flex justify-content-space-between pr0 pl6">
      <small class="color-inherit">* indicates required field</small>
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
    closeDialog() {
      this.$store.commit(`${TOGGLE_ISSUES_DIALOG}`, false)
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
