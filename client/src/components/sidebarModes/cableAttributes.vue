<template>
  <div class="pr8 pl8 pt2 pb8">
    <div v-for="(col, i) in cableColumns" :key="i">
      <el-row :gutter="20" v-if="info[col.value] && col.showSidebar">
        <!--- Labels ---->
        <template
          v-if="
            col.label.includes('org') ||
              col.label.includes('cls') ||
              col.label.includes('networks') ||
              col.label.includes('fac')
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
        <!--- Labels END ---->

        <!--- Values ---->
        <el-col :span="12" class="p2">
          <template v-if="col.label.toLowerCase().includes('url')">
            <a
              class="underline truncate fs-regular mr2"
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
            v-else-if="isArrCol(info[col.value]) && hasLength(info[col.value])"
          >
            <div class="w-fit-full mb6">
              <span
                v-for="(item, index) in info[col.value]"
                :key="index + item"
                @click="handleSelection(item._id, col.label)"
                class="fs-regular text-bold underline-hover cursor-pointer"
              >
                {{ item.name }}
                <template v-if="index !== info[col.value].length - 1"
                  >,</template
                >
              </span>
            </div>
          </template>
          <p
            class="text-bold"
            v-else-if="!isArrCol(info[col.value]) && col.label === 'Latency'"
          >
            {{ getCableLatency(info[col.value]) }} ms
          </p>
          <p class="text-bold" v-else-if="!isArrCol(info[col.value])">
            {{ info[col.value] }}
          </p>
        </el-col>
        <!--- Values END ---->
      </el-row>
      <template v-if="info.notes" v-html="info.notes" />
    </div>
    <el-divider />
    <footer class="p0">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="24" :lg="12">
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
                  tabindex="1"
                  role="listitem"
                  class="p4 no-selectable transition cursor-pointer seamless-hoverbg no-outline"
                  :class="{ dark, light: !dark }"
                  @click="emitEvent"
                >
                  Backbone
                </li>
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
        <el-col :xs="24" :sm="12" :md="24" :lg="12">
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
      <el-row :gutter="20" class="mt8">
        <el-col :xs="24" :sm="12" :md="24" :lg="12">
          <div
            class="cursor-pointer no-selectable"
            @click="$emit(`${EDIT_CABLE}`)"
          >
            <el-button type="warning" circle class="mr1 w9 h9 vertical-align">
              <fa :icon="['fas', 'pen']" class="sm-icon mt-1" />
            </el-button>
            <span class="fs-regular label">Edit this cable</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="24" :lg="12">
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
import convertToYear from '../../helpers/converToYear'
import {
  BUY_CAPACITY,
  EDIT_CABLE,
  REPORT_ISSUE,
  CREATE_ALERT
} from '../../events/sidebar'

export default {
  name: 'ICableAttributes',
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
    EDIT_CABLE,
    BUY_CAPACITY,
    REPORT_ISSUE,
    CREATE_ALERT,
    convertToYear,
    isMenuOpen: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    cableColumns() {
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
    },
    isFutureState() {
      const date = this.info.activation_datetime
      const currentEpoch = Math.round(new Date().getTime() / 1000)
      return !!(date !== null && parseInt(date) > currentEpoch)
    },
    currentCableStatus() {
      return this.info.has_outage || this.isFutureState
    },
    currentCableUrls() {
      const { url1, url2, url3 } = this.info
      const urls = []

      if (url1) urls.push(url1)
      else if (url2) urls.push(url2)
      else if (url3) urls.push(url3)

      return urls
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
      return this.$emit('selection', {
        id: _id,
        option: opt
      })
    },
    getCableLatency(distance) {
      const _constant = 200
      return distance / _constant
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    emitEvent() {
      this.toggleMenu()
      return this.$emit(`${BUY_CAPACITY}`, 'backbone')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/cable-attributes-styles.scss';
</style>
