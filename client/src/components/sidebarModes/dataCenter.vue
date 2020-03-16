<template>
  <div class="pr8 pl8 pt2 pb8">
    <div v-for="(col, i) in facColumns" :key="i">
      <!---- COLLAPSE SECTION STARTS---->
      <template
        v-if="
          col.value.toLowerCase().includes('org') ||
            col.value.toLowerCase().includes('networks') ||
            col.value.toLowerCase().includes('cables') ||
            col.value.toLowerCase().includes('cls') ||
            col.value.toLowerCase().includes('address') ||
            col.value.toLowerCase().includes('facilities')
        "
      >
        <el-row :gutter="20" v-if="info[col.value] && col.showSidebar">
          <el-col :span="24">
            <el-collapse v-model="collapse">
              <template v-if="!col.label.toLowerCase().includes('address')">
                <template
                  v-if="
                    col.value === 'cables' && col.filter(info[col.value]).length
                  "
                >
                  <el-collapse-item :title="col.label" :name="i">
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
                </template>
                <template v-else-if="col.value !== 'cables'">
                  <el-collapse-item :title="col.label" :name="i">
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
                </template>
              </template>
              <template v-else>
                <el-collapse-item :title="col.label" :name="i">
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
              </template>
            </el-collapse>
          </el-col>
        </el-row>
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
            <el-col :span="24" class="p2">
              <small>
                <p class="m0 capitalize">
                  More information:
                </p>
              </small>
            </el-col>
          </template>
          <el-col :span="10" class="p2" v-else-if="info[col.value]">
            <p class="label capitalize">{{ col.label }}</p>
          </el-col>
          <!---- LABELS SECTION ENDS ---->

          <!---- VALUES SECTION STARTS---->
          <el-col :span="12" class="p2" v-if="info[col.value]">
            <template v-if="col.label.toLowerCase().includes('url')">
              <template v-if="Array.isArray(info[col.value])">
                <a
                  class="text-bold underline truncate mt3 inline-block"
                  v-for="(url, i) in info[col.value]"
                  :href="
                    url.includes('http://') || url.includes('https://')
                      ? url
                      : `http://${url}`
                  "
                  target="_blank"
                  :key="i"
                >
                  {{ url }}
                </a>
              </template>
              <a
                v-else
                class="text-bold underline truncate mt3 inline-block"
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
                class="text-bold underline truncate mt3 inline-block"
                :href="info[col.value]"
                target="_blank"
              >
                {{ info[col.value] }}
              </a>
            </template>
            <!-- <template
              class="text-bold"
              v-else-if="
                isArrCol(info[col.value]) &&
                  hasLength(info[col.value]) &&
                  col.label.toLowerCase().includes('address')
              "
            >
              <p
                v-for="(item, index) in info[col.value]"
                :key="index + item"
                class="text-bold"
                @click="handleSelection(item._id, col.label)"
              >
                {{ item.street }} {{ item.city }}, {{ item.state }}.
              </p>
            </template> -->
            <p
              class="text-bold status-text"
              :class="{ active: info[col.value] === 'true' }"
              v-else-if="col.label.toLowerCase().includes('state')"
            >
              {{ info[col.value] === 'true' ? 'On' : 'Off' }}
            </p>
            <template
              v-else-if="isArrCol(info[col.value]) && col.label.includes('web')"
            >
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
              v-else-if="!isArrCol(info[col.value]) && info[col.value] !== ''"
            >
              {{ info[col.value] }}
            </p>
          </el-col>
        </el-row>
      </template>
    </div>
    <!---- VALUES SECTION END ---->

    <el-divider />
    <!---- FOOTER SECTION STARTS ----->
    <footer class="p0 mt12">
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
    <!---- FOOTER SECTION END ----->
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
    collapse: [],
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
@import '../../assets/scss/components/data-center-styles.scss';
</style>
