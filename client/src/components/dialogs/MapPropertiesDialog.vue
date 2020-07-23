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
        <el-select
          v-model="form.category"
          placeholder
          class="w-fit-full"
          :class="{ dark }"
        >
          <el-option
            v-for="(cat, i) in categoriesList"
            :key="i"
            :value="cat.name"
            :label="cat.name"
            class="capitalize"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">
        Save
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCategoriesByType } from '../../helpers'

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
    categories: {
      type: Array,
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
      this.createFormKeys()
    }
  },
  computed: {
    title() {
      return this.mode == 'create' ? 'Add properties' : 'Edit properties'
    },
    dark() {
      return this.$store.state.isDark
    },
    categoriesList() {
      const featureType = this.featureType !== '' ? this.featureType : false
      let availableCategories = []
      let args = { t: null, categories: this.categories }

      if (featureType && this.categories.length > 0) {
        args.t = featureType
        availableCategories = getCategoriesByType(args)
      }

      return availableCategories
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
