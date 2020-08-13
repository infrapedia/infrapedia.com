<template>
  <el-dialog
    :visible.sync="isVisible"
    width="20%"
    top="20vh"
    append-to-body
    :show-close="true"
    :close-on-press-escape="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <h2 class="title-user-variant" slot="title">
      {{ title }}
    </h2>
    <el-form>
      <el-form-item label="Category" v-if="type == 'map'">
        <el-select
          v-model="form.category"
          placeholder
          class="w-fit-full"
          :class="{ dark }"
        >
          <el-option
            v-for="(cat, i) in categoriesList"
            :key="i"
            :value="cat"
            :label="cat.name"
            class="capitalize"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <template v-if="feature.geometry && feature.geometry.type != 'Point'">
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
        <el-form-item label="Height" v-if="feature.geometry.type == 'Polygon'">
          <el-input-number
            class="w-fit-full"
            controls-position="right"
            v-model="form.height"
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
import { getCategoriesByType } from '../../helpers'

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
    categories: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    feature: {
      type: Object,
      required: true
    },
    creationForm: {
      type: Object,
      required: true
    }
  },
  watch: {
    isVisible(bool) {
      if (!bool) return

      const type = this.feature.geometry.type

      if (this.mode != 'create') {
        this.form = { ...this.feature.properties }
      } else {
        switch (type.toLowerCase()) {
          case 'point':
            this.form = {
              name: ''
            }
            break
          case 'polygon':
            this.form = {
              name: '',
              height: 0,
              status: true
            }
            break
          default:
            this.form = {
              name: '',
              status: true
            }
            break
        }
      }
    }
  },
  computed: {
    title() {
      let title = ''
      if (this.mode == 'create') {
        switch (this.type.toLowerCase()) {
          case 'cls':
            title = 'Create CLS properties'
            break
          case 'ixps':
            title = 'Create IXP properties'
            break
          default:
            title = 'Edit segment properties'
            break
        }
      } else if (this.mode == 'edit') {
        switch (this.type.toLowerCase()) {
          case 'cls':
            title = 'Edit CLS properties'
            break
          case 'ixps':
            title = 'Edit IXP properties'
            break
          default:
            title = 'Edit segment properties'
            break
        }
      }
      return title
    },
    checkFields() {
      const emptyFields = Object.keys(this.form).filter(key => !this.form[key])
      return emptyFields.length && !emptyFields.includes('status')
        ? true
        : false
    },
    dark() {
      return this.$store.state.isDark
    },
    categoriesList() {
      const featureType =
        this.feature && this.feature.geometry && this.feature.geometry.type
          ? this.feature.geometry.type.toLowerCase()
          : false
      let availableCategories = []
      let args = { t: null, categories: this.categories }

      if (featureType && this.categories.length > 0) {
        switch (featureType) {
          case 'point':
            args.t = 'custom points'
            availableCategories = getCategoriesByType(args)
            break
          default:
            args.t = 'custom lines'
            availableCategories = getCategoriesByType(args)
            break
        }
      }

      return availableCategories
    }
  },
  methods: {
    handleClose() {
      if (!this.form.name || this.form.name == undefined) {
        this.form.name = this.creationForm.name
      }
      if (
        this.feature.geometry.type.toLowerCase() == 'polygon' &&
        this.form.height == 0
      ) {
        this.form.height = 1
      }
      return this.$emit('close', this.form)
    }
  }
}
</script>
