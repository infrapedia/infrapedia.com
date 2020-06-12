<template>
  <el-dialog
    :visible.sync="isVisible"
    width="20%"
    top="20vh"
    append-to-body
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <h2 class="title-user-variant" slot="title">
      {{ title }}
    </h2>
    <el-form>
      <el-form-item label="Category">
        <el-input v-model="form.category" />
      </el-form-item>
      <el-form-item label="Stroke color">
        <el-color-picker v-model="form.color" :predefine="predefineColors" />
      </el-form-item>
      <el-form-item
        label="Line style"
        v-if="featureType == 'terrestrials' || featureType == 'subsea'"
      >
        <el-radio-group v-model="form['line-style']">
          <el-radio-button label="dashed">
            Dashed
          </el-radio-button>
          <el-radio-button label="normal">
            Normal
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="checkFields" @click="handleClose">
        Save
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'MapPropertiesDialog',
  data: () => ({
    form: {},
    predefineColors: [
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#90ee90',
      '#00ced1',
      '#1e90ff'
    ]
  }),
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    featureType: {
      type: String,
      default: () => ''
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
    isVisible(bool) {
      if (!bool) return
      this.createFormKeys()
    }
  },
  computed: {
    title() {
      return this.mode == 'create' ? 'Add properties' : 'Edit properties'
    },
    checkFields() {
      const emptyFields = Object.keys(this.form).filter(key => !this.form[key])
      return emptyFields.length ? true : false
    }
  },
  methods: {
    createFormKeys() {
      if (this.mode != 'create') {
        this.form = { ...this.feature.properties }
        if (!this.form.category) {
          this.form.category = ''
        }
      } else {
        if (this.featureType != 'Point') {
          this.form = {
            color: '',
            category: '',
            'line-style': 'normal'
          }
        } else {
          this.form = {
            color: '',
            category: ''
          }
        }
      }
    },
    handleClose() {
      if (this.form.color === '') {
        this.form.color = '#1e90ff'
      }
      return this.$emit('close', this.form)
    }
  }
}
</script>
