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
      @page-change="getCablesList"
    />
  </div>
</template>

<script>
import { cablesColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'
import { getSubseaCables, deleteCable } from '../../../services/api/cables'
import { TOGGLE_MESSAGE_DIALOG } from '../../../store/actionTypes'
import { MAP_FOCUS_ON } from '../../../store/actionTypes/map'

export default {
  name: 'CablesSection',
  components: {
    TableList
  },
  data: () => ({
    tableData: [],
    loading: false,
    tableConfig: {
      title: 'Subsea Cables',
      creation_link: '/user/section/create?id=subsea',
      btn_label: 'Create subsea cable'
    },
    columns: [...cablesColumns].filter(col => col.showTable)
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
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
      const res = await getSubseaCables({ user_id: this.$auth.user.sub, page })
      if (res.t !== 'error' && res.data) {
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
    handleDeleteCable(_id) {
      return this.$confirm(
        'Are you sure you want to delete this Cable. This action is irreversible',
        'Please confirm to continue'
      )
        .then(async () => {
          await deleteCable({
            user_id: this.$auth.user.sub,
            _id
          }).then(() => this.getCablesList())
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
