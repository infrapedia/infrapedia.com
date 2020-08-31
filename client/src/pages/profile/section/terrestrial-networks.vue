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
      @search-input="handleTerrestrialSearch"
      @page-change="handleTerrestrialSearch"
      @clear-search-input="handleTerrestrialSearch"
      @sort-by="handleTerrestrialSearch"
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
import { deleteCable, getSearchByCablesT } from '../../../services/api/cables'
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
      title: 'Terrestrial Networks',
      creation_link: '/user/section/create?id=terrestrial-network',
      btn_label: 'Create network'
    },
    columns: [...cablesColumns].filter(
      col => col.showTable && col.value !== 'activationDateTime'
    )
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    elemntType() {
      return 'network'
    }
  },
  async created() {
    await this.handleTerrestrialSearch('', 'nameAsc', 0)
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
    handleEditCable(_id) {
      return this.$router.push({
        path: '/user/section/create',
        query: { id: 'terrestrial-network', item: _id }
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
            this.handleTerrestrialSearch(
              ...this.$refs.tableList.getTableSearchValue()
            )
          )
        } else {
          await deleteCablePermanently({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() =>
            this.handleTerrestrialSearch(
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
    handleTerrestrialSearch: debounce(async function(s, sortBy, page = 0) {
      this.loading = true
      const res = await getSearchByCablesT({
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
    }, 820)
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
