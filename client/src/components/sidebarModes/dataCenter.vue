<template>
  <div class="no-overflow-x">
    <div class="pr8 pl8 pt2 pb4 columns-wrapper no-overflow-x overflow-y-auto">
      <div v-for="(col, i) in dataCenterColumns" :key="i">
        <!---- COLLAPSE SECTION STARTS---->
        <template v-if="collapseColumns.includes(col.value.toLowerCase())">
          <template v-if="focusType.includes('org')">
            <el-row :gutter="20" v-if="info[col.value] && col.showSidebar">
              <el-col :span="24">
                <template v-if="!col.label.toLowerCase().includes('address')">
                  <template
                    v-if="
                      col.value == 'cables' &&
                        col.filter(info[col.value]).length
                    "
                  >
                    <template v-if="info[col.value].length > 1">
                      <el-collapse
                        v-model="orgCollapse"
                        :ref="`el-collapse_${i}`"
                        class="mb4"
                      >
                        <el-collapse-item :name="i" :title="col.label">
                          <el-tag
                            v-for="(item, index) in col.filter(info[col.value])"
                            :key="index + item.name"
                            @click="handleSelection(item._id, col.label)"
                            class="mr2 cursor-pointer"
                            size="mini"
                          >
                            {{ item.name }}
                          </el-tag>
                        </el-collapse-item>
                      </el-collapse>
                    </template>
                    <template v-else>
                      <p class="label capitalize">{{ col.label }}</p>
                      <el-tag
                        v-for="(item, index) in col.filter(info[col.value])"
                        :key="index + item.name"
                        @click="handleSelection(item._id, col.label)"
                        class="mr2 cursor-pointer"
                        size="mini"
                      >
                        {{ item.name }}
                      </el-tag>
                    </template>
                  </template>
                  <template v-else-if="col.value != 'cables'">
                    <template v-if="info[col.value].length > 1">
                      <el-collapse
                        v-model="orgCollapse"
                        :ref="`el-collapse_${i}`"
                        class="mb4"
                      >
                        <el-collapse-item :name="i" :title="col.label">
                          <el-tag
                            v-for="(item, index) in info[col.value]"
                            :key="index + item.name"
                            @click="handleSelection(item._id, col.label)"
                            class="mr2 cursor-pointer"
                            size="mini"
                          >
                            {{ item.name }}
                          </el-tag>
                        </el-collapse-item>
                      </el-collapse>
                    </template>
                    <template v-else>
                      <p class="label capitalize">{{ col.label }}</p>
                      <el-tag
                        v-for="(item, index) in info[col.value]"
                        :key="index + item.name"
                        @click="handleSelection(item._id, col.label)"
                        class="mr2 cursor-pointer"
                        size="mini"
                      >
                        {{ item.name }}
                      </el-tag>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <template v-if="info[col.value].length > 1">
                    <el-collapse
                      v-model="orgCollapse"
                      :ref="`el-collapse_${i}`"
                      class="mb4"
                    >
                      <el-collapse-item :name="i" :title="col.label">
                        <p
                          v-for="(item, index) in info[col.value]"
                          :key="index + item"
                          class="text-bold"
                        >
                          {{ item.street }} {{ item.city ? item.city : '' }},
                          {{ item.state ? item.state + ', ' : '' }}
                          {{ item.country ? item.country : '' }}.
                        </p>
                      </el-collapse-item>
                    </el-collapse>
                  </template>
                  <template v-else>
                    <p class="label capitalize">{{ col.label }}</p>
                    <p
                      v-for="(item, index) in info[col.value]"
                      :key="index + item"
                      class="text-bold"
                    >
                      {{ item.street }} {{ item.city ? item.city : '' }},
                      {{ item.state ? item.state + ', ' : '' }}
                      {{ item.country ? item.country : '' }}.
                    </p>
                  </template>
                </template>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <el-row :gutter="20" v-if="info[col.value] && col.showSidebar">
              <el-col :span="24">
                <template v-if="!col.label.toLowerCase().includes('address')">
                  <template
                    v-if="
                      col.value == 'cables' &&
                        col.filter(info[col.value]).length
                    "
                  >
                    <p class="label capitalize">{{ col.label }}</p>
                    <el-tag
                      v-for="(item, index) in col.filter(info[col.value])"
                      :key="index + item.name"
                      @click="handleSelection(item._id, col.label)"
                      class="mr2 cursor-pointer"
                      size="mini"
                    >
                      {{ item.name }}
                    </el-tag>
                  </template>
                  <template v-else-if="col.value != 'cables'">
                    <p class="label capitalize">{{ col.label }}</p>
                    <el-tag
                      v-for="(item, index) in info[col.value]"
                      :key="index + item.name"
                      @click="handleSelection(item._id, col.label)"
                      class="mr2 cursor-pointer"
                      size="mini"
                    >
                      {{ item.name }}
                    </el-tag>
                  </template>
                </template>
                <template v-else>
                  <p class="label capitalize">{{ col.label }}</p>
                  <p
                    v-for="(item, index) in info[col.value]"
                    :key="index + item"
                    class="text-bold"
                  >
                    {{ item.street }} {{ item.city ? item.city : '' }},
                    {{ item.state ? item.state + ', ' : '' }}
                    {{ item.country ? item.country : '' }}.
                  </p>
                </template>
              </el-col>
            </el-row>
          </template>
        </template>
        <!---- COLLAPSE SECTION END --->

        <template v-else>
          <!---- LABELS SECTION STARTS ---->
          <el-row :gutter="20">
            <template
              v-if="
                col.label.toLowerCase().includes('url') &&
                  info[col.value] &&
                  info[col.value].length
              "
            >
              <el-col :span="24">
                <small>
                  <p class="m0 capitalize">
                    More information:
                  </p>
                </small>
              </el-col>
            </template>
            <el-col :span="10" v-else-if="info[col.value]">
              <p class="label capitalize">{{ col.label }}</p>
            </el-col>
            <!---- LABELS SECTION ENDS ---->

            <!---- VALUES SECTION STARTS---->
            <el-col :span="12" v-if="info[col.value]">
              <template v-if="col.label.toLowerCase().includes('url')">
                <template v-if="Array.isArray(info[col.value])">
                  <a
                    class="text-bold underline dont-break-out mt3 inline-block"
                    style="max-width: 20.4rem"
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
                </template>
                <a
                  v-else
                  style="max-width: 20.4rem"
                  class="text-bold underline dont-break-out mt3 inline-block"
                  :href="
                    info[col.value].includes('http://') ||
                    info[col.value].includes('https://')
                      ? info[col.value]
                      : `http://${info[col.value]}`
                  "
                  target="_blank"
                >
                  {{ info[col.value] }}
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
                  isArrCol(info[col.value]) &&
                    hasLength(info[col.value]) &&
                    !col.label.includes('web') &&
                    !col.label.includes('address')
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
              <template
                class="text-bold"
                v-else-if="
                  !isArrCol(info[col.value]) &&
                    col.label.toLowerCase().includes('web')
                "
              >
                <a
                  class="text-bold underline dont-break-out mt3 inline-block"
                  :href="info[col.value]"
                  target="_blank"
                >
                  {{ info[col.value] }}
                </a>
              </template>
              <p
                class="text-bold status-text"
                :class="{
                  active: info[col.value] == 'true',
                  cls: focusType == 'cls'
                }"
                v-else-if="col.label.toLowerCase().includes('state')"
              >
                <template v-if="focusType == 'cls'">
                  {{ info[col.value] == 'true' ? 'Operational' : 'Unknown' }}
                </template>
                <template v-else>
                  {{ info[col.value] == 'true' ? 'On' : 'Off' }}
                </template>
              </p>
              <template
                v-else-if="
                  isArrCol(info[col.value]) && col.label.includes('web')
                "
              >
                <a
                  class="text-bold underline dont-break-out mt3 inline-block"
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
                v-else-if="
                  !isArrCol(info[col.value]) &&
                    info[col.value] !== '' &&
                    info[col.value] == 'null' &&
                    col.value == 'state'
                "
              >
                Unknown
              </p>
              <p
                class="text-bold"
                v-else-if="!isArrCol(info[col.value]) && info[col.value] !== ''"
              >
                {{ info[col.value] }}
              </p>
            </el-col>
          </el-row>
        </template>
      </div>
    </div>
    <!---- VALUES SECTION END ---->

    <!---- FOOTER SECTION STARTS ----->
    <el-tooltip
      effect="dark"
      :disabled="!isActionButtonsDisabled"
      placement="top-start"
      content="You need to login before making use of this features"
    >
      <footer class="pr8 pl8 pb8">
        <el-divider class="mt0" />
        <el-row :gutter="20">
          <el-col :sx="24" :md="12">
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
                v-if="focus.type != 'cls'"
                slot="reference"
                @click="toggleMenu"
                class="cursor-pointer no-outline no-selectable"
                :class="{ disabled: isActionButtonsDisabled }"
              >
                <el-button
                  :disabled="isActionButtonsDisabled"
                  type="warning"
                  circle
                  class="mr1 w9 h9 vertical-align"
                >
                  <fa :icon="['fas', 'cart-plus']" class="sm-icon mt-1" />
                </el-button>
                <span class="fs-regular label">Buy capacity</span>
              </div>
            </el-popover>
          </el-col>
          <el-col :sx="24" :md="12">
            <div
              :class="{ disabled: isActionButtonsDisabled }"
              class="cursor-pointer no-selectable"
              @click="!isActionButtonsDisabled ? $emit(REPORT_ISSUE) : () => {}"
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
          <el-col
            :xs="24"
            :sm="12"
            :md="24"
            :lg="12"
            :class="{ mt8: focus.type != 'cls' }"
          >
            <div
              :class="{ disabled: isActionButtonsDisabled }"
              class="cursor-pointer no-selectable"
              @click="!isActionButtonsDisabled ? $emit(CREATE_ALERT) : () => {}"
            >
              <el-button
                :disabled="isActionButtonsDisabled"
                :type="info.alert !== 1 ? 'info' : 'warning'"
                circle
                class="mr1 w9 h9 vertical-align"
              >
                <fa :icon="['fas', 'bell']" class="sm-icon mt-1" />
              </el-button>
              <span class="fs-regular label">Receive alerts</span>
            </div>
          </el-col>
        </el-row>
      </footer>
    </el-tooltip>
    <!---- FOOTER SECTION END ----->
  </div>
</template>

<script>
import convertToYear from '../../helpers/convertToYear'
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
    colsKey: 0,
    BUY_CAPACITY,
    REPORT_ISSUE,
    CREATE_ALERT,
    convertToYear,
    orgCollapse: [],
    buyOptions: ['Transit', 'Backbone', 'Datacenter', 'Other'],
    isMenuOpen: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    focusType() {
      return this.focus.type.toLowerCase()
    },
    focus() {
      return this.$store.state.map.focus
    },
    collapseColumns() {
      return ['org', 'networks', 'cables', 'cls', 'address', 'facilities']
    },
    dataCenterColumns() {
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
    isActionButtonsDisabled() {
      return !this.$auth.isAuthenticated
    }
  },
  mounted() {
    if (this.focusType.includes('org')) {
      try {
        for (let collapse in this.$refs) {
          this.orgCollapse.push(Number(collapse.split('_')[1]))
        }
      } catch {
        // Ignore
      }
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
@import '../../assets/scss/components/sidebar-inner-component-styles.scss';
</style>
