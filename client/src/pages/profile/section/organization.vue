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
      @btn-click="toggleDialog"
      @edit-item="viewOrg"
      @delete-item="deleteOrg"
      @alert-message="handleSendMessage"
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
  viewOrganizationOwner
} from '../../../services/api/organizations'
import { orgsColumns } from '../../../config/columns'
import { TOGGLE_MESSAGE_DIALOG } from '../../../store/actionTypes'
import { MAP_FOCUS_ON } from '../../../store/actionTypes/map'

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
      address: [],
      information: ''
    },
    isDialog: false,
    tableConfig: {
      creation_link: false,
      title: 'Organizations',
      btn_label: 'Create organization'
    },
    columns: [...orgsColumns].filter(col => col.showTable)
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
    handleSendMessage(data) {
      this.$store.commit(`${MAP_FOCUS_ON}`, {
        id: data._id,
        name: data.name,
        type: 'cls'
      })
      return this.$store.commit(`${TOGGLE_MESSAGE_DIALOG}`, true)
    },
    async viewOrg(_id) {
      const res = await viewOrganizationOwner({
        user_id: this.$auth.user.sub,
        _id
      })
      if (res && res.data && res.data.r) {
        this.form = res.data.r
        this.form.link = res.data.r.url
      }
      this.mode = 'edit'
      this.toggleDialog()
    },
    deleteOrg(_id) {
      return this.$confirm(
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
          address: [],
          information: ''
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
