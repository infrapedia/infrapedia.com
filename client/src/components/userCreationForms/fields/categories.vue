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
      <transition name="fade" mode="out-in" tag="div">
        <div class="mt4" v-if="isInputVisible">
          <header
            class="flex align-items-center justify-content-space-between nowrap text-left mb2 ml1"
          >
            <span class="capitalize fs-small">
              {{ mode == 'create' ? 'Add' : 'Edit' }} category settings
            </span>
            <el-button class="w14 h4 vertical-align" round type="text">
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
      </transition>
    </div>
    <template>
      <div
        v-if="!isInputVisible && !categories.length"
        class="el-card empty-text text-center p8 no-border"
        :class="{ dark }"
      >
        <span class="fs-small">
          Categories will be shown here once you add them.
        </span>
      </div>
      <div v-else>
        <div
          class="el-card round pt2 pb2 pr4 pl4 mb4 flex nowrap justify-content-space-between align-items-center"
          v-for="(cat, i) in categories"
          :key="i"
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
          <div>
            <el-button
              icon="el-icon-edit"
              circle
              size="mini"
              class="mr1"
              @click="setEditMode(cat, i)"
            />
            <el-button
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeCategory(i)"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CategoriesField',
  data: () => ({
    isInputVisible: false,
    categories: [],
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
