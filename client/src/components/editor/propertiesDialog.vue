<template>
  <el-dialog
    :visible.sync="isVisible"
    width="20%"
    top="20vh"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <h2 class="title-user-variant" slot="title">
      {{ title }}
    </h2>
    <el-form>
      <el-form-item label="Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <template v-if="feature.geometry && feature.geometry.type !== 'Point'">
        <el-form-item label="Status">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="Active"
            inactive-text="Inactive"
            active-value="Active"
            inactive-value="Inactive"
            v-model="form.status"
          />
        </el-form-item>
        <el-form-item label="Stroke color">
          <el-color-picker v-model="form.stroke" :predefine="predefineColors">
          </el-color-picker>
        </el-form-item>
        <el-form-item label="Stroke width">
          <el-input-number
            v-model="form['stroke-width']"
            class="w-fit-full"
            :step="0.1"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="Stroke opacity">
          <el-input-number
            v-model="form['stroke-opacity']"
            class="w-fit-full"
            :step="0.1"
            :min="0"
          />
        </el-form-item>
      </template>
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
  name: 'PropertiesDialog',
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

      const type = this.feature.geometry.type

      if (this.mode !== 'create') {
        this.form = { ...this.feature.properties }
      } else {
        if (type !== 'Point') {
          this.form = {
            name: '',
            status: true,
            stroke: '#cccccc',
            'stroke-width': 0.4,
            'stroke-opacity': 1
          }
        } else {
          this.form = {
            name: ''
          }
        }
      }
    }
  },
  computed: {
    title() {
      let title = ''
      if (this.feature.geometry) {
        if (this.mode === 'create') {
          title =
            this.feature.geometry.type === 'Point'
              ? 'Create CLS properties'
              : 'Create segment properties'
        } else if (this.mode === 'edit') {
          title =
            this.feature.geometry.type === 'Point'
              ? 'Edit CLS properties'
              : 'Edit cls properties'
        }
      }
      return title
    },
    checkFields() {
      const emptyFields = Object.keys(this.form).filter(key => !this.form[key])
      return emptyFields.length && !emptyFields.includes('status')
        ? true
        : false
    }
  },
  methods: {
    handleClose() {
      return this.$emit('close', this.form)
    }
  }
}
</script>
