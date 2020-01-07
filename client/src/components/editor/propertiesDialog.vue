<template>
  <el-dialog
    :visible.sync="isVisible"
    width="30%"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form>
      <el-input v-model="form.name" />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'PropertiesDialog',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClose() {
      return this.$emit('close')
    }
  }
}
</script>
