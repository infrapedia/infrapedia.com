<template>
  <div class="pr8 pl8 pt2 pb8">
    <template>
      <div v-for="(col, i) in facColumns" :key="i">
        <el-row :gutter="20" v-if="info[col.value] && col.showSidebar">
          <template
            v-if="
              col.label.includes('org') ||
                col.label.includes('networks') ||
                col.label.includes('cables')
            "
          >
            <el-divider class="m0 mt2 mb2" />
            <el-col :span="20" class="p2">
              <p class="label capitalize">{{ col.label }}</p>
            </el-col>
          </template>
          <template v-else-if="col.label.includes('url')">
            <el-col :span="20" class="p2">
              <small>
                <p class="m0 capitalize">
                  More information:
                </p>
              </small>
            </el-col>
          </template>
          <el-col :span="10" class="p2" v-else>
            <p class="label capitalize">{{ col.label }}</p>
          </el-col>
          <el-col :span="12" class="p2">
            <template v-if="col.label.toLowerCase().includes('url')">
              <a
                class="text-bold underline truncate mt3 inline-block"
                v-for="(url, i) in info[col.value]"
                :href="url"
                target="_blank"
                :key="i"
              >
                {{ url }}
              </a>
            </template>
            <p
              class="text-bold"
              v-else-if="col.label.toLowerCase().includes('date')"
            >
              {{ convertToYear(info[col.value]) }}
            </p>
            <template
              class="text-bold"
              v-else-if="
                isArrCol(info[col.value]) && hasLength(info[col.value])
              "
            >
              <p
                v-for="(item, index) in info[col.value]"
                :key="index + item"
                class="text-bold cursor-pointer underline-hover"
                @click="handleSelection(item._id, col.label)"
              >
                {{ item.name }}
              </p>
            </template>
            <p
              class="text-bold status-text"
              :class="{ active: info[col.value] === 'true' }"
              v-else-if="col.label.toLowerCase().includes('state')"
            >
              {{ info[col.value] === 'true' ? 'On' : 'Off' }}
            </p>
            <p class="text-bold" v-else-if="!isArrCol(info[col.value])">
              {{ info[col.value] }}
            </p>
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
        <el-col :xs="24" :sm="12" :md="24" :lg="12" class="mt8">
          <div
            class="cursor-pointer no-selectable"
            @click="$emit(CREATE_ALERT)"
          >
            <el-button
              :type="info.alert !== 1 ? 'info' : 'warning'"
              circle
              class="mr1 w9 h9 vertical-align"
            >
              <fa :icon="['fas', 'bell']" class="sm-icon mt-1" />
            </el-button>
            <span class="cursor-pointer fs-regular label">Receive alerts</span>
          </div>
        </el-col>
      </el-row>
    </footer>
  </div>
</template>

<script>
import convertToYear from '../../helpers/converToYear'
import { BUY_CAPACITY, REPORT_ISSUE, CREATE_ALERT } from '../../events/sidebar'

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
    CREATE_ALERT,
    convertToYear,
    buyOptions: ['Transit', 'Backbone', 'Datacenter', 'Other'],
    isMenuOpen: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    facColumns() {
      const cols = [...this.columns]
        .map(col => {
          if (
            Array.isArray(this.info[col.value]) &&
            this.info[col.value].length
          ) {
            return col
          } else if (
            Array.isArray(this.info[col.value]) &&
            !this.info[col.value].length
          ) {
            return false
          } else if (col.showSidebar) {
            return col
          }
        })
        .filter(col => col)
      return cols
    }
  },
  methods: {
    isArrCol(item) {
      return Array.isArray(item)
    },
    hasLength(arr) {
      return Boolean(arr.length)
    },
    handleSelection(_id, opt) {
      if (opt === 'cables') {
        this.$emit('cable-selection', {
          id: _id,
          option: 'cable'
        })
      }
    },
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
