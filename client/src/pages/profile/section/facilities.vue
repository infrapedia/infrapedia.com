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
      @search-input="handleFacsSearch"
      @edit-item="handleEditFac"
      @delete-item="handleDeleteFac"
      @page-change="getFacilitiesList"
    />
  </div>
</template>

<script>
import { facsColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'
import { getFacilities, searchFacilities } from '../../../services/api/facs'
import debounce from '../../../helpers/debounce'

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
      creation_link: '/user/section/create?id=facilities',
      btn_label: 'Create facility'
    },
    columns: [...facsColumns].filter(col => col.showTable)
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  beforeCreate() {
    this.$emit('layout', 'profile-layout')
  },
  async mounted() {
    await this.getFacilitiesList()
  },
  methods: {
    async getFacilitiesList(page = 0) {
      this.loading = true
      const res = await getFacilities({ user_id: this.$auth.user.sub, page })
      if (res.t !== 'error' && res.data) {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    handleEditFac(_id) {
      return this.$router.push({
        path: '/user/section/create',
        query: { id: 'facilities', item: _id }
      })
    },
    handleFacsSearch: debounce(async function(s) {
      this.loading = true
      if (s == '') {
        return this.getFacilitiesList()
      }

      const res = await searchFacilities({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.tableData = res.data
      }
      this.loading = false
    }, 820),
    handleDeleteFac() {}
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
