<template>
  <div
    class="main-wrapper w-fit-full mt12 pt8 vph-full pl4 pr4 flex align-items-start"
    :class="{ dark, light: !dark }"
  >
    <table-list
      ref="tableList"
      :is-loading="loading"
      :columns="columns"
      :config="tableConfig"
      :table-data="tableData"
      :pagination="true"
      @search-input="handleCSPSearch"
      @sort-by="handleCSPSearch"
      @edit-item="handleEditCsp"
      @delete-item="handleDeleteCsp"
      @page-change="handleCSPSearch"
      @clear-search-input="handleCSPSearch"
    />
    <prompt-delete
      :elemnt="elemntType"
      :is-visible="promptDelete"
      @delete-cancel="$emit('delete-cancel')"
      @delete-confirm="$emit('delete-confirm')"
    />
  </div>
</template>

<script>
import { cspColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'
// import { searchFacilities, deleteFacility } from '../../../services/api/facs'
import debounce from '../../../helpers/debounce'
// import { deleteFacilityPermanently } from '../../../services/api/permanentDelete'

export default {
  name: 'CloudSection',
  components: {
    TableList,
    PromptDelete: () => import('../../../components/PromptDelete')
  },
  data: () => ({
    tableData: [],
    loading: false,
    promptDelete: false,
    tableConfig: {
      title: 'Cloud Service Providers',
      creation_link: '/user/section/create?id=csp',
      btn_label: 'Add CSP'
    },
    columns: [...cspColumns].filter(col => col.showTable)
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    elemntType() {
      return 'csp'
    }
  },
  async created() {
    await this.handleCSPSearch('', 'nameAsc', 0)
  },
  methods: {
    handleEditCsp(_id) {
      return this.$router.push({
        path: '/user/section/create?id=csp',
        query: { item: _id }
      })
    },
    handleCSPSearch: debounce(
      async function(/* s, sortBy, page = 0 */) {
        this.loading = true
        // const res = await searchFacilities({
        //   user_id: await this.$auth.getUserID(),
        //   psz: true,
        //   sortBy,
        //   page,
        //   s
        // })
        // if (res && res.data) {
        //   this.tableData = res.data
        // }
        this.loading = false
      },
      820
    ),
    async handleDeleteCsp(/* _id, isPermanent */) {
      // this.promptDelete = true
      // this.$once('delete-confirm', async () => {
      //   if (!isPermanent) {
      //     await deleteFacility({
      //       user_id: await this.$auth.getUserID(),
      //       _id
      //     }).then(() => {
      //       this.handleCSPSearch(...this.$refs.tableList.getTableSearchValue())
      //     })
      //   } else {
      //     await deleteFacilityPermanently({
      //       user_id: await this.$auth.getUserID(),
      //       _id
      //     }).then(() => {
      //       this.handleCSPSearch(...this.$refs.tableList.getTableSearchValue())
      //     })
      //   }
      //   this.promptDelete = false
      // })
      // this.$once('delete-cancel', async () => {
      //   this.promptDelete = false
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
