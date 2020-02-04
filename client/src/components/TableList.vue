<template>
  <div>
    <header class="flex w-fit-full p2 row nowrap justify-content-space-between">
      <h1 class="title-user color-inherit">
        <router-link v-if="returnLink.visible" :to="returnLink.url">
          <fa :icon="['fas', 'arrow-left']" class="fs-regular mr2 mb1" />
        </router-link>
        {{ config.title }}
      </h1>
      <el-button type="warning" round @click="handleRoute" v-if="canCreate">
        {{ config.btn_label }}
      </el-button>
    </header>
    <el-divider />
    <el-card shadow="never">
      <el-table
        :data="tableData"
        max-height="700"
        v-loading="isLoading"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(col, i) in columns"
          :label="col.label"
          :key="i"
        >
          <template slot-scope="scope">
            <div
              v-if="
                Array.isArray(scope.row[col.value]) &&
                  scope.row[col.value].length
              "
            >
              <p v-for="(item, i) in scope.row[col.value]" :key="i">
                <template v-if="item.city"> City: {{ item.city }} </template>
                <br />
                <template v-if="item.street">
                  Street: {{ item.street }}
                </template>
                <el-tag
                  size="small"
                  v-else-if="
                    col.value === 'websites' ||
                      col.value === 'cables' ||
                      col.value === 'cls'
                  "
                >
                  {{ item }}
                </el-tag>
                <template v-else>
                  {{ item }}
                </template>
              </p>
            </div>
            <el-image
              v-if="col.value === 'logo'"
              fit="cover"
              :src="scope.row[col.value]"
              class="w12 h12 circle"
            />
            <span v-else-if="col.value === 'alerts' && !scope.row[col.value]">
              0
            </span>
            <span
              v-else-if="col.label.includes('date') && scope.row[col.value]"
            >
              {{ formatDate(scope.row[col.value]) }}
            </span>
            <span
              v-else-if="
                !Array.isArray(scope.row[col.value]) &&
                  typeof scope.row[col.value] !== 'object' &&
                  typeof scope.row[col.value] !== 'undefined'
              "
            >
              {{ `${scope.row[col.value]}` }}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="canEdit"
              plain
              size="small"
              class="p2 mr4 fs-regular"
              @click="$emit('edit-item', scope.row._id)"
            >
              <fa :icon="['fas', 'pen']" />
            </el-button>
            <el-button
              v-if="canView"
              plain
              size="small"
              class="p2 mr4 fs-regular"
              @click="$emit('view-item', scope.row._id)"
            >
              <fa :icon="['fas', 'eye']" />
            </el-button>
            <el-button
              type="danger"
              class="p2 fs-regular"
              size="small"
              @click="$emit('delete-item', scope.row._id)"
            >
              <fa :icon="deleteIcon" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '../helpers/formatDate'

export default {
  name: 'TableList',
  props: {
    columns: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    admittedKeys: {
      type: Array,
      default: () => []
    },
    canEdit: {
      type: Boolean,
      default: () => true
    },
    isLoading: {
      type: Boolean,
      default: () => false
    },
    canView: {
      type: Boolean,
      default: () => false
    },
    canCreate: {
      type: Boolean,
      default: () => true
    },
    deleteIcon: {
      type: Array,
      default: () => ['fas', 'trash']
    },
    rowClasses: {
      type: Array,
      default: () => []
    },
    returnLink: {
      type: Object,
      default: () => ({
        visible: false,
        url: ''
      })
    }
  },
  data: () => ({
    formatDate
  }),
  methods: {
    getKeys(arr) {
      if (!arr.length) return []
      return Object.keys(arr[0]).sort()
    },
    tableRowClassName({ row }) {
      if (this.rowClasses.length) {
        return String(row[this.rowClasses[0]]) === this.rowClasses[2]
          ? this.rowClasses[1]
          : ''
      }
      return ''
    },
    handleRoute() {
      return this.config.creation_link
        ? this.$router.push(this.config.creation_link)
        : this.$emit('btn-click')
    }
  }
}
</script>
