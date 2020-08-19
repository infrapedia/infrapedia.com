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
      @btn-click="toggleDialog"
      @edit-item="viewOrg"
      @delete-item="deleteOrg"
      @alert-message="handleSendMessage"
      :pagination="true"
      @search-input="handleOrgSearch"
      @sort-by="handleOrgSearch"
      @page-change="getOrganizationsList"
      @clear-search-input="getOrganizationsList"
    />
    <org-form
      :form="form"
      @send-data="checkMode"
      :visible="isDialog"
      :mode="mode"
      @close="toggleDialog(true)"
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
import TableList from '../../../components/TableList.vue'
import OrgForm from '../../../components/userCreationForms/org'
import {
  createOrganization,
  getOrganizations,
  deleteOrganization,
  editOrganization,
  viewOrganizationOwner,
  searchOrganization
} from '../../../services/api/organizations'
import { orgsColumns } from '../../../config/columns'
import { TOGGLE_MESSAGE_DIALOG } from '../../../store/actionTypes'
import { MAP_FOCUS_ON } from '../../../store/actionTypes/map'
import debounce from '../../../helpers/debounce'
import { deleteOrgPermanently } from '../../../services/api/permanentDelete'

export default {
  name: 'CablesSection',
  components: {
    'org-form': OrgForm,
    'table-list': TableList,
    PromptDelete: () => import('../../../components/PromptDelete')
  },
  data: () => ({
    tableData: [],
    mode: 'create',
    loading: false,
    promptDelete: false,
    form: {
      name: '',
      logo: '',
      notes: '',
      link: '',
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
    elemntType() {
      return 'organization'
    },
    checkMode() {
      return this.mode == 'create' ? this.createOrg : this.saveEditedOrg
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
      const {
        data: { r: orgData = {} }
      } = (await viewOrganizationOwner({
        user_id: await this.$auth.getUserID(),
        _id
      })) || {
        data: {
          orgData: {}
        }
      }

      const { name, url, notes, address, information, logo } = orgData
      this.form = {
        _id,
        name,
        logo,
        notes,
        address: address.map(ad => {
          if (
            ad.country &&
            ad.country != undefined &&
            ad.reference.trim() == ''
          ) {
            ad.reference = ad.country
          }
          return ad
        }),
        link: url,
        information
      }
      this.mode = 'edit'
      this.toggleDialog()
    },
    deleteOrg(_id, isPermanent) {
      this.promptDelete = true

      this.$once('delete-confirm', async () => {
        if (!isPermanent) {
          await deleteOrganization({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() => {
            this.handleOrgSearch(...this.$refs.tableList.getTableSearchValue())
          })
        } else {
          await deleteOrgPermanently({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() => {
            this.handleOrgSearch(...this.$refs.tableList.getTableSearchValue())
          })
        }
        this.promptDelete = false
      })

      this.$once('delete-cancel', async () => {
        this.promptDelete = false
      })
    },
    toggleDialog(itClearsForm) {
      this.isDialog = !this.isDialog
      if (itClearsForm) {
        this.mode = 'create'
        this.form = {
          name: '',
          logo: '',
          notes: '',
          link: '',
          address: [],
          information: ''
        }
      }
    },
    async getOrganizationsList(page = 0) {
      this.loading = true
      const res = await getOrganizations({
        user_id: await this.$auth.getUserID(),
        page
      })
      if (res && res.data && res.t !== 'error') {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    async createOrg() {
      const res = await createOrganization({
        ...this.form,
        user_id: await this.$auth.getUserID()
      })
      if (res && res.data && res.t !== 'error') {
        this.toggleDialog(true)
        this.handleOrgSearch(...this.$refs.tableList.getTableSearchValue())
      }
    },
    async saveEditedOrg() {
      const res = await editOrganization({
        ...this.form,
        user_id: await this.$auth.getUserID()
      })
      if (res && res.t !== 'error') {
        this.toggleDialog(true)
        this.handleOrgSearch(...this.$refs.tableList.getTableSearchValue())
      }
    },
    handleOrgSearch: debounce(async function(s, sortBy) {
      if (s == '') {
        if (!this.loading) await this.getOrganizationsList()
        return
      }

      this.loading = true
      const res = await searchOrganization({
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
