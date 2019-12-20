<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <table-list
      :columns="columns"
      :config="tableConfig"
      :table-data="cablesList"
      @btn-click="toggleDialog"
    />
    <org-form :form="form" :visible="isDialog" @close="toggleDialog" />
  </div>
</template>

<script>
import cablesList from '../../../mokedData/cablesList'
import TableList from '../../../components/TableList.vue'
import OrgForm from '../../../components/userCreationForms/org'

export default {
  name: 'CablesSection',
  components: {
    'table-list': TableList,
    'org-form': OrgForm
  },
  data: () => ({
    cablesList,
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
  methods: {
    toggleDialog() {
      this.isDialog = !this.isDialog
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
