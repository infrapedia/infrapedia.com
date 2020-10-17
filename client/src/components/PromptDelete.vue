<template>
  <el-dialog
    :visible.sync="isVisible"
    width="30%"
    top="24vh"
    :custom-class="customClass"
    :before-close="closeDialog"
  >
    <div class="fs-regular">
      <span class="inline-block mb4">
        Are you sure you want to delete this {{ elemnt }}.
        <strong> This action is irreversible.</strong>
      </span>
      <el-input
        v-model="confirmationText"
        placeholder="Input 'Delete' to continue"
      />
    </div>
    <footer class="footer pr0 pl6 mt4">
      <div class="flex justify-content-end">
        <el-button plain type="primary" class="mr2" @click="closeDialog"
          >Cancel</el-button
        >
        <el-button
          type="text"
          :disabled="confirmationText.toLowerCase() != 'delete'"
          plain
          class="w24"
          @click="$emit('delete-confirm')"
          >Delete</el-button
        >
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import elemntTypeValidator from '../helpers/elemntTypeValidator'

export default {
  data: () => ({
    confirmationText: ''
  }),
  watch: {
    isVisible(bool) {
      if (bool) {
        this.confirmationText = ''
      }
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    customClass() {
      return this.dark ? 'dark' : ''
    }
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    elemnt: {
      type: String,
      required: true,
      validator: elemntTypeValidator
    }
  },
  methods: {
    closeDialog() {
      this.$emit('delete-cancel')
    }
  }
}
</script>
