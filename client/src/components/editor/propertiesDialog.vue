<template>
  <el-dialog
    :visible.sync="isVisible"
    width="40%"
    top="35vh"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <h1 slot="title">
      {{ title }}
    </h1>
    <el-form>
      <el-form-item label="Name">
        <el-input v-model="form.name" />
      </el-form-item>
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
    },
    title: {
      type: String,
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
