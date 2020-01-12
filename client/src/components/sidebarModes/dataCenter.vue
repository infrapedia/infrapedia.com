<template>
  <div class="pr8 pl8 pt2 pb8">
    <template>
      <div v-for="(col, i) in columns" :key="i">
        <el-row :gutter="20" v-if="info[col.value]">
          <el-col :span="10" class="p2">
            <p class="label capitalize">{{ col.label }}</p>
          </el-col>
          <el-col :span="12" class="p2">
            <p class="text-bold">{{ info[col.value] }}</p>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-divider />
    <footer class="p0">
      <el-row :gutter="20">
        <el-col :sx="24" :md="12">
          <el-popover
            placement="bottom"
            width="100"
            popper-class="buy-capacity-popper"
            :visible-arrow="false"
            trigger="manual"
            v-model="isMenuOpen"
          >
            <el-card shadow="never" class>
              <ul role="list" class="pt2 pb2">
                <li
                  v-for="(option, i) in buyOptions"
                  :key="i"
                  tabindex="1"
                  role="listitem"
                  class="p4 no-selectable transition cursor-pointer seamless-hoverbg no-outline"
                  :class="{ dark, light: !dark }"
                  @click="emitEvent(option)"
                  v-text="option"
                />
              </ul>
            </el-card>
            <div
              slot="reference"
              @click="toggleMenu"
              class="cursor-pointer no-outline no-selectable"
            >
              <el-button type="warning" circle class="mr1 w9 h9 vertical-align">
                <fa :icon="['fas', 'cart-plus']" class="sm-icon mt-1" />
              </el-button>
              <span class="cursor-pointer fs-regular label">Buy capacity</span>
            </div>
          </el-popover>
        </el-col>
        <el-col :sx="24" :md="12">
          <div
            class="cursor-pointer no-selectable"
            @click="$emit(REPORT_ISSUE)"
          >
            <el-button type="warning" circle class="mr1 w9 h9 vertical-align">
              <fa :icon="['fas', 'exclamation-circle']" class="sm-icon mt-1" />
            </el-button>
            <span class="cursor-pointer fs-regular label">Report issue</span>
          </div>
        </el-col>
      </el-row>
    </footer>
  </div>
</template>

<script>
import { BUY_CAPACITY, REPORT_ISSUE } from '../../events/sidebar'

export default {
  name: 'IDataCenter',
  props: {
    info: {
      type: Object,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    BUY_CAPACITY,
    REPORT_ISSUE,
    buyOptions: ['Transit', 'Backbone', 'Datacenter', 'Other'],
    isMenuOpen: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    emitEvent(option) {
      this.toggleMenu()
      this.$emit(`${BUY_CAPACITY}`, option)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/data-center-styles.scss';
</style>
