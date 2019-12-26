<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <table-list
      v-loading="loading"
      :columns="columns"
      :config="tableConfig"
      :admitted-keys="tableDataKeys"
      :table-data="tableData"
      @btn-click="toggleDialog"
      @edit-item="editOrg"
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
  editOrganization
} from '../../../services/api/organizations'

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
    tableDataKeys: ['city', 'street'],
    columns: [
      'name',
      'logo',
      // 'notes',
      'address' // (Array)
    ]
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
    editOrg(_id) {
      const orgToEdit = this.tableData.filter(org => org._id === _id)[0]
      this.form = { ...orgToEdit }
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
      if (res && res.t !== 'error') {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    async createOrg() {
      const res = await createOrganization({
        ...this.form,
        user_id: this.$auth.user.sub
      })
      if (res && res.t !== 'error') {
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
