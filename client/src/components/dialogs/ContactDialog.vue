<template>
  <div>
    <el-button class="contact-button" type="primary" @click="openDialog">
      <fa :icon="['fa', 'envelope']" />
    </el-button>

    <el-dialog
      :custom-class="
        dark
          ? 'custom-dialog dark contact-dialog'
          : 'custom-dialog contact-dialog'
      "
      title="Contact Us"
      :visible.sync="dialogVisible"
    >
      <transition name="el-fade-in-linear">
        <contact-form
          v-show="hideForm"
          :handle-submit="handleSubmit"
        ></contact-form>
      </transition>
      <transition name="el-fade-in-linear">
        <div v-show="showSuccess" class="container-center contact-dialog-alert">
          <h2>Message Received</h2>
          <i class="el-icon-success big-icon success"></i>
          <p>We will contact you <br />as soon as possible</p>
          <el-button
            round
            class=""
            type="primary"
            @click="dialogVisible = false"
          >
            Close
          </el-button>
        </div>
      </transition>
      <transition name="el-fade-in-linear">
        <div v-show="showError" class="container-center contact-dialog-alert">
          <h2>Unsuccessful</h2>
          <i class="el-icon-error big-icon error"></i>
          <p>Something went wrong <br />Please, try again at a later time.</p>
          <el-button
            round
            class=""
            type="primary"
            @click="dialogVisible = false"
          >
            Close
          </el-button>
        </div>
      </transition>
    </el-dialog>
  </div>
</template>
<script>
import ContactForm from '../ContactForm.vue'
import { sendContactForm } from '../../services/api/contact'

export default {
  name: 'ContactDialog',
  components: {
    ContactForm
  },
  data() {
    return {
      dialogVisible: false,
      hideForm: false,
      showSuccess: false,
      showError: false
    }
  },
  methods: {
    async handleSubmit(form) {
      this.hideForm = false
      const { t } = await sendContactForm(form)
      if (t != 'error') {
        this.showError = true
        this.showSuccess = false
      }
      this.showError = false
      this.showSuccess = true
    },
    openDialog() {
      this.showSuccess = false
      this.showError = false
      this.dialogVisible = true
      this.hideForm = true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/contact-dialog-styles.scss';
</style>
