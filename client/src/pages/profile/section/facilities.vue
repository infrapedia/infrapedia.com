<template>
  <div
    class="main-wrapper w-fit-full mt12 pt8 vph-full pl4 pr4 flex align-items-start"
    :class="{ dark, light: !dark }"
  >
    <table-list
      :is-loading="loading"
      :columns="columns"
      :config="tableConfig"
      :table-data="tableData"
      :pagination="true"
      @edit-item="handleEditFac"
      @delete-item="handleDeleteFac"
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
      creation_link: '/user/section/create?id=facility',
      btn_label: 'Create facility'
    },
    columns: [...facsColumns].filter(col => col.showTable)
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    handleEditFac() {},
    handleDeleteFac() {}
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
