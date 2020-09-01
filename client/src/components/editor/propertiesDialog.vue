<template>
  <el-dialog
    :visible.sync="isVisible"
    width="20%"
    top="20vh"
    append-to-body
    :show-close="true"
    :close-on-press-escape="true"
    :close-on-click-modal="false"
    :before-close="() => handleClose(true)"
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
          clearable
          @change="handleCategorySelected"
        >
          <el-option
            v-for="(cat, i) in categoriesList"
            :key="i"
            :value="cat._id"
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
        <el-form-item
          label="Height (Meters)"
          v-if="feature.geometry.type == 'Polygon'"
        >
          <el-input-number
            class="w-fit-full"
            controls-position="right"
            v-model="form.height"
          />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="() => handleClose(false)">
        Save
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCategoriesByType } from '../../helpers'
import { categoriesDictionary } from '../userCreationForms/fields/dictionary'

export default {
  name: 'PropertiesDialog',
  data: () => ({
    form: {},
    categorySelected: null,
    predefineColors: [
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#90ee90',
      '#00ced1',
      '#1e90ff'
    ],
    categoriesList: []
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
      if (bool) {
        const type = this.feature.geometry.type
        if (this.type == 'map') this.loadCategories()
        else this.categoriesList = []

        if (this.mode != 'create') {
          this.form = { ...this.feature.properties }
          if (
            this.type == 'map' &&
            this.form.category &&
            typeof this.form.category != 'string'
          ) {
            this.form.category = this.feature.properties.category._id
          }
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
      } else {
        this.form = {}
        this.categoriesList = []
        this.categorySelected = null
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
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    handleCategorySelected(id) {
      if (this.type != 'map') return

      const categoryData = this.categoriesList.filter(t => t._id == id)[0]
      if (categoryData) {
        this.categorySelected = {
          category: categoryData._id,
          color: categoryData.color,
          'stroke-width': categoryData['stroke-width'],
          'stroke-opacity': categoryData['stroke-opacity']
        }

        if (
          categoryData['stroke-style'] != 'normal' &&
          this.feature.geometry.type == 'LineString'
        ) {
          this.categorySelected['line-dasharray'] = [0.1, 1.8]
        }
      } else {
        this.categorySelected = null
        let keys = [
          'color',
          'category',
          'stroke-width',
          'stroke-opacity',
          'line-dasharray'
        ]

        for (let key of keys) {
          if (this.form[key]) {
            delete this.form[key]
          }
        }
      }
    },
    loadCategories() {
      const featureType =
        this.feature && this.feature.geometry && this.feature.geometry.type
          ? this.feature.geometry.type.toLowerCase()
          : false
      let availableCategories = []
      let args = { t: null, categories: categoriesDictionary.getRaw() }

      if (featureType && categoriesDictionary.getLength() > 0) {
        switch (featureType) {
          case 'point':
            args.t = 'custom points'
            availableCategories = getCategoriesByType(args)
            break
          case 'polygon':
            args.t = 'custom polygons'
            availableCategories = getCategoriesByType(args)
            break
          default:
            args.t = 'custom lines'
            availableCategories = getCategoriesByType(args)
            break
        }
      }

      this.categoriesList = availableCategories
    },
    handleClose(cancel) {
      if (!cancel) {
        if (!this.form.name || this.form.name == undefined) {
          this.form.name = this.creationForm.name
        }

        if (
          this.feature.geometry.type.toLowerCase() == 'polygon' &&
          this.form.height == 0
        ) {
          this.form.height = 1
        }

        if (this.type == 'map' && this.categorySelected) {
          this.form = {
            ...this.form,
            ...this.categorySelected
          }
        }

        return this.$emit('close', { ...this.form })
      }

      return this.$emit('close', false)
    }
  }
}
</script>
