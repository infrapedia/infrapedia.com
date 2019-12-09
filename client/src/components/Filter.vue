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
          <span
            class="fs-mdlarge cursor-pointer"
            @click="toggleFilterVisiblity"
          >
            <fa :icon="['fas', 'times']" />
          </span>
        </header>
        <ul class="filters-wrapper" :class="{ dark, light: !dark }">
          <li class="pb4 pt6 pr4 pl4 flex justify-content-space-between">
            <label for="subseaonly">Subsea only</label>
            <el-switch
              name="subseaonly"
              v-model="filters.isSubseaOnly"
              :active-color="colorBaseOnThemeState"
              @change="emitSubseaSelection"
            />
          </li>
          <el-divider class="m0" />
          <li class="flex justify-content-space-between pt10 pb10 pr4 pl4">
            <div class="flex column">
              <label for="activeonly">Active only</label>
              <label for="futureonly" class="mt8">Future only</label>
            </div>
            <div
              class="el-checkbox-group flex column radio"
              role="group"
              aria-label="checkbox-group"
              id="radio-like-wrapper"
            >
              <el-checkbox
                class="mr1"
                v-model="filters.radio"
                :true-label="0"
                :false-label="'no-active'"
                @change="emitRadioSelection"
                >{{ '' + '' }}</el-checkbox
              >
              <el-checkbox
                class="mt9"
                v-model="filters.radio"
                :true-label="1"
                :false-label="'no-future'"
                @change="emitRadioSelection"
                >{{ '' + '' }}</el-checkbox
              >
            </div>
          </li>
          <el-divider class="m0" />
          <li class="p4">
            <header class="flex justify-content-space-between pb14 pr4 pl-1">
              <label for="timemachine">Subsea time machine</label>
              <el-checkbox
                name="timemachine"
                v-model="filters.isTimeMachineActive"
                @change="emitTimeMachineSelection"
              />
            </header>
            <div class="w-fit-full vertical-align pb5">
              <span class="mr5">{{ minYears }}</span>
              <el-slider
                style="width: 55%"
                :disabled="!filters.isTimeMachineActive"
                :min="minYears"
                :max="maxYears"
                v-model="filters.year"
                @change="emitTimeMachineYear"
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
        @click.stop="toggleFilterVisiblity"
      >
        <fa :icon="['fas', 'filter']" class="xsm-icon" />
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { bus } from '../helpers/eventBus'
import {
  TOGGLE_FILTER_SELECTION,
  UPDATE_TIME_MACHINE,
  SUBSEA_FILTER
} from '../events/filter'
import currentYear from '../helpers/currentYear'

export default {
  name: 'IFilter',
  data: () => ({
    isMenuFilter: false,
    filters: {
      isSubseaOnly: false,
      isTimeMachineActive: false,
      radio: '',
      year: currentYear()
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
      return currentYear()
    },
    maxYears() {
      const estimateMaxYearsUntilNoCables = 31
      return currentYear() + estimateMaxYearsUntilNoCables
    }
  },
  async mounted() {
    document.addEventListener('click', this.closeMenu)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeMenu)
  },
  methods: {
    closeMenu() {
      this.isMenuFilter = false
    },
    toggleFilterVisiblity() {
      this.isMenuFilter = !this.isMenuFilter
      if (this.isMenuFilter) this.$emit('open')
    },
    /**
     * @param isSubseaOnly { Boolean }
     */
    emitSubseaSelection(isSubseaOnly) {
      // Other filters cannot be active
      if (this.filters.isTimeMachineActive) {
        this.filters.isTimeMachineActive = false
      }

      return bus.$emit(`${SUBSEA_FILTER}`, { bool: isSubseaOnly, isActive: this.filters.radio === 0 })
    },
    /**
     * @param selection { Boolean }
     */
    emitRadioSelection(selection) {
      // console.log(selection)
      if ((selection === 'no-active' || selection === 'no-future') && !this.filters.isSubseaOnly) {
        return bus.$emit(`${TOGGLE_FILTER_SELECTION}`, -1)
      } else if ((selection === 'no-active' || selection === 'no-future') && this.filters.isSubseaOnly) {
        return bus.$emit(`${TOGGLE_FILTER_SELECTION}`, 3)
      }
      // Subsea filter cannot be active
      if (this.filters.isTimeMachineActive) {
        this.filters.isTimeMachineActive = false
        // this.filters.isSubseaOnly = false
      }

      if (this.filters.isSubseaOnly) {
        return bus.$emit(`${TOGGLE_FILTER_SELECTION}`, 2)
      }

      console.log(selection)
      bus.$emit(`${TOGGLE_FILTER_SELECTION}`, selection)
    },
    /**
     * @param isTimeMachineActive { Boolean }
     */
    emitTimeMachineSelection(isTimeMachineActive) {
      // Other filters cannot be active
      if (this.filters.radio !== '' || this.filters.isSubseaOnly) {
        this.filters.radio = ''
        this.filters.isSubseaOnly = false
      }

      return bus.$emit(
        `${UPDATE_TIME_MACHINE}`,
        isTimeMachineActive ? { year: this.filters.year, isActive: false } : { year: 0, isActive: this.filters.radio === 0 }
      )
    },
    /**
     * @param year { Number } Year selected with the slider
     */
    emitTimeMachineYear(year) {
      return bus.$emit(`${UPDATE_TIME_MACHINE}`, { year, isActive: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/filter-styles.scss';
</style>
