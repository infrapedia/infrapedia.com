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
      @edit-item="handleEditCable"
      @delete-item="handleDeleteCable"
      @alert-message="handleSendMessage"
      :pagination="true"
      @page-change="getCablesList"
      @search-input="handleSubseaSearch"
      @clear-search-input="getCablesList"
      @sort-by="handleSubseaSearch"
      :sortList="sortByList"
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
import { cablesColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'
import {
  getSubseaCables,
  deleteCable,
  getSearchByCablesS
} from '../../../services/api/cables'
import { TOGGLE_MESSAGE_DIALOG } from '../../../store/actionTypes'
import { MAP_FOCUS_ON } from '../../../store/actionTypes/map'
import debounce from '../../../helpers/debounce'
import { deleteCablePermanently } from '../../../services/api/permanentDelete'

export default {
  name: 'CablesSection',
  components: {
    TableList,
    PromptDelete: () => import('../../../components/PromptDelete')
  },
  data: () => ({
    tableData: [],
    loading: false,
    promptDelete: false,
    tableConfig: {
      title: 'Subsea Cables',
      creation_link: '/user/section/create?id=subsea',
      btn_label: 'Create subsea cable'
    },
    columns: [...cablesColumns].filter(col => col.showTable)
  }),
  computed: {
    sortByList() {
      return [
        { text: 'Name Asc', value: 'nameAsc' },
        { text: 'Name Desc', value: 'nameDesc' },
        { text: 'RFS Asc', value: 'rfsAsc' },
        { text: 'RFS Desc', value: 'rfsDesc' },
        { text: 'Created at Asc', value: 'creatAtAsc' },
        { text: 'Created at Desc', value: 'creatAtDesc' },
        { text: 'Updated at Asc', value: 'updateAtAsc' },
        { text: 'Updated at Desc', value: 'updateAtDesc' }
      ]
    },
    dark() {
      return this.$store.state.isDark
    },
    elemntType() {
      return 'subsea cable'
    }
  },
  async mounted() {
    await this.getCablesList()
  },
  methods: {
    handleSendMessage(data) {
      this.$store.commit(`${MAP_FOCUS_ON}`, {
        id: data._id,
        name: data.name,
        type: 'cables'
      })
      return this.$store.commit(`${TOGGLE_MESSAGE_DIALOG}`, true)
    },
    async getCablesList(page = 0) {
      this.loading = true
      const res = await getSubseaCables({
        user_id: await this.$auth.getUserID(),
        page
      })
      if (res.t != 'error' && res.data) {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    handleEditCable(_id) {
      return this.$router.push({
        path: '/user/section/create',
        query: { id: 'subsea', item: _id }
      })
    },
    handleDeleteCable(_id, isPermanent) {
      this.promptDelete = true

      this.$once('delete-confirm', async () => {
        if (!isPermanent) {
          await deleteCable({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() =>
            this.handleSubseaSearch(
              ...this.$refs.tableList.getTableSearchValue()
            )
          )
        } else {
          await deleteCablePermanently({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() =>
            this.handleSubseaSearch(
              ...this.$refs.tableList.getTableSearchValue()
            )
          )
        }
        this.promptDelete = false
      })

      this.$once('delete-cancel', async () => {
        this.promptDelete = false
      })
    },
    handleSubseaSearch: debounce(async function(s, sortBy) {
      this.loading = true
      const res = await getSearchByCablesS({
        user_id: await this.$auth.getUserID(),
        psz: true,
        s,
        sortBy
      })
      if (res && res.data) {
        this.tableData = res.data
      }
      this.loading = false
    }, 820)
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
