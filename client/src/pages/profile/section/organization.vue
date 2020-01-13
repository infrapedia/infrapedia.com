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
      @edit-item="viewOrg"
      @delete-item="deleteOrg"
    />
    <org-form
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
import OrgForm from '../../../components/userCreationForms/org'
import {
  createOrganization,
  getOrganizations,
  deleteOrganization,
  editOrganization,
  viewOrganization
} from '../../../services/api/organizations'
import { orgsColumns } from '../../../config/columns'

export default {
  name: 'CablesSection',
  components: {
    'table-list': TableList,
    'org-form': OrgForm
  },
  data: () => ({
    tableData: [],
    mode: 'create',
    loading: false,
    form: {
      name: '',
      logo: '',
      notes: '',
      address: []
    },
    isDialog: false,
    tableConfig: {
      creation_link: false,
      title: 'Organizations',
      btn_label: 'Create organization'
    },
    columns: [...orgsColumns]
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    checkMode() {
      return this.mode === 'create' ? this.createOrg : this.saveEditedOrg
    }
  },
  async mounted() {
    await this.getOrganizationsList()
  },
  methods: {
    async viewOrg(_id) {
      const res = await viewOrganization({ user_id: this.$auth.user.sub, _id })
      if (res && res.data && res.data.r) {
        this.form = res.data.r
      }
      this.mode = 'edit'
      this.toggleDialog()
    },
    deleteOrg(_id) {
      this.$confirm(
        'Are you sure you want to delete this organization. This action is irreversible',
        'Please confirm to continue'
      )
        .then(async () => {
          await deleteOrganization({
            user_id: this.$auth.user.sub,
            _id
          }).then(() => this.getOrganizationsList())
        })
        .catch(() => {})
    },
    toggleDialog(itClearsForm) {
      this.isDialog = !this.isDialog
      if (itClearsForm) {
        this.mode = 'create'
        this.form = {
          name: '',
          logo: '',
          notes: '',
          address: []
        }
      }
    },
    async getOrganizationsList() {
      this.loading = true
      const res = await getOrganizations({ user_id: this.$auth.user.sub })
      if (res && res.data && res.t !== 'error') {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    async createOrg() {
      const res = await createOrganization({
        ...this.form,
        user_id: this.$auth.user.sub
      })
      if (res && res.data && res.t !== 'error') {
        this.toggleDialog(true)
        this.getOrganizationsList()
      }
    },
    async saveEditedOrg() {
      const res = await editOrganization({
        ...this.form,
        user_id: this.$auth.user.sub
      })
      if (res && res.t !== 'error') {
        this.toggleDialog(true)
        this.getOrganizationsList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
