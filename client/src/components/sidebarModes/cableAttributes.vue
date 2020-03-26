<template>
  <div class="pr8 pl8 pt2 pb8">
    <div v-for="(col, i) in cableColumns" :key="i">
      <!---- COLLAPSE SECTION STARTS---->
      <template
        v-if="
          col.value.toLowerCase().includes('org') ||
            col.value.toLowerCase().includes('cls') ||
            col.value.toLowerCase().includes('networks') ||
            col.value.toLowerCase().includes('fac')
        "
      >
        <el-row :gutter="20" v-if="info[col.value] && col.showSidebar">
          <el-col :span="24">
            <el-collapse v-model="collapse">
              <el-collapse-item :title="col.label" :name="i">
                <el-tag
                  v-for="(item, index) in info[col.value]"
                  :key="`${index}_${item.name}`"
                  @click="handleSelection(item._id, col.label)"
                  class="mr2 cursor-pointer"
                  size="mini"
                >
                  {{ item.name }}
                </el-tag>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </template>
      <template v-else-if="col.value.toLowerCase().includes('litcapacity')">
        <el-row
          :gutter="20"
          v-if="info[col.value] && col.showSidebar && !info.terrestrial"
        >
          <el-col :span="24">
            <el-collapse v-model="collapse">
              <el-collapse-item :title="col.label" :name="i">
                <el-table :data="info[col.value]">
                  <el-table-column
                    label="Year"
                    prop="year"
                    :formatter="getYear"
                  />
                  <el-table-column label="Capacity in Tbps" prop="cap" />
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </template>
      <!---- COLLAPSE SECTION END --->
      <!---- LABELS SECTION STARTS---->
      <template v-else>
        <el-row :gutter="20">
          <template
            v-if="col.label.toLowerCase().includes('url') && info[col.value]"
          >
            <el-col :span="24" class="pt2 pb2">
              <small>
                <p class="capitalize">
                  More information:
                </p>
              </small>
            </el-col>
          </template>
          <el-col
            :span="10"
            class="p2"
            v-else-if="col.label === 'Latency' && !info.terrestrial"
          >
            <p class="label capitalize">{{ col.label }}</p>
          </el-col>
          <el-col
            :span="10"
            class="p2"
            v-else-if="info[col.value] && col.label !== 'Latency'"
          >
            <p class="label capitalize">{{ col.label }}</p>
          </el-col>
          <!---- LABELS SECTION END ---->

          <!---- VALUES SECTION START ---->
          <template v-if="info[col.value]">
            <div
              v-if="
                col.label.toLowerCase().includes('url') ||
                  col.label.toLowerCase().includes('web')
              "
              class="flex row wrap"
            >
              <a
                class="underline truncate fs-regular mr2 inline-block"
                v-for="(url, i) in info[col.value]"
                :href="
                  url.includes('http://') || url.includes('https://')
                    ? url
                    : `http://${url}`
                "
                target="_blank"
                :key="i"
                v-text="url"
              />
            </div>
            <el-col
              :span="12"
              class="p2"
              v-else-if="col.label.toLowerCase().includes('ready for service')"
            >
              <p class="text-bold">
                {{ convertToYear(info[col.value]) }}
              </p>
            </el-col>
            <el-col
              :span="12"
              v-else-if="
                !isArrCol(info[col.value]) &&
                  col.label === 'Latency' &&
                  !info.terrestrial
              "
            >
              <p class="text-bold">{{ getCableLatency(info[col.value]) }} ms</p>
            </el-col>
            <el-col
              :span="12"
              v-else-if="col.label.includes('EOL') && info.status !== 'project'"
            >
              <p class="text-bold">
                {{ convertToYear(calculateEOL(info[col.value])) }}
              </p>
            </el-col>
            <el-col
              :span="12"
              v-else-if="!isArrCol(info[col.value]) && col.label !== 'Latency'"
            >
              <p class="text-bold">
                {{ info[col.value] }}
              </p>
            </el-col>
          </template>
          <div v-if="info.notes" v-html="info.notes" />
        </el-row>
      </template>
    </div>
    <!---- VALUES SECTION END ---->
    <el-divider />
    <!---- FOOTER SECTION STARTS ----->
    <footer class="p0 mt12">
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
            @click="
              $emit(`${EDIT_CABLE}`, {
                _id: info._id,
                owner: info.uuid,
                terrestrial: info.terrestrial
              })
            "
          >
            <el-button type="warning" circle class="mr1 w9 h9 vertical-align">
              <fa :icon="['fas', 'pen']" class="sm-icon mt-1" />
            </el-button>
            <span class="fs-regular label">{{
              info.terrestrial ? 'Edit Network' : 'Edit this cable'
            }}</span>
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
    <!---- FOOTER SECTION END ----->
  </div>
</template>

<script>
import convertToYear from '../../helpers/converToYear'
import calculateEOL from '../../helpers/calculateEOL'
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
    calculateEOL,
    collapse: [],
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
    },
    getYear: () => row => new Date(row.year).getFullYear()
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
