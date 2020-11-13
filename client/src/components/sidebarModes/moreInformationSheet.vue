<template>
  <transition
    tag="div"
    mode="out-in"
    name="animated faster3x"
    enter-active-class="slideInUp"
    leave-active-class="slideOutDown"
  >
    <div
      v-if="isVisible"
      class="el-drawer overflow-y-auto"
      :class="{ dark, light: !dark }"
      aria-labelledby="el-drawer-title"
      aria-label="More Information"
      role="dialog"
      tabindex="-1"
    >
      <div class="relative">
        <header
          id="el-drawer-title"
          class="flex justify-content-space-between pl8 pr8 pt7 pb2"
          :class="{ dark, light: !dark }"
        >
          <span role="heading" tabindex="0" title="I am the title">
            More Information
          </span>
          <el-button
            circle
            :class="{ dark }"
            aria-label="close more information"
            class="no-border mt-3"
            icon="el-icon-close"
            @click="handleClose"
          />
        </header>
        <el-divider class="transparent mt2 mb2" />
        <div class="drawer-body pl8 pr8">
          <div v-for="(item, i) in valuesToShow" :key="i">
            <template v-if="info[item.value]">
              <small> {{ item.label }} - </small>
              <span class="fs-small inline-block">
                <template
                  v-if="
                    typeof info[item.value] != 'string' &&
                      typeof info[item.value] != 'number'
                  "
                >
                  normally:
                  {{ info[item.value].value }} / variant:
                  {{ info[item.value].variant }} </template
                ><template v-else>{{ info[item.value] }}</template>
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  facilitiesBuildingDetailsColumns,
  facilitiesPowerAndCoolingDetailsColumns,
  facilitiesSecurityAndOnsiteServicesColumns
} from '../../config/columns'

export default {
  name: 'MoreInformationSheet',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    info() {
      return this.$store.state.map.currentSelection
    },
    valuesToShow() {
      return [
        ...facilitiesSecurityAndOnsiteServicesColumns,
        ...facilitiesBuildingDetailsColumns,
        ...facilitiesPowerAndCoolingDetailsColumns
      ]
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/more-information-sheet-styles.scss';
</style>
