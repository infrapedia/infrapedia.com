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
      @search-input="handleFacsSearch"
      @sort-by="handleFacsSearch"
      @edit-item="handleEditFac"
      @delete-item="handleDeleteFac"
      @page-change="handleFacsSearch"
      @clear-search-input="handleFacsSearch"
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
import { facsColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'
import { searchFacilities, deleteFacility } from '../../../services/api/facs'
import debounce from '../../../helpers/debounce'
import { deleteFacilityPermanently } from '../../../services/api/permanentDelete'

export default {
  name: 'FacilitiesSection',
  components: {
    TableList,
    PromptDelete: () => import('../../../components/PromptDelete')
  },
  data: () => ({
    tableData: [],
    loading: false,
    promptDelete: false,
    tableConfig: {
      title: 'Facilities',
      btn_label: 'Create facility',
      creation_link: '/user/section/create-facility'
    },
    columns: [...facsColumns].filter(col => col.showTable)
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    elemntType() {
      return 'facilities'
    }
  },
  async created() {
    await this.handleFacsSearch('', 'nameAsc', 0)
  },
  methods: {
    handleEditFac(_id) {
      return this.$router.push({
        path: '/user/section/create-facility',
        query: { item: _id }
      })
    },
    handleFacsSearch: debounce(async function(s, sortBy, page = 0) {
      this.loading = true
      const res = await searchFacilities({
        user_id: await this.$auth.getUserID(),
        psz: true,
        sortBy,
        page,
        s
      })
      if (res && res.data) {
        this.tableData = res.data
      }
      this.loading = false
    }, 820),
    async handleDeleteFac(_id, isPermanent) {
      this.promptDelete = true

      this.$once('delete-confirm', async () => {
        if (!isPermanent) {
          await deleteFacility({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() => {
            this.handleFacsSearch(...this.$refs.tableList.getTableSearchValue())
          })
        } else {
          await deleteFacilityPermanently({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() => {
            this.handleFacsSearch(...this.$refs.tableList.getTableSearchValue())
          })
        }
        this.promptDelete = false
      })

      this.$once('delete-cancel', async () => {
        this.promptDelete = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
