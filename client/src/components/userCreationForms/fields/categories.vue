<template>
  <div class="main-wrapper">
    <div class="el-form-item" :class="{ dark }">
      <header
        class="flex row nowrap justify-content-space-between align-items-center"
      >
        <span class="el-form-item_label fs-regular no-selectable">
          Categories
        </span>
        <el-button
          v-if="!isInputVisible"
          round
          size="small"
          class="w14 h8"
          :class="{ dark }"
          @click="handleBeforeCreateCategory"
        >
          Add
        </el-button>
      </header>
      <!-- CREATION FORM START -->
      <el-collapse-transition>
        <div class="mt4" v-if="isInputVisible">
          <header
            class="flex align-items-center justify-content-space-between nowrap text-left mb2 ml1"
          >
            <span class="capitalize fs-small">
              {{ mode == 'create' ? 'Add' : 'Edit' }} category settings
            </span>
            <el-button
              class="w14 h4 vertical-align"
              round
              type="text"
              @click="toggleInput(false)"
            >
              Cancel
            </el-button>
          </header>
          <el-card shadow="never" class="p4" :class="{ dark }">
            <el-form ref="categories-form" :model="field" :rules="formRules">
              <el-row :gutter="20">
                <transition name="fade" mode="out-in" tag="div">
                  <div v-if="step == 1">
                    <el-col :lg="20">
                      <el-form-item
                        label="category name"
                        class="capitalize"
                        prop="name"
                        size="mini"
                      >
                        <el-input
                          ref="categoryNameInput"
                          v-model="field.name"
                          :class="{ dark }"
                          size="small"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item
                        label="color"
                        prop="color"
                        class="capitalize"
                        size="mini"
                      >
                        <el-color-picker
                          size="small"
                          :class="{ dark }"
                          v-model="field.color"
                          :predefine="predefinedColors"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item
                        label="opacity"
                        class="capitalize"
                        size="small"
                      >
                        <el-input-number
                          class="w14"
                          :controls="false"
                          :class="{ dark }"
                          size="small"
                          v-model="field['stroke-width']"
                          :min="0.1"
                          :max="1"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item
                        label="stroke style"
                        class="capitalize flex column nowrap align-items-start"
                        size="small"
                      >
                        <el-radio-group
                          v-model="field['stroke-style']"
                          size="small"
                          :class="{ dark }"
                        >
                          <el-radio-button label="normal" class="capitalize" />
                          <el-radio-button label="dashed" class="capitalize" />
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </div>
                </transition>
                <transition name="fade" mode="out-in" tag="div">
                  <div v-if="step == 2">
                    <el-col :span="24">
                      <el-form-item
                        label="Types"
                        prop="types"
                        class="capitalize"
                        size="small"
                      >
                        <el-select
                          v-model="field.types"
                          collapse-tags
                          placeholder
                          class="w-fit-full"
                          :class="{ dark }"
                          multiple
                          size="small"
                          clearable
                          filter
                        >
                          <el-option
                            v-for="opt in typesAvailable"
                            :key="opt"
                            class="capitalize"
                            :label="opt"
                            :value="opt"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </div>
                </transition>
              </el-row>
              <footer class="flo-right mt6">
                <el-button
                  class="capitalize mr2"
                  :disabled="step != 2"
                  :class="{ dark }"
                  size="mini"
                  round
                  :plain="dark"
                  @click="back"
                >
                  back
                </el-button>
                <el-button
                  type="primary"
                  class="capitalize"
                  :class="{ dark }"
                  size="mini"
                  round
                  @click="determineFunc"
                >
                  {{ step == 1 ? 'next' : 'save' }}
                </el-button>
              </footer>
            </el-form>
          </el-card>
        </div>
      </el-collapse-transition>
      <!-- CREATION FORM END -->
    </div>
    <!-- CATEGORIES ITEMS START -->
    <template name="categories-items">
      <!-- EMPTY LIST START -->
      <div
        v-if="isCategoriesEmpty"
        class="el-card empty-text text-center p8 no-border"
        :class="{ dark }"
      >
        <span class="fs-small">
          Categories will be shown here once you add them.
        </span>
      </div>
      <!-- EMPTY LIST END -->
      <!-------------------->

      <div v-else>
        <div
          class="el-card round pt2 pb2 pr4 pl4 mb2"
          v-for="(item, id) in dictionary.getRaw()"
          :key="id"
        >
          <div
            class="flex nowrap justify-content-space-between align-items-center category-box_inner-wrapper"
          >
            <div class="flex nowrap align-items-center category_name">
              <div
                :style="{ backgroundColor: item.color }"
                class="w6 h6 circle inline-block"
              />
              <span class="text-left capitalize ml2 font-medium fs-small">
                {{ item.name }}
              </span>
            </div>
            <div class="buttons-wrapper">
              <el-button
                icon="el-icon-view"
                circle
                size="mini"
                :class="{ dark }"
                title="View"
                :type="isViewing(item.name) ? 'primary' : ''"
                @click="determineView(item.name)"
              />
              <el-button
                icon="el-icon-set-up"
                circle
                size="mini"
                :class="{ dark }"
                title="Edit items"
                @click="editCategoryTypesSelections(id, false)"
              />
              <el-button
                icon="el-icon-edit-outline"
                circle
                size="mini"
                title="Edit"
                :class="{ dark }"
                @click="setEditMode(id, true)"
              />
              <el-button
                icon="el-icon-delete"
                circle
                size="mini"
                title="Delete"
                :class="{ dark }"
                @click="removeCategory(id)"
              />
            </div>
          </div>
          <el-collapse-transition>
            <div class="details-wrapper" v-if="isViewing(item.name)">
              <el-divider :class="{ dark }" class="mt2 mb4" />
              <div class="fs-small block text-left pr4 pl4 mb2">
                <strong>id: </strong>
                {{ id }}
              </div>
              <div
                class="flex nowrap justify-content-space-between mb4 pr4 pl4"
              >
                <div class="fs-small">
                  <strong>Stroke style: </strong>
                  {{ item['stroke-style'] }}
                </div>
                <div class=" inline-block fs-small">
                  <strong>
                    Opacity:
                  </strong>
                  {{ item['stroke-opacity'] }}
                </div>
              </div>
              <div class="flex row wrap flex-start pl4 pr4 pb4 tags-wrapper">
                <el-tag v-for="t in item.types" :key="t" size="mini">
                  {{ t }}
                </el-tag>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </template>
    <!-- CATEGORIES ITEMS END -->
    <!-- TYPES SELECTION DIALOG START -->
    <el-dialog
      top="28vh"
      id="elementsDialog"
      :visible.sync="typesDialog.visible"
      :close-on-click-modal="false"
      :custom-class="customDialogClass"
      @opened="handleScrollToView"
      :before-close="() => $emit('cancel-types-selection')"
    >
      <header slot="title">
        <h2 class="title-user-variant  fs-medium text-left">
          Select the elements you want to include in this category
        </h2>
      </header>
      <el-form>
        <el-form-item
          v-if="field.types.includes('facilities')"
          label="Facilities"
        >
          <v-multi-select
            ref="facilities-MultiSelect"
            :mode="mode"
            :options="typesData.facilities"
            @input="loadFacSearch"
            :loading="typesData.isLoadingFacs"
            @remove="handleRemoveTypeChange('facilities', $event)"
            @values-change="handleTypeSelectionChange('facilities', $event)"
            :value="
              mode == 'create' ? [] : getTypeSelectionsAsArray('facilities')
            "
          />
        </el-form-item>
        <el-form-item
          v-if="field.types.includes('terrestrial networks')"
          label="Terrestrial Networks"
        >
          <v-multi-select
            ref="terrestrials-MultiSelect"
            :mode="mode"
            :options="typesData.terrestrials"
            @input="loadCablesSearch($event, 'terrestrials')"
            :loading="typesData.isLoadingCables"
            @remove="handleRemoveTypeChange('terrestrial networks', $event)"
            @values-change="
              handleTypeSelectionChange('terrestrial networks', $event)
            "
            :value="
              mode == 'create'
                ? []
                : getTypeSelectionsAsArray('terrestrial networks')
            "
          />
        </el-form-item>
        <el-form-item
          v-if="field.types.includes('subsea cables')"
          label="Subsea Cables"
        >
          <v-multi-select
            ref="subsea-MultiSelect"
            :mode="mode"
            :options="typesData.subsea"
            @input="loadCablesSearch($event)"
            :loading="typesData.isLoadingCables"
            @remove="handleRemoveTypeChange('subsea cables', $event)"
            @values-change="handleTypeSelectionChange('subsea cables', $event)"
            :value="
              mode == 'create' ? [] : getTypeSelectionsAsArray('subsea cables')
            "
          />
        </el-form-item>
        <el-form-item v-if="field.types.includes('cls')" label="CLS">
          <v-multi-select
            ref="cls-MultiSelect"
            :mode="mode"
            :options="typesData.cls"
            @input="loadClsSearch"
            :loading="typesData.isLoadingCls"
            @remove="handleRemoveTypeChange('cls', $event)"
            @values-change="handleTypeSelectionChange('cls', $event)"
            :value="mode == 'create' ? [] : getTypeSelectionsAsArray('cls')"
          />
        </el-form-item>
        <el-form-item v-if="field.types.includes('ixps')" label="Ixps">
          <v-multi-select
            ref="ixps-MultiSelect"
            :mode="mode"
            :options="typesData.ixps"
            @input="loadIxpsSearch"
            :loading="typesData.isLoadingIxps"
            @remove="handleRemoveTypeChange('ixps', $event)"
            @values-change="handleTypeSelectionChange('ixps', $event)"
            :value="mode == 'create' ? [] : getTypeSelectionsAsArray('ixps')"
          />
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button
          round
          plain
          class="mr2"
          @click="() => $emit('cancel-types-selection')"
        >
          Cancel
        </el-button>
        <el-button round type="primary" @click="() => $emit('save-types')">
          Save
        </el-button>
      </footer>
    </el-dialog>
    <!-- TYPES SELECTION DIALOG END -->
  </div>
</template>

<script>
import { bus } from '../../../helpers/eventBus'
import { searchFacilities } from '../../../services/api/facs'
import {
  getSearchByCablesT,
  getSearchByCablesS
} from '../../../services/api/cables'
import { searchIxps } from '../../../services/api/ixps'
import { searchCls } from '../../../services/api/cls'
import { categoriesDictionary } from './dictionary'

export default {
  name: 'CategoriesField',
  components: {
    VMultiSelect: () => import('../../MultiSelect')
  },
  props: {
    value: {
      type: [Array, Boolean],
      default: () => false
    }
  },
  data: () => ({
    isInputVisible: false,
    viewing: [],
    dictionary: {},
    typesDialog: {
      visible: false
    },
    mode: 'create',
    step: 1,
    field: {
      name: '',
      types: [],
      color: '#409EFF',
      'stroke-width': 1,
      'stroke-opacity': 1,
      'stroke-style': 'normal',
      data: {
        cls: {},
        ixps: {},
        facilities: {},
        'custom lines': {},
        'subsea cables': {},
        'custom points': {},
        'custom polygons': {},
        'terrestrial networks': {}
      }
    },
    typesData: {
      cls: [],
      ixps: [],
      subsea: [],
      facilities: [],
      terrestrials: [],
      isLoadingCls: false,
      isLoadingIxps: false,
      isLoadingFacs: false,
      isLoadingCables: false
    }
  }),
  computed: {
    isCategoriesEmpty() {
      return !this.isInputVisible && !this.dictionary.getLength() > 0
    },
    includesDrawnFeatures() {
      return (
        this.field.types.includes('custom points') ||
        this.field.types.includes('custom polygons') ||
        this.field.types.includes('custom lines')
      )
    },
    dark() {
      return this.$store.state.isDark
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    },
    predefinedColors() {
      return [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ]
    },
    typesAvailable() {
      return [
        'cls',
        'ixps',
        'facilities',
        'subsea cables',
        'terrestrial networks',
        'custom lines',
        'custom points',
        'custom polygons'
      ]
    },
    nonCustomTypes() {
      return [
        'cls',
        'ixps',
        'facilities',
        'subsea cables',
        'terrestrial networks'
      ]
    },
    determineFunc() {
      return this.step == 1
        ? this.nextStep
        : this.mode == 'create'
        ? this.beforeAddCategoryAddTypesSelections
        : this.saveEdit
    },
    determineView() {
      return name => {
        return this.viewing.includes(name)
          ? this.removeViewing(name)
          : this.setViewing(name)
      }
    },
    isViewing() {
      return name => this.viewing.includes(name)
    },
    getTypeSelectionsAsArray() {
      return function getCategorySelections(t) {
        let r = []
        for (let key in this.field.data[t]) {
          r.push({
            _id: key,
            ...this.field.data[t][key]
          })
        }
        return r
      }
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            message: 'Please input a category name',
            trigger: 'blur'
          }
        ],
        color: [
          {
            required: true,
            message: 'A color is required',
            trigger: ['blur', 'change']
          }
        ],
        types: [
          {
            type: 'array',
            required: true,
            message: 'Please select at least one type',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  watch: {
    value(categories) {
      let once = false
      let vm = this
      function x() {
        if (once) return
        try {
          vm.dictionary.set(categories)
        } catch (err) {
          console.error(err)
        }
        once = true
      }
      x()
    }
  },
  created() {
    bus.$on(
      'categories-field-reset-datasets',
      this.handleCategoriesResetDataset
    )
    this.dictionary = categoriesDictionary
  },
  beforeDestroy() {
    bus.$off(
      'categories-field-reset-datasets',
      this.handleCategoriesResetDataset
    )
  },
  methods: {
    /**
     * @param s { String } - search queried from facilities select input
     */
    async loadFacSearch(s) {
      if (s === '') return
      this.typesData.isLoadingFacs = true
      const res = await searchFacilities({
        user_id: await this.$auth.getUserID(),
        s
      })
      if (res && res.data) {
        this.typesData.facilities = res.data
      }
      this.typesData.isLoadingFacs = false
    },
    /**
     * @param s { String } - search queried from cables select input
     */
    async loadCablesSearch(s, type) {
      if (s === '') return
      this.typesData.isLoadingCables = true
      let method = () => {}
      switch (type) {
        case 'terrestrials':
          method = getSearchByCablesT
          break
        default:
          method = getSearchByCablesS
          break
      }
      const { data = [] } = (await method({
        user_id: await this.$auth.getUserID(),
        s
      })) || { data: [] }

      if (type == 'terrestrials') this.typesData.terrestrials = data
      else this.typesData.subsea = data

      this.typesData.isLoadingCables = false
    },
    /**
     * @param s { String } - search queried from cls select input
     */
    async loadClsSearch(s) {
      if (s === '') return
      this.typesData.isLoadingCls = true
      const res = await searchCls({ user_id: await this.$auth.getUserID(), s })
      if (res && res.data) {
        this.typesData.cls = res.data
      }
      this.typesData.isLoadingCls = false
    },
    /**
     * @param s { String } - search queried from ixps select input
     */
    async loadIxpsSearch(s) {
      if (s === '') return
      this.typesData.isLoadingIxps = true
      const res = await searchIxps({ user_id: await this.$auth.getUserID(), s })
      if (res && res.data) {
        this.typesData.ixps = res.data
      }
      this.typesData.isLoadingIxps = false
    },
    handleScrollToView() {
      document
        .querySelector('#elementsDialog .el-dialog')
        .scrollIntoView({ behavior: 'smooth', block: 'end' })
    },
    scrollIntoView() {
      setTimeout(() => {
        document
          .getElementById('mapFormWrapper')
          .scrollIntoView({ behavior: 'smooth', block: 'end' })
        this.$refs.categoryNameInput.focus()
      }, 270)
    },
    handleBeforeCreateCategory() {
      this.toggleInput(true)
      this.scrollIntoView()
    },
    /**
     * @param t { String } - selection type
     * @param _id { String } - ID of item removed
     */
    handleRemoveTypeChange(t, _id) {
      delete this.field.data[t][_id]
    },
    /**
     * @param t { String } - selection type
     * @param data { String } - Elements selected
     */
    handleTypeSelectionChange(t, data) {
      let r = {}
      for (let item of data) {
        r[item._id] = item
      }
      this.field.data[t] = r
    },
    nextStep() {
      this.step += 1
    },
    back() {
      if (this.step <= 1) return
      this.step -= 1
    },
    resetField() {
      this.mode = 'create'
      this.step = 1
      this.field = {
        name: '',
        types: [],
        color: '#409EFF',
        'stroke-width': 1,
        'stroke-opacity': 1,
        'stroke-style': 'normal',
        data: {
          cls: {},
          ixps: {},
          facilities: {},
          'custom lines': {},
          'subsea cables': {},
          'custom points': {},
          'custom polygons': {},
          'terrestrial networks': {}
        }
      }
    },
    setViewing(categoryName) {
      this.viewing.push(categoryName)
    },
    removeViewing(name) {
      this.viewing = this.viewing.filter(n => n != name)
    },
    setEditMode(categoryID, scrollToView) {
      const category = categoriesDictionary.get(categoryID)
      if (category) {
        this.field = { ...JSON.parse(JSON.stringify(category)) }
        this.mode = 'edit'
        this.isInputVisible = true
        if (scrollToView) this.scrollIntoView()
      }
    },
    handleCategoriesResetDataset() {
      const categories = this.dictionary.getRaw()
      let data = {
        cls: {},
        ixps: {},
        facilities: {},
        'custom lines': {},
        'subsea cables': {},
        'custom points': {},
        'custom polygons': {},
        'terrestrial networks': {}
      }

      for (let id in categories) {
        let item = this.dictionary.get(id)
        this.dictionary.update(id, {
          ...item,
          data
        })
      }
    },
    saveEdit() {
      this.dictionary.update(this.field._id, this.field)
      this.toggleInput(false)
    },
    toggleInput(bool) {
      this.isInputVisible = bool
      this.resetField()
    },
    checkFieldTypes(arr) {
      return arr.some(type => this.field.types.includes(type))
    },
    beforeAddCategoryAddTypesSelections() {
      this.$refs['categories-form'].validate(valid => {
        if (!valid) return

        if (this.checkFieldTypes(this.nonCustomTypes)) {
          return new Promise((res, rej) => {
            this.typesDialog.visible = true
            this.$once('save-types', function() {
              this.typesDialog.visible = false
              res()
            })
            this.$once('cancel-types-selection', function() {
              this.typesDialog.visible = false
              rej()
            })
          })
            .then(this.addCategory)
            .catch(() => {})
        } else if (this.includesDrawnFeatures) this.addCategory()
      })
    },
    /**
     * @param args { Array } - Array of args. Same as setEditMode(category, scrollToView)
     */
    editCategoryTypesSelections(...args) {
      return new Promise((res, rej) => {
        this.setEditMode(...args)
        this.nextStep()
        this.typesDialog.visible = true
        this.$once('save-types', function() {
          this.typesDialog.visible = false
          res()
        })
        this.$once('cancel-types-selection', function() {
          this.toggleInput(false)
          this.typesDialog.visible = false
          rej()
        })
      })
        .then(this.saveEdit)
        .catch(() => {})
    },
    addCategory() {
      if (this.field.name && this.field.name !== '') {
        let id = `${this.field.name}.${Date.now()}`
        this.dictionary.add(id, {
          ...this.field,
          _id: id
        })
      }
      this.toggleInput(false)
    },
    removeCategory(_id) {
      this.dictionary.remove(_id)
      bus.$emit('category-removed', _id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/components/categories-field-styles.scss';
</style>
