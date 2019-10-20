<template>
  <div class="filter-btn-wrapper" :class="{ dark, light: !dark }">
    <el-popover
      :visible-arrow="false"
      placement="bottom-end"
      width="320"
      trigger="manual"
      transition="el-zoom-in-top"
      v-model="isMenuFilter"
    >
      <div class="p0">
        <header
          class="header no-selectable h8 flex justify-content-space-between pr7 pl6 pt2 pb2 align-items-center"
          :class="{ dark, light: !dark }"
        >
          <span class="sm-icon">
            <fa :icon="['fas', 'filter']" class="mr2" />
            <strong class="fs-mdlarge">Filters</strong>
          </span>
          <span class="fs-mdlarge cursor-pointer" @click="toggleFilterVisiblity">
            <fa :icon="['fas', 'times']" />
          </span>
        </header>
        <ul class="filters-wraper">
          <li class="pb4 pt6 pr4 pl4 flex justify-content-space-between">
            <label for="subseaonly">Subsea only</label>
            <el-switch
              name="subseaonly"
              v-model="filters.isSubseaOnly"
              :active-color="colorBaseOnThemeState"
            />
          </li>
          <el-divider class="m0" />
          <li class="flex justify-content-space-between pt10 pb10 pr4 pl4">
            <div class="flex column">
              <label for="activeonly">Active only</label>
              <label for="futureonly" class="mt8">Future only</label>
            </div>
            <el-radio-group
              v-model="filters.radio"
              size="medium"
              fill="red"
              @change="handleRadioSelection"
              class="flex column"
            >
              <el-radio :label="0" name="activeonly" class="mr1">{{'' + ''}}</el-radio>
              <el-radio :label="1" name="futureonly" class="mt9">{{'' + ''}}</el-radio>
            </el-radio-group>
          </li>
          <el-divider class="m0" />
          <li class="p4">
            <header class="flex justify-content-space-between pb14 pr4 pl-1">
              <label for="timemachine">Subsea time machine</label>
              <el-checkbox name="timemachine" v-model="filters.isTimeMachineActive" />
            </header>
            <div class="w-fit-full vertical-align pb5">
              <span class="mr5">{{ minYears }}</span>
              <el-slider
                style="width: 55%"
                :disabled="!filters.isTimeMachineActive"
                :min="minYears"
                :max="maxYears"
                v-model="filters.year"
                @change="updateTimeMachineYear"
              />
              <span class="ml5">{{ maxYears }}</span>
            </div>
          </li>
        </ul>
      </div>
      <el-button
        type="warning"
        slot="reference"
        class="circle w7 h7 p0 vertical-align"
        @click="toggleFilterVisiblity"
      >
        <fa :icon="['fas', 'filter']" class="xsm-icon" />
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'IFilter',
  data: () => ({
    isMenuFilter: false,
    filters: {
      isSubseaOnly: false,
      isTimeMachineActive: false,
      radio: '',
      year: new Date().getFullYear()
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    colorBaseOnThemeState() {
      return this.dark ? '#f7dc82' : '#f3c52c'
    },
    minYears() {
      return new Date().getFullYear()
    },
    maxYears() {
      const estimateMaxYearsUntilNoCables = 31
      return new Date().getFullYear() + estimateMaxYearsUntilNoCables
    }
  },
  methods: {
    toggleFilterVisiblity() {
      this.isMenuFilter = !this.isMenuFilter
    },
    handleRadioSelection(selection) {
      return selection === 0 ? console.log('active') : console.log('future')
    },
    updateTimeMachineYear(year) {
      console.warn(year, 'not done')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/filter-styles.scss';
</style>
