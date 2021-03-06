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
      @page-change="getFacilitiesList"
      @clear-search-input="getFacilitiesList"
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
import {
  getFacilities,
  searchFacilities,
  deleteFacility
} from '../../../services/api/facs'
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
      creation_link: '/user/section/create?id=facilities',
      btn_label: 'Create facility'
    },
    columns: [...facsColumns].filter(col => col.showTable)
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    elemntType() {
      return 'facility'
    }
  },
  async mounted() {
    await this.getFacilitiesList()
  },
  methods: {
    async getFacilitiesList(page = 0) {
      this.loading = true
      const res = await getFacilities({
        user_id: await this.$auth.getUserID(),
        page
      })
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
    handleFacsSearch: debounce(async function(s, sortBy) {
      this.loading = true
      const res = await searchFacilities({
        user_id: await this.$auth.getUserID(),
        psz: true,
        s,
        sortBy
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
