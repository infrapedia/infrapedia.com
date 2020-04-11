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
      @page-change="getIxpsList"
      @edit-item="handleEditIxp"
      @delete-item="handleDeleteIxp"
    />
  </div>
</template>

<script>
import { ixpsColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'

export default {
  name: 'IxpsSection',
  components: {
    TableList
  },
  data: () => ({
    tableData: [],
    loading: false,
    tableConfig: {
      title: 'Ixps',
      creation_link: '/user/section/create?id=ixp',
      btn_label: 'Create Ixps'
    },
    columns: [...ixpsColumns].filter(col => col.showTable)
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  beforeCreate() {
    this.$emit('layout', 'profile-layout')
  },
  methods: {
    getIxpsList() {},
    handleEditIxp() {},
    handleDeleteIxp() {}
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
