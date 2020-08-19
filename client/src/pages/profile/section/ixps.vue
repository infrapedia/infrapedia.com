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
      @search-input="handleIxpSearch"
      @edit-item="handleEditIxp"
      @page-change="getIxpsList"
      @sort-by="handleIxpSearch"
      @delete-item="handleDeleteIXP"
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
import debounce from '../../../helpers/debounce'
import { ixpsColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'
import { getIxps, searchIxps, deleteIXP } from '../../../services/api/ixps'
import { deleteIxpPermanently } from '../../../services/api/permanentDelete'

export default {
  name: 'IxpsSection',
  components: {
    TableList,
    PromptDelete: () => import('../../../components/PromptDelete')
  },
  data: () => ({
    tableData: [],
    loading: false,
    promptDelete: false,
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
    },
    elemntType() {
      return 'ixp'
    }
  },
  async mounted() {
    await this.getIxpsList()
  },
  methods: {
    async getIxpsList(page = 0) {
      this.loading = true
      const res = await getIxps({ user_id: await this.$auth.getUserID(), page })
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
    handleIxpSearch: debounce(async function(s, sortBy) {
      if (s == '') {
        if (!this.loading) await this.getIxpsList()
        return
      }

      this.loading = true
      const res = await searchIxps({
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
    async handleDeleteIXP(_id, isPermanent) {
      this.promptDelete = true
      this.$once('delete-confirm', async () => {
        if (!isPermanent) {
          await deleteIXP({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() => {
            this.handleIxpSearch(...this.$refs.tableList.getTableSearchValue())
          })
        } else {
          await deleteIxpPermanently({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() => {
            this.handleIxpSearch(...this.$refs.tableList.getTableSearchValue())
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
