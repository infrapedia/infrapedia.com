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
      @search-input="handleIxpSearch"
      @edit-item="handleEditIxp"
      @page-change="getIxpsList"
      @delete-item="handleDeleteIXP"
    />
  </div>
</template>

<script>
import { ixpsColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'
import { getIxps, searchIxps } from '../../../services/api/ixps'
import debounce from '../../../helpers/debounce'

export default {
  name: 'IxpsSection',
  components: {
    TableList
  },
  data: () => ({
    tableData: [],
    loading: false,
    tableConfig: {
      title: 'IXPs',
      creation_link: '/user/section/create?id=ixps',
      btn_label: 'Create IXPs'
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
  async mounted() {
    await this.getIxpsList()
  },
  methods: {
    async getIxpsList(page = 0) {
      this.loading = true
      const res = await getIxps({ user_id: this.$auth.user.sub, page })
      if (res.t !== 'error' && res.data) {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    handleEditIxp(_id) {
      return this.$router.push({
        path: '/user/section/create',
        query: { id: 'ixps', item: _id }
      })
    },
    handleIxpSearch: debounce(async function(s) {
      if (s == '') {
        if (!this.loading) await this.getIxpsList()
        return
      }

      this.loading = true
      const res = await searchIxps({
        user_id: this.$auth.user.sub,
        psz: true,
        s
      })
      if (res && res.data) {
        this.tableData = res.data
      }
      this.loading = false
    }, 820),
    handleDeleteIXP() {}
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
