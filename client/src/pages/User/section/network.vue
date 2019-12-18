<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <header class="flex w-fit-full p2 row nowrap justify-content-space-between">
      <h1 class="title-user color-inherit">
        Networks
      </h1>
      <el-button type="warning" round>
        Create network
      </el-button>
    </header>
    <el-divider />
    <el-card shadow="never">
      <el-table :data="cablesList">
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
import cablesList from '../../../mokedData/cablesList'

export default {
  name: 'CablesSection',
  data: () => ({
    cablesList,
    columns: [
      'name',
      'websites', // (Array)
      'organizations', // (Array)
      'facilities', // (Array)
      'ixps', // (Array)
      'cls', //(Array)
      'cables' //(Array)
    ]
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section/networks.scss';
</style>
