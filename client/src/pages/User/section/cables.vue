<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <header class="flex w-fit-full p2 row nowrap justify-content-space-between">
      <h1 class="title-user color-inherit">
        Cables
      </h1>
      <el-button type="warning" round>
        Create cable
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
      'system_lenght',
      'activationDateTime',
      'urls', // (Array)
      // 'terrestrial', // (Bool)
      'capacity_tbps',
      'fiberPairs',
      'notes'
      // 'facilities', // (Array)
      // 'cls' // (Array)
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
@import '../../../assets/scss/pages/user/section/cables.scss';
</style>
