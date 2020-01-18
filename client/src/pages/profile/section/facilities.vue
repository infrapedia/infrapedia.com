<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <table-list
      :is-loading="loading"
      :columns="columns"
      :config="tableConfig"
      :table-data="tableData"
    />
  </div>
</template>

<script>
import { facsColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'

export default {
  name: 'FacilitiesSection',
  components: {
    TableList
  },
  data: () => ({
    tableData: [],
    loading: false,
    tableConfig: {
      title: 'Facilities',
      creation_link: '/user/section/create?id=facs',
      btn_label: 'Create facility'
    },
    columns: [...facsColumns]
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
