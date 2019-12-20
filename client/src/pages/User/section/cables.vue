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
      title: 'Cables',
      creation_link: '/user/create?id=cables',
      btn_label: 'Create cable'
    },
    columns: [
      'name',
      'system_length',
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
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
