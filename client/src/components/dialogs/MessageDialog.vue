<template>
  <el-dialog
    :visible.sync="isVisible"
    width="40%"
    top="12vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        <span class="capitalize">Send Message</span>
      </h1>
    </header>
    <el-form class="pr2 pl2" ref="form" v-loading="loading">
      <el-form-item label="Subject">
        <el-input v-model="form.subject" :class="{ dark }" />
      </el-form-item>
    </el-form>
    <editor-html :reset="!isVisible" @msg-change="handleMessageChange" />
    <footer class="footer flex wrap justify-content-end pr0 pl6">
      <div>
        <el-button plain type="info" class="mr2" @click="closeDialog"
          >Cancel</el-button
        >
        <el-button
          :disabled="isFormUncomplete"
          type="primary"
          plain
          @click="submitForm"
          @keyup.enter.space="submitForm"
          >Send message</el-button
        >
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { sendEmail } from '../../services/api/alerts'
import { MAP_FOCUS_ON } from '../../store/actionTypes/map'
import { TOGGLE_MESSAGE_DIALOG } from '../../store/actionTypes'

export default {
  components: {
    'editor-html': () => import('../../components/HtmlEditor.vue')
  },
  data: () => ({
    loading: false,
    form: {
      subject: '',
      message: ''
    }
  }),
  computed: {
    ...mapState({
      focus: state => state.map.focus,
      dark: state => state.isDark
    }),
    isVisible: {
      get() {
        return this.$store.state.isMessageDialog
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
      return this.dark ? 'alerts-dialog dark' : 'alerts-dialog light'
    }
  },
  methods: {
    handleMessageChange(msg) {
      this.form.message = msg
    },
    async submitForm() {
      const res = await sendEmail({
        user_id: this.$auth.user.sub,
        id: this.focus.id,
        ...this.form
      })
      if (res && res.t !== 'error') {
        const data = res.data.m && res.data.m.length ? res.data.m[0] : false
        if (data) {
          data.reject_reason
            ? this.$notify({
                type: 'error',
                title: 'Something wrong happened ...',
                message: `The message couldn't be sent. Was rejected because of: ${data.reject_reason}`
              })
            : this.$notify({
                type: 'success',
                title: 'Success!',
                message: `Message has been sent to: ${data.email}`
              })
        }
        this.closeDialog()
      }
    },
    closeDialog() {
      this.$store.commit(`${TOGGLE_MESSAGE_DIALOG}`, false)
      this.$store.commit(`${MAP_FOCUS_ON}`, null)
      this.form = {
        subject: '',
        message: ''
      }
    }
  }
}
</script>
