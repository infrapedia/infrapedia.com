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
      @edit-item="viewNet"
      @delete-item="deleteNet"
      @alert-message="handleSendMessage"
      @search-input="handleNetworkSearch"
      :pagination="true"
      @page-change="getNetworksList"
      @clear-search-input="getNetworksList"
    />
    <connection-form
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
import ConnectionForm from '../../../components/userCreationForms/connection'
import {
  createNetwork,
  getNetworks,
  deleteNetwork,
  editNetwork,
  viewNetworkOwner,
  searchNetwork
} from '../../../services/api/networks'
import { netColumns } from '../../../config/columns'
import { TOGGLE_MESSAGE_DIALOG } from '../../../store/actionTypes'
import { MAP_FOCUS_ON } from '../../../store/actionTypes/map'
import debounce from '../../../helpers/debounce'

export default {
  name: 'ConnectionSection',
  components: {
    TableList,
    ConnectionForm
  },
  data: () => ({
    tableData: [],
    loading: false,
    isDialog: false,
    mode: 'create',
    tableConfig: {
      title: 'Groups',
      creation_link: false,
      btn_label: 'Create group'
    },
    form: {
      cls: [],
      name: '',
      cables: [],
      websites: [],
      facilities: [],
      references: [],
      organizations: []
    },
    columns: [...netColumns].filter(col => col.showTable)
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    checkMode() {
      return this.mode === 'create' ? this.createNet : this.saveEditedNet
    }
  },
  beforeCreate() {
    this.$emit('layout', 'profile-layout')
  },
  async mounted() {
    await this.getNetworksList()
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
    async getNetworksList(page = 0) {
      try {
        this.loading = true
        const res = await getNetworks({ user_id: this.$auth.user.sub, page })
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
      this.loading = true
      const res = await viewNetworkOwner({ user_id: this.$auth.user.sub, _id })
      if (res && res.data && res.data.r) {
        this.form = { ...res.data.r }
        const props = ['cables', 'facilities', 'cls', 'organizations']
        for (let p of props) {
          const data = res.data.r[p].map(f => ({
            name: f.label,
            _id: f._id
          }))
          this.form[p] = data
          this.form[`${p}List`] = data

          if (p === 'cables') {
            this.form.subsea = res.data.r[p]
              .filter(c => !c.terrestrial)
              .map(f => ({
                name: f.label,
                _id: f._id,
                terrestrial: f.terrestrial
              }))

            this.form.terrestrials = res.data.r[p]
              .filter(c => c.terrestrial)
              .map(f => ({
                name: f.label,
                _id: f._id,
                terrestrial: f.terrestrial
              }))
          }
        }
        if (!this.form.references) this.form.references = []
      }

      this.mode = 'edit'
      this.toggleDialog(false)
      this.loading = false
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
          cls: [],
          references: []
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
    },
    handleNetworkSearch: debounce(async function(s) {
      if (s == '') {
        if (!this.loading) await this.getNetworksList()
        return
      }

      this.loading = true
      const res = await searchNetwork({
        user_id: this.$auth.user.sub,
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
