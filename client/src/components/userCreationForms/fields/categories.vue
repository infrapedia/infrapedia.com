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
          @click="toggleInput(true)"
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
            <el-row :gutter="20">
              <transition name="fade" mode="out-in" tag="div">
                <div v-if="step == 1">
                  <el-col :lg="20">
                    <el-form-item
                      label="category name"
                      class="capitalize"
                      size="mini"
                    >
                      <el-input
                        v-model="field.name"
                        :class="{ dark }"
                        size="small"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="color" class="capitalize" size="mini">
                      <el-color-picker
                        size="small"
                        :class="{ dark }"
                        v-model="field.color"
                        :predefine="predefineColors"
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
                    <el-form-item label="Types" class="capitalize" size="small">
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
          </el-card>
        </div>
      </el-collapse-transition>
      <!-- CREATION FORM END -->
    </div>
    <!-------------------------->
    <!-------------------------->
    <!-------------------------->
    <!-- CATEGORIES ITEMS START -->
    <template name="categories-items">
      <!-- EMPTY LIST START -->
      <div
        v-if="!isInputVisible && !categories.length"
        class="el-card empty-text text-center p8 no-border"
        :class="{ dark }"
      >
        <span class="fs-small">
          Categories will be shown here once you add them.
        </span>
      </div>
      <!-- EMPTY LIST END -->

      <!-------------------->
      <!-------------------->

      <div v-else>
        <div
          class="el-card round pt2 pb2 pr4 pl4 mb2"
          v-for="(cat, i) in categories"
          :key="i"
        >
          <div
            class="flex nowrap justify-content-space-between align-items-center category-box_inner-wrapper"
          >
            <div class="flex nowrap align-items-center category_name">
              <div
                :style="{ backgroundColor: cat.color }"
                class="w6 h6 circle inline-block"
              />
              <span class="capitalize ml2 font-medium fs-small">
                {{ cat.name }}
              </span>
            </div>
            <div class="buttons-wrapper">
              <el-button
                icon="el-icon-view"
                circle
                size="mini"
                :class="{ dark }"
                title="View"
                :type="isViewing(cat.name) ? 'primary' : ''"
                @click="determineView(cat.name)"
              />
              <el-button
                icon="el-icon-set-up"
                circle
                size="mini"
                :class="{ dark }"
                title="Edit items"
                @click="editCategoryTypesSelections(cat, i)"
              />
              <el-button
                icon="el-icon-edit-outline"
                circle
                size="mini"
                title="Edit"
                :class="{ dark }"
                @click="setEditMode(cat, i)"
              />
              <el-button
                icon="el-icon-delete"
                circle
                size="mini"
                title="Delete"
                :class="{ dark }"
                @click="removeCategory(i)"
              />
            </div>
          </div>
          <el-collapse-transition>
            <div class="details-wrapper" v-if="isViewing(cat.name)">
              <el-divider :class="{ dark }" class="mt2 mb4" />
              <div
                class="flex nowrap justify-content-space-between mb4 pr4 pl4"
              >
                <div class="fs-small">
                  <strong>Stroke style: </strong>
                  {{ cat['stroke-style'] }}
                </div>
                <div class=" inline-block fs-small">
                  <strong>
                    Opacity:
                  </strong>
                  {{ cat['stroke-opacity'] }}
                </div>
              </div>
              <div class="flex row wrap flex-start pl4 pr4 pb4 tags-wrapper">
                <el-tag v-for="t in cat.types" :key="t" size="mini">
                  {{ t }}
                </el-tag>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </template>
    <!-- CATEGORIES ITEMS END -->
    <!-------------------------->
    <!-------------------------->
    <!-------------------------->
    <!-- TYPES SELECTION DIALOG START -->
    <el-dialog
      top="28vh"
      :visible.sync="typesDialog.visible"
      :close-on-click-modal="false"
      :custom-class="customDialogClass"
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
            @values-change="handleTypeSelectionChange('facilities', $event)"
            :value="mode == 'create' ? [] : [...field.data.facilities]"
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
            @values-change="handleTypeSelectionChange('terrestrials', $event)"
            :value="mode == 'create' ? [] : [...field.data.terrestrials]"
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
            @values-change="handleTypeSelectionChange('subsea cables', $event)"
            :value="mode == 'create' ? [] : [...field.data['subsea cables']]"
          />
        </el-form-item>
        <el-form-item v-if="field.types.includes('cls')" label="CLS">
          <v-multi-select
            ref="cls-MultiSelect"
            :mode="mode"
            :options="typesData.cls"
            @input="loadClsSearch"
            :loading="typesData.isLoadingCls"
            @values-change="handleTypeSelectionChange('cls', $event)"
            :value="mode == 'create' ? [] : [...field.data.cls]"
          />
        </el-form-item>
        <el-form-item v-if="field.types.includes('ixps')" label="Ixps">
          <v-multi-select
            ref="ixps-MultiSelect"
            :mode="mode"
            :options="typesData.ixps"
            @input="loadIxpsSearch"
            :loading="typesData.isLoadingIxps"
            @values-change="handleTypeSelectionChange('ixps', $event)"
            :value="mode == 'create' ? [] : [...field.data.ixps]"
          />
        </el-form-item>
      </el-form>
      <footer slot="footer">
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

export default {
  name: 'CategoriesField',
  components: {
    VMultiSelect: () => import('../../../components/MultiSelect')
  },
  data: () => ({
    isInputVisible: false,
    categories: [],
    viewing: [],
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
        cls: [],
        ixps: [],
        facilities: [],
        'custom lines': [],
        'subsea cables': [],
        'custom points': [],
        'custom polygons': [],
        'terrestrial networks': []
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
    dark() {
      return this.$store.state.isDark
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    },
    predefineColors() {
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
    }
  },
  watch: {
    categories(arr) {
      bus.$emit('categories-field-values-change', arr)
    }
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
    async loadIxpsSearch(s) {
      if (s === '') return
      this.typesData.isLoadingIxps = true
      const res = await searchIxps({ user_id: await this.$auth.getUserID(), s })
      if (res && res.data) {
        this.typesData.ixps = res.data
      }
      this.typesData.isLoadingIxps = false
    },
    handleTypeSelectionChange(t, data) {
      this.field.data[t] = data
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
          cls: [],
          ixps: [],
          facilities: [],
          'custom lines': [],
          'subsea cables': [],
          'custom points': [],
          'custom polygons': [],
          'terrestrial networks': []
        }
      }
    },
    setViewing(categoryName) {
      this.viewing.push(categoryName)
    },
    removeViewing(name) {
      this.viewing = this.viewing.filter(n => n != name)
    },
    setEditMode(category, i) {
      this.field = { ...category, idx: i }
      this.mode = 'edit'
      this.isInputVisible = true
    },
    saveEdit() {
      this.categories[this.field.idx] = { ...this.field }
      this.toggleInput(false)
    },
    toggleInput(bool) {
      this.isInputVisible = bool
      this.resetField()
    },
    beforeAddCategoryAddTypesSelections() {
      return new Promise(res => {
        this.typesDialog.visible = true
        this.$on('save-types', function() {
          this.typesDialog.visible = false
          res()
        })
      }).then(this.addCategory)
    },
    editCategoryTypesSelections(...args) {
      return new Promise(res => {
        this.setEditMode(...args)
        this.typesDialog.visible = true
        this.$on('save-types', function() {
          this.typesDialog.visible = false
          res()
        })
      }).then(this.saveEdit)
    },
    async addCategory() {
      this.categories.push({ ...this.field })
      await this.toggleInput(false)
    },
    removeCategory(i) {
      this.categories.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/components/categories-field-styles.scss';
</style>
