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
  name: 'IxpsSection',
  components: {
    TableList
  },
  data: () => ({
    cablesList,
    tableConfig: {
      title: 'Ixps',
      creation_link: '/user/section/create?id=ixps',
      btn_label: 'Create Ixps'
    },
    columns: [
      'name',
      'state', // Bool
      'slug',
      'geom',
      'cables' // (Array)
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
