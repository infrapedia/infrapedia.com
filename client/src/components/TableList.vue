<template>
  <div>
    <header class="flex w-fit-full p2 row nowrap justify-content-space-between">
      <h1 class="title-user color-inherit">
        {{ config.title }}
      </h1>
      <el-button type="warning" round @click="handleRoute">
        {{ config.btn_label }}
      </el-button>
    </header>
    <el-divider />
    <el-card shadow="never">
      <el-table :data="tableData">
        <el-table-column :label="col" v-for="(col, i) in columns" :key="i">
          <template slot-scope="scope">
            <div v-if="Array.isArray(scope.row[col])">
              <p v-if="!scope.row[col].length">
                You didn't add any address to this org
              </p>
              <template v-else>
                <p v-for="(address, i) in scope.row[col]" :key="i">
                  <template v-if="address.city">
                    City: {{ address.city }}
                  </template>
                  <br />
                  <template v-if="address.street">
                    Street: {{ address.street }}
                  </template>
                </p>
              </template>
            </div>
            <span v-else>
              {{ `${scope.row[col]}` }}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="120">
          <template slot-scope="scope">
            <el-button
              plain
              size="small"
              class="p2 mr4 fs-regular"
              @click="$emit('edit-item', scope.row._id)"
            >
              <fa :icon="['fas', 'pen']" />
            </el-button>
            <el-button
              type="danger"
              class="p2 fs-regular"
              size="small"
              @click="$emit('delete-item', scope.row._id)"
            >
              <fa :icon="['fas', 'trash']" />
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
    }
  },
  methods: {
    getKeys(arr) {
      if (!arr.length) return []
      return Object.keys(arr[0]).sort()
    },
    handleRoute() {
      0
      if (this.config.creation_link) {
        this.$router.push(this.config.creation_link)
      } else if (!this.config.creation_link) {
        this.$emit('btn-click')
      }
    }
  }
}
</script>
