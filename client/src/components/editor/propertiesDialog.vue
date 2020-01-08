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
      <el-form-item label="Color" v-if="feature.type !== 'Point'">
        <el-switch
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Active"
          inactive-text="Inactive"
          v-model="form.color"
        />
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
  data: () => ({
    form: {}
  }),
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    feature: {
      type: Object,
      required: true
    }
  },
  watch: {
    feature({ type }) {
      if (type !== 'Point') {
        this.form = {
          name: '',
          color: 'red'
        }
      } else {
        this.form = {
          name: ''
        }
      }
    },
    mode(str) {
      if (str === 'edit') {
        console.log(this.feature)
        this.form = {
          ...this.feature.feature.properties
        }
      }
    }
  },
  computed: {
    title() {
      let title = ''
      if (this.mode === 'create') {
        title = this.feature.type === 'Point' ? 'Create CLS' : 'Create cable'
      } else if (this.mode === 'edit') {
        title = this.feature.type === 'Point' ? 'Edit CLS' : 'Edit cable'
      }
      return title
    }
  },
  methods: {
    handleClose() {
      return this.$emit('close', this.form)
    }
  }
}
</script>
