<template>
  <div class="el-dialog__wrapper z-index120" v-show="isVisible">
    <transition
      tag="div"
      mode="in-out"
      name="animated faster"
      enter-active-class="fadeInDown"
      leave-active-class="fadeOutUp"
    >
      <div class="inner-wrapper el-dialog" v-show="isVisible">
        <div class="el-dialog__header">
          <header class="w-fit-full p0">
            <h1 class="inline-block font-semibold fs-xlarge">
              Viewing data: {{ data.name }}
            </h1>
            <el-button
              class="el-dialog__headerbtn p0"
              type="text"
              @click="$emit('close')"
            >
              <fa
                :icon="['fas', 'times']"
                class="el-dialog__close el-icon el-icon-close"
              />
            </el-button>
          </header>
        </div>
        <div class="el-dialog__body">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-table :data="tableData" stripe>
                <el-table-column label="Property">
                  <template slot-scope="scope">
                    <p v-if="scope.row.property == 'rgDate'" class="capitalize">
                      Register Date
                    </p>
                    <p v-else class="capitalize">
                      {{ scope.row.property }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="Value">
                  <template slot-scope="scope">
                    <a
                      v-if="scope.row.property == 'phone'"
                      :href="`tel:${scope.row.value}`"
                      target="_blank"
                    >
                      {{ scope.row.value }}
                    </a>
                    <template v-else-if="scope.row.property == 'message'">
                      <div id="rawDataMsgColumn">
                        <div v-html="scope.row.value" />
                      </div>
                    </template>
                    <p v-else>
                      {{ scope.row.value }}
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { formatDate } from '../../helpers/formatDate'

export default {
  name: 'ViewDataDialog',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    acceptedKeys: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    map: null,
    draw: null,
    tableData: []
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  watch: {
    isVisible(bool) {
      if (bool) {
        this.handleDataVisualization()
      }
    }
  },
  mounted() {
    this.handleDataVisualization()
  },
  methods: {
    handleDataVisualization() {
      if (!this.data || !this.isVisible) return

      this.tableData = Object.keys(this.data)
        .map(key => {
          if (this.acceptedKeys.includes(key) && key.includes('Date')) {
            return {
              property: key,
              value: this.data[key] ? formatDate(this.data[key]) : 'no data'
            }
          } else {
            return this.acceptedKeys.includes(key)
              ? {
                  property: key,
                  value: this.data[key] ? this.data[key] : 'no data'
                }
              : false
          }
        })
        .filter(d => d)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/view-issue-dialog-styles.scss';
</style>
