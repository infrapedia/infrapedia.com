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
      <el-table :data="tableData" max-height="700" v-loading="isLoading">
        <el-table-column :label="col" v-for="(col, i) in columns" :key="i">
          <template slot-scope="scope">
            <div v-if="Array.isArray(scope.row[col]) && scope.row[col].length">
              <p v-for="(item, i) in scope.row[col]" :key="i">
                <template v-if="item.city"> City: {{ item.city }} </template>
                <br />
                <template v-if="item.street">
                  Street: {{ item.street }}
                </template>
                <el-tag
                  size="small"
                  v-else-if="
                    col === 'websites' || col === 'cables' || col === 'cls'
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
              v-if="col === 'logo'"
              fit="cover"
              :src="scope.row[col]"
              class="w12 h12 circle"
            />
            <span v-else-if="col === 'alerts' && !scope.row[col]">
              0
            </span>
            <span
              v-else-if="
                !Array.isArray(scope.row[col]) &&
                  typeof scope.row[col] !== 'object' &&
                  typeof scope.row[col] !== 'undefined'
              "
            >
              {{ `${scope.row[col]}` }}
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
    returnLink: {
      type: Object,
      default: () => ({
        visible: false,
        url: ''
      })
    }
  },
  methods: {
    getKeys(arr) {
      if (!arr.length) return []
      return Object.keys(arr[0]).sort()
    },
    handleRoute() {
      return this.config.creation_link
        ? this.$router.push(this.config.creation_link)
        : this.$emit('btn-click')
    }
  }
}
</script>
