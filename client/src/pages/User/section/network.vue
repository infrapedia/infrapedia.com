<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <table-list
      v-loading="loading"
      :columns="columns"
      :config="tableConfig"
      :table-data="tableData"
      @btn-click="toggleDialog"
      @edit-item="viewNet"
      @delete-item="deleteNet"
    />
    <network-form
      :form="form"
      @send-data="checkMode"
      :visible="isDialog"
      :mode="mode"
      @close="toggleDialog(true)"
    />
  </div>
</template>

<script>
import TableList from '../../../components/TableList.vue'
import NetworkForm from '../../../components/userCreationForms/networks'
import {
  createNetwork,
  getNetworks,
  deleteNetwork,
  editNetwork,
  viewNetwork
} from '../../../services/api/networks'
import { netColumns } from '../../../config/columns'

export default {
  name: 'CablesSection',
  components: {
    TableList,
    NetworkForm
  },
  data: () => ({
    tableData: [],
    loading: false,
    isDialog: false,
    mode: 'create',
    tableConfig: {
      title: 'Networks',
      creation_link: false,
      btn_label: 'Create network'
    },
    form: {
      name: '',
      websites: [],
      organizations: [],
      facilities: [],
      cables: [],
      ixps: [],
      cls: []
    },
    columns: [...netColumns]
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    checkMode() {
      return this.mode === 'create' ? this.createNet : this.saveEditedNet
    }
  },
  async mounted() {
    await this.getNetworksList()
  },
  methods: {
    async getNetworksList() {
      try {
        this.loading = true
        const res = await getNetworks({ user_id: this.$auth.user.sub })
        if (res && res.data && res.t !== 'error') {
          this.tableData = res.data.r
        }
        this.loading = false
      } catch (err) {
        // Ignore
        console.error(err)
      }
    },
    async viewNet(_id) {
      const res = await viewNetwork({ user_id: this.$auth.user.sub, _id })
      if (res && res.data && res.data.r) {
        this.form = res.data.r
      }
      this.mode = 'edit'
      this.toggleDialog()
    },
    toggleDialog(itClearsForm) {
      this.isDialog = !this.isDialog
      if (itClearsForm) {
        this.mode = 'create'
        this.form = {
          name: '',
          websites: [],
          organizations: [],
          facilities: [],
          cables: [],
          ixps: [],
          cls: []
        }
      }
    },
    deleteNet(_id) {
      this.$confirm(
        'Are you sure you want to delete this organization. This action is irreversible',
        'Please confirm to continue'
      )
        .then(async () => {
          await deleteNetwork({
            user_id: this.$auth.user.sub,
            _id
          }).then(() => this.getNetworksList())
        })
        .catch(() => {})
    },
    async createNet() {
      const res = await createNetwork({
        ...this.form,
        user_id: this.$auth.user.sub
      })
      if (res && res.t !== 'error') {
        this.toggleDialog(true)
        this.getNetworksList()
      }
    },
    async saveEditedNet() {
      const res = await editNetwork({
        ...this.form,
        user_id: this.$auth.user.sub
      })
      if (res && res.t !== 'error') {
        this.toggleDialog(true)
        this.getNetworksList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
