<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <table-list
      :columns="columns"
      :config="tableConfig"
      :table-data="cablesList"
    />
  </div>
</template>

<script>
import cablesList from '../../../mokedData/cablesList'
import TableList from '../../../components/TableList.vue'

export default {
  name: 'CablesSection',
  components: {
    TableList
  },
  data: () => ({
    cablesList,
    tableConfig: {
      title: 'Networks',
      creation_link: '/user/create?id=networks',
      btn_label: 'Create network'
    },
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
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
