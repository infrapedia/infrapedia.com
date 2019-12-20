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
            {{ `${scope.row[col]}` }}
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
    }
  },
  methods: {
    handleRoute() {
      if (this.config.creation_link) {
        this.$router.push(this.config.creation_link)
      } else if (!this.config.creation_link) {
        this.$emit('btn-click')
      }
    }
  }
}
</script>
