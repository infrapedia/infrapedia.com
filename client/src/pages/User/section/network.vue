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
      @send-data="sendData"
    />
    <network-form :form="form" :visible="isDialog" @close="toggleDialog" />
  </div>
</template>

<script>
import cablesList from '../../../mokedData/cablesList'
import TableList from '../../../components/TableList.vue'
import NetworkForm from '../../../components/userCreationForms/networks'

export default {
  name: 'CablesSection',
  components: {
    TableList,
    NetworkForm
  },
  data: () => ({
    cablesList,
    isDialog: false,
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
    columns: [
      'name',
      'websites', // (Array)
      'organizations', // (Array)
      'facilities', // (Array)
      'ixps', // (Array)
      'cls', //(Array)
      'cables' //(Array)
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
    },
    sendData() {
      console.warn('Not done yet')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
