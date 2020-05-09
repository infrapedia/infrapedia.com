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
      @edit-item="handleEditCable"
      @delete-item="handleDeleteCable"
      @alert-message="handleSendMessage"
      :pagination="true"
      @search-input="handleTerrestrialSearch"
      @page-change="getCablesList"
      @clear-search-input="getCablesList"
    />
  </div>
</template>

<script>
import { cablesColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'
import {
  getTerrestrialNetworks,
  deleteCable,
  getSearchByCablesT
} from '../../../services/api/cables'
import { TOGGLE_MESSAGE_DIALOG } from '../../../store/actionTypes'
import { MAP_FOCUS_ON } from '../../../store/actionTypes/map'
import debounce from '../../../helpers/debounce'

export default {
  name: 'CablesSection',
  components: {
    TableList
  },
  data: () => ({
    tableData: [],
    loading: false,
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
    }
  },
  beforeCreate() {
    this.$emit('layout', 'profile-layout')
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
      const res = await getTerrestrialNetworks({
        user_id: await this.$auth.getUserID(),
        page
      })
      if (res.t !== 'error' && res.data) {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    handleEditCable(_id) {
      return this.$router.push({
        path: '/user/section/create',
        query: { id: 'terrestrial-network', item: _id }
      })
    },
    handleDeleteCable(_id) {
      return this.$confirm(
        'Are you sure you want to delete this Cable. This action is irreversible',
        'Please confirm to continue'
      )
        .then(async () => {
          await deleteCable({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() => this.getCablesList())
        })
        .catch(() => {})
    },
    handleTerrestrialSearch: debounce(async function(s) {
      if (s == '') {
        if (!this.loading) await this.getCablesList()
        return
      }

      this.loading = true
      const res = await getSearchByCablesT({
        user_id: await this.$auth.getUserID(),
        psz: true,
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
