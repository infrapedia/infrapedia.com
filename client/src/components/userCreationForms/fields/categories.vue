<template>
  <div class="main-wrapper no-selectable">
    <div class="el-form-item" :class="{ dark }">
      <header
        class="flex row nowrap justify-content-space-between align-items-center"
      >
        <span class="el-form-item_label fs-regular">
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
    <template>
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

      <!-- CATEGORIES ITEMS START -->
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
                :type="isViewing(cat.name) ? 'primary' : ''"
                @click="determineView(cat.name)"
              />
              <el-button
                icon="el-icon-edit-outline"
                circle
                size="mini"
                :class="{ dark }"
                @click="setEditMode(cat, i)"
              />
              <el-button
                icon="el-icon-delete"
                circle
                size="mini"
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
              <div class="flex row flex-start pl4 pr4 pb4 tags-wrapper">
                <el-tag v-for="t in cat.types" :key="t" size="mini">
                  {{ t }}
                </el-tag>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
      <!-- CATEGORIES ITEMS END -->
    </template>
  </div>
</template>

<script>
import { bus } from '../../../helpers/eventBus'

export default {
  name: 'CategoriesField',
  data: () => ({
    isInputVisible: false,
    categories: [],
    viewing: [],
    mode: 'create',
    step: 1,
    field: {
      name: '',
      types: [],
      color: '#409EFF',
      'stroke-width': 1,
      'stroke-opacity': 1,
      'stroke-style': 'normal'
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
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
        'facility',
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
        ? this.addCategory
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
        'stroke-style': 'normal'
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
    addCategory() {
      this.categories.push({ ...this.field })
      this.toggleInput(false)
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
