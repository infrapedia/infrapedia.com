<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <table-list
      :columns="columns"
      :config="tableConfig"
      :table-data="tableData"
      @btn-click="toggleDialog"
    />
    <org-form
      :form="form"
      @send-data="sendData"
      :visible="isDialog"
      @close="toggleDialog(true)"
    />
  </div>
</template>

<script>
import TableList from '../../../components/TableList.vue'
import OrgForm from '../../../components/userCreationForms/org'
import {
  createOrganization,
  getOrganizations
} from '../../../services/api/organizations'

export default {
  name: 'CablesSection',
  components: {
    'table-list': TableList,
    'org-form': OrgForm
  },
  data: () => ({
    tableData: [],
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
    columns: [
      'name',
      'logo',
      'notes',
      'address' // (Array)
    ]
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  async mounted() {
    await this.getOrganizationsList()
  },
  methods: {
    toggleDialog(itClearsForm) {
      this.isDialog = !this.isDialog
      if (itClearsForm) {
        this.form = {
          name: '',
          logo: '',
          notes: '',
          address: []
        }
      }
    },
    async getOrganizationsList() {
      const res = await getOrganizations({ user_id: this.$auth.user.sub })
      if (res && res.t !== 'error') {
        this.tableData = res.data.r
      }
    },
    async sendData() {
      const res = await createOrganization({
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
