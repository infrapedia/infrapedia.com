<template>
  <el-dialog
    :visible.sync="isDialog"
    width="40%"
    top="12vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        <span class="capitalize">Edit information</span>
      </h1>
    </header>
    <el-form class="pr2 pl2" ref="form" v-loading="loading">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item label="File">
            <dragger class="mt12" :is-raw-file="true" @raw-file="setFile" />
          </el-form-item>
        </el-col>
        <el-alert
          v-if="fileSelected"
          type="success"
          class="mt4"
          title="File loaded correctly"
          :closable="false"
          show-icon
        />
        <el-col :span="24">
          <el-form-item label="Information">
            <el-input type="textarea" rows="4" v-model="form.information" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <footer class="footer flex wrap justify-content-end pr0 pl6">
      <!-- <small class="inline-block mt2 mb4">
        <span class="text-red">*</span> indicates required field
      </small> -->
      <div>
        <el-button plain type="info" class="mr2" @click="closeDialog"
          >Cancel</el-button
        >
        <el-button
          :disabled="isFormUncomplete"
          type="primary"
          class="w28"
          plain
          @click="submitForm"
          @keyup.enter.space="submitForm"
          >Send</el-button
        >
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import { editElemnt } from '../../services/api/uploads'

export default {
  components: {
    Dragger: () => import('../../components/Dragger')
  },
  data: () => ({
    loading: false,
    fileSelected: false,
    form: {
      information: '',
      file: ''
    }
  }),
  props: {
    isDialog: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    isVisible: {
      get() {
        return this.isDialog
      },
      set() {
        return this.closeDialog()
      }
    },
    isFormUncomplete() {
      const emptyFields = Object.keys(this.form).filter(key => !this.form[key])
      return emptyFields.length ? true : false
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  methods: {
    setFile(file) {
      this.fileSelected = false
      this.form.file = file
      this.fileSelected = true
    },
    async submitForm() {
      const res = await editElemnt({
        user_id: this.$auth.user.sub,
        ...this.form
      })
      if (res && res.t !== 'error') this.closeDialog()
    },
    closeDialog() {
      this.form = {
        information: '',
        file: ''
      }
      return this.$emit('close')
    }
  }
}
</script>
