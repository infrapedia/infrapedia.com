<template>
  <div class="no-overflow-x">
    <div class="pr8 pl8 pt2 pb4 columns-wrapper no-overflow-x overflow-y-auto">
      <div v-for="(col, i) in cableColumns" :key="i">
        <!---- COLLAPSE SECTION STARTS---->
        <template v-if="collapseColumns.includes(col.value.toLowerCase())">
          <el-row
            :gutter="20"
            v-if="info[col.value] && col.showSidebar"
            class="pb2"
          >
            <el-col :span="24">
              <p class="label capitalize">{{ col.label }}</p>
              <el-tag
                v-for="(item, index) in info[col.value]"
                :key="`${index}_${item.name}`"
                @click="handleSelection(item._id, col.label)"
                class="mr2 cursor-pointer"
                size="mini"
              >
                {{ item.name }}
              </el-tag>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="col.value.toLowerCase().includes('litcapacity')">
          <el-row
            :gutter="20"
            v-if="info[col.value] && col.showSidebar && !info.terrestrial"
          >
            <el-col :span="24">
              <p class="label capitalize">{{ col.label }}</p>
              <el-table :data="info[col.value]">
                <el-table-column
                  label="Year"
                  prop="year"
                  :formatter="getYear"
                />
                <el-table-column label="Capacity in Tbps" prop="cap" />
              </el-table>
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
              <el-col :span="24">
                <small>
                  <p class="capitalize">
                    More information:
                  </p>
                </small>
              </el-col>
            </template>
            <el-col
              :span="10"
              v-else-if="col.label == 'Latency' && !info.terrestrial"
            >
              <p class="label capitalize">{{ col.label }}</p>
            </el-col>
            <el-col
              :span="10"
              v-else-if="col.value == 'capacityTBPS' && !info.terrestrial"
            >
              <p class="label capitalize">{{ col.label }}</p>
            </el-col>
            <el-col :span="10" v-else-if="col.value == 'category'">
              <p class="label capitalize">{{ col.label }}</p>
            </el-col>
            <el-col
              :span="10"
              v-else-if="col.value == 'systemLength' && col.label != 'Latency'"
            >
              <p class="label capitalize">{{ col.label }}</p>
            </el-col>
            <el-col
              :span="10"
              v-else-if="info[col.value] && col.label == 'Facilities'"
            >
              <p class="label capitalize">
                {{
                  info.terrestrial
                    ? `${col.label} (On-Net)`
                    : `${col.label} (POPs)`
                }}
              </p>
            </el-col>
            <el-col
              :span="10"
              v-else-if="
                info[col.value] &&
                  col.value == 'fiberPairs' &&
                  !info.terrestrial
              "
            >
              <p class="label capitalize">{{ col.label }}</p>
            </el-col>
            <el-col
              :span="10"
              v-else-if="
                info[col.value] &&
                  col.label != 'Latency' &&
                  col.value != 'systemLength' &&
                  col.value != 'capacityTBPS' &&
                  col.value != 'fiberPairs'
              "
            >
              <p class="label capitalize">{{ col.label }}</p>
            </el-col>
            <!---- LABELS SECTION END ---->

            <!---- VALUES SECTION START ---->
            <template v-if="info[col.value]">
              <el-col
                v-if="
                  col.value.toLowerCase().includes('url') ||
                    col.value.toLowerCase().includes('web')
                "
                :span="12"
              >
                <a
                  class="underline dont-break-out fs-regular mr2 inline-block"
                  v-for="(url, i) in info[col.value]"
                  style="max-width: 20.4rem"
                  :href="
                    url.includes('http://') || url.includes('https://')
                      ? url
                      : `http://${url}`
                  "
                  target="_blank"
                  :key="i"
                  v-text="url"
                />
              </el-col>
              <el-col
                :span="12"
                v-else-if="
                  col.value.includes('activationDateTime') && col.label != 'EOL'
                "
              >
                <p class="text-bold">
                  {{ convertToYear(info[col.value]) }}
                </p>
              </el-col>
              <el-col
                :span="12"
                v-else-if="
                  !isArrCol(info[col.value]) &&
                    col.label == 'Latency' &&
                    !info.terrestrial
                "
              >
                <p class="text-bold">
                  {{ getCableLatency(info[col.value]) }} ms
                </p>
              </el-col>
              <el-col :span="12" v-else-if="col.label.includes('EOL')">
                <p class="text-bold">
                  {{ convertToYear(calculateEOL(info[col.value])) }}
                </p>
              </el-col>
              <el-col
                :span="12"
                v-else-if="
                  col.value == 'systemLength' && col.label != 'Latency'
                "
              >
                <p class="text-bold">{{ info[col.value] }} km</p>
              </el-col>
              <el-col
                :span="12"
                v-else-if="col.value == 'capacityTBPS' && !info.terrestrial"
              >
                <p class="text-bold">{{ info[col.value] }} Tbps</p>
              </el-col>
              <el-col :span="12" v-else-if="col.value == 'category'">
                <p class="text-bold capitalize">
                  {{
                    info[col.value] && info[col.value] !== ''
                      ? info[col.value]
                      : 'Unknown'
                  }}
                </p>
              </el-col>
              <el-col
                :span="12"
                v-else-if="col.value == 'fiberPairs' && !info.terrestrial"
              >
                <p class="text-bold">
                  {{ info[col.value] }}
                </p>
              </el-col>
              <el-col
                :span="12"
                v-else-if="
                  !isArrCol(info[col.value]) &&
                    col.label != 'Latency' &&
                    col.value != 'systemLength' &&
                    col.value != 'capacityTBPS' &&
                    col.value != 'fiberPairs'
                "
              >
                <p class="text-bold">
                  {{ info[col.value] }}
                </p>
              </el-col>
            </template>
            <template v-else>
              <el-col
                v-if="col.value == 'category' && !info[col.value]"
                :span="12"
              >
                <p class="text-bold">
                  Unknown
                </p>
              </el-col>
            </template>
            <div v-if="info.notes" v-html="info.notes" />
          </el-row>
        </template>
      </div>
      <!---- VALUES SECTION END ---->
    </div>
    <!---- FOOTER SECTION STARTS ----->
    <el-tooltip
      effect="dark"
      :disabled="!isActionButtonsDisabled"
      placement="top-start"
    >
      <div slot="content" class="flex justify-content-center row wrap">
        <span class="text-center inline-block w-fit-full">
          You need to login before making use of this features
        </span>
        <!-- <el-button
          plain
          size="mini"
          title="Sign in"
          :class="{ dark }"
          @click="signIn"
          class="fs-small mt2 h6 vertical-align"
        >
          <fa :icon="['fas', 'sign-in-alt']" class="mr1" /> Login
        </el-button> -->
      </div>
      <footer
        class="pr8 pl8 pb8"
        :class="{ disabled: isActionButtonsDisabled }"
      >
        <template>
          <el-divider class="mt0" />
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="24" :lg="12">
              <el-popover
                placement="bottom"
                width="100"
                popper-class="buy-capacity-popper"
                :visible-arrow="false"
                trigger="manual"
                :disabled="isActionButtonsDisabled"
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
                  :class="{ disabled: isActionButtonsDisabled }"
                  class="cursor-pointer no-outline no-selectable"
                >
                  <el-button
                    type="warning"
                    circle
                    :disabled="isActionButtonsDisabled"
                    class="mr1 w9 h9 vertical-align"
                  >
                    <fa :icon="['fas', 'cart-plus']" class="sm-icon mt-1" />
                  </el-button>
                  <span class="fs-regular label">Buy Now!</span>
                </div>
              </el-popover>
            </el-col>
            <el-col :xs="24" :sm="12" :md="24" :lg="12">
              <div
                class="cursor-pointer no-selectable"
                :class="{ disabled: isActionButtonsDisabled }"
                @click="
                  !isActionButtonsDisabled ? $emit(CREATE_ALERT) : () => {}
                "
              >
                <el-button
                  :type="info.alert != 1 ? 'info' : 'warning'"
                  circle
                  :disabled="isActionButtonsDisabled"
                  class="mr1 w9 h9 vertical-align"
                >
                  <fa :icon="['fas', 'bell']" class="sm-icon mt-1" />
                </el-button>
                <span class="fs-regular label">Receive alerts</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt8">
            <el-col :xs="24" :sm="12" :md="24" :lg="12">
              <div
                class="cursor-pointer no-selectable"
                :class="{ disabled: isActionButtonsDisabled }"
                @click="
                  !isActionButtonsDisabled
                    ? $emit(`${EDIT_CABLE}`, {
                        _id: info._id,
                        owner: info.uuid,
                        terrestrial: info.terrestrial
                      })
                    : () => {}
                "
              >
                <el-button
                  :disabled="isActionButtonsDisabled"
                  type="warning"
                  circle
                  class="mr1 w9 h9 vertical-align"
                >
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
                :class="{ disabled: isActionButtonsDisabled }"
                @click="
                  !isActionButtonsDisabled ? $emit(REPORT_ISSUE) : () => {}
                "
              >
                <el-button
                  :disabled="isActionButtonsDisabled"
                  type="warning"
                  circle
                  class="mr1 w9 h9 vertical-align"
                >
                  <fa
                    :icon="['fas', 'exclamation-circle']"
                    class="sm-icon mt-1"
                  />
                </el-button>
                <span class="fs-regular label">Report issue</span>
              </div>
            </el-col>
          </el-row>
        </template>
      </footer>
    </el-tooltip>
    <!---- FOOTER SECTION END ----->
  </div>
</template>

<script>
import convertToYear from '../../helpers/convertToYear'
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
    focus() {
      return this.$store.state.map.focus
    },
    dark() {
      return this.$store.state.isDark
    },
    cableColumns() {
      let cols = [...this.columns]
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

      if (this.info.category === 'project') {
        cols = cols.filter(col => col.label !== 'EOL')
      }

      if (this.info.terrestrial) {
        cols = cols.filter(col => col.value != 'RFS')
      }
      return cols
    },
    isActionButtonsDisabled() {
      return !this.$auth.isAuthenticated
    },
    isFutureState() {
      const date = this.info.activation_datetime
      const currentEpoch = Math.round(new Date().getTime() / 1000)
      return !!(date !== null && parseInt(date) > currentEpoch)
    },
    getYear: () => row => new Date(row.year).getFullYear(),
    collapseColumns() {
      return ['org', 'cls', 'networks', 'facilities', 'owners', 'knownusers']
    }
  },
  methods: {
    isArrCol(item) {
      return Array.isArray(item)
    },
    handleSelection(_id, opt) {
      if (opt == 'Known Users') {
        opt = 'organizations'
      }

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
    },
    signIn() {
      this.$auth.loginWithRedirect()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/sidebar-inner-component-styles.scss';
</style>
