<template>
  <div class="w-fit-full flex row wrap justify-self-center">
    <header class="flex w-fit-full p2 row nowrap justify-content-space-between">
      <h1 class="title-user color-inherit">
        <router-link v-if="returnLink.visible" :to="returnLink.url">
          <fa :icon="['fas', 'arrow-left']" class="fs-regular mr2 mb1" />
        </router-link>
        {{ config.title }}
      </h1>
      <el-button
        type="warning"
        class="capitalize"
        round
        @click="handleRoute"
        v-if="canCreate"
      >
        {{ config.btn_label }}
      </el-button>
    </header>
    <el-divider />
    <el-card shadow="never" class="w-fit-full">
      <el-table
        :data="tableData"
        max-height="500"
        v-loading="isLoading"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(col, i) in columns"
          :label="col.label"
          :key="i"
        >
          <template slot-scope="scope">
            <template
              v-if="
                Array.isArray(scope.row[col.value]) &&
                  scope.row[col.value].length
              "
            >
              <div v-for="(item, i) in scope.row[col.value]" :key="i">
                <template v-if="item.city"> City: {{ item.city }} </template>
                <br />
                <template v-if="item.street">
                  Street: {{ item.street }}
                </template>
                <el-tag
                  size="small"
                  :title="item.name || item"
                  v-else-if="
                    col.value === 'websites' ||
                      col.value === 'cables' ||
                      col.value === 'cls' ||
                      col.value === 'facilities'
                  "
                >
                  {{ item.name ? item.name : item }}
                </el-tag>
                <el-tag v-else size="small" :title="item.fullAddress">
                  {{ item.fullAddress ? item.fullAddress : item }}
                </el-tag>
              </div>
            </template>
            <el-image
              v-if="col.value === 'logo'"
              fit="cover"
              :src="scope.row[col.value]"
              class="w12 h12 circle"
            />
            <template v-else-if="col.value === 'alerts'">
              <span v-if="!scope.row[col.value]">
                0
              </span>
              <span
                v-else
                @click="handleSendMessage(scope.row)"
                class="cursor-pointer"
              >
                {{ `${scope.row[col.value]}` }}
              </span>
            </template>
            <span
              v-else-if="
                (col.value.includes('activationDateTime') ||
                  col.value.includes('rgDate') ||
                  col.value.includes('uDate')) &&
                  scope.row[col.value]
              "
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
        <el-table-column fixed="right" label="Operations" width="220">
          <template v-if="canSearch" slot="header" slot-scope="scope">
            <el-input
              :key="scope.index"
              v-model="tableSearch"
              size="mini"
              @input="$emit('search-input')"
              placeholder="Type to search by name"
            />
          </template>
          <template slot-scope="scope">
            <div class="flex row nowrap justify-content-center">
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
                v-if="canDelete"
                type="danger"
                class="p2 fs-regular"
                size="small"
                @click="
                  $emit(
                    'delete-item',
                    scope.row.idReport
                      ? scope.row.idReport
                      : scope.row.idMessage
                      ? scope.row.idMessage
                      : scope.row._id
                  )
                "
              >
                <fa :icon="deleteIcon" />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div v-if="pagination" class="w-fit-full flex justify-content-center mt8">
      <el-pagination
        layout="prev, next"
        :current-page.sync="paginationPage"
        @current-change="$emit('page-change', $event)"
      />
    </div>
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
    pagination: {
      type: Boolean,
      default: () => false
    },
    canEdit: {
      type: Boolean,
      default: () => true
    },
    canSearch: {
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
    canDelete: {
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
    formatDate,
    tableSearch: '',
    paginationPage: 0
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
    },
    handleSendMessage(data) {
      return this.$emit('alert-message', { ...data })
    }
  }
}
</script>
