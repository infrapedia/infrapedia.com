<template>
  <div>
    <el-button type="text" @click="dialogVisible = true"
      >click to open the Dialog
      <fa :icon="['fa', 'envelope']" />
    </el-button>

    <el-dialog
      :custom-class="dark ? 'custom-dialog dark' : 'custom-dialog'"
      title="Send us a Message"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <contact-form></contact-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ContactForm from '../ContactForm.vue'
export default {
  name: 'ContactDialog',
  components: {
    ContactForm
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('Success | Fail').then(() => {
        done()
      })
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
