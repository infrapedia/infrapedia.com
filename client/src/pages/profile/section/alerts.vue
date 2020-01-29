<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <table-list
      :is-loading="loading"
      :can-edit="false"
      :can-create="false"
      :columns="columns"
      :config="tableConfig"
      :table-data="tableData"
      :delete-icon="['fas', 'stop-circle']"
      @btn-click="toggleDialog"
      @delete-item="deleteSelectedAlert"
    />

    <div class="flex w-fit-full align-items-center justify-content-center mt12">
      <el-pagination
        @current-change="getALertsList"
        :current-page.sync="currentPage"
        layout="prev, next"
      />
    </div>
  </div>
</template>

<script>
import TableList from '../../../components/TableList.vue'
import { getAlerts, disableAlert } from '../../../services/api/alerts'
import { getSelectionTypeNumber } from '../../../helpers/getSelectionTypeNumber'

export default {
  components: {
    TableList
  },
  data: () => ({
    tableData: [],
    loading: false,
    isDialog: false,
    currentPage: 0,
    mode: 'create',
    tableConfig: {
      title: 'Alerts',
      creation_link: false,
      btn_label: 'Create Alert'
    },
    columns: ['name', 't', 'status', 'disabled']
  }),
  computed: {
    totalPages() {
      return 20
    },
    dark() {
      return this.$store.state.isDark
    }
  },
  async mounted() {
    await this.getALertsList()
  },
  methods: {
    toggleDialog() {},
    async getALertsList(page = this.currentPage) {
      this.loading = true
      const res = await getAlerts({
        page,
        user_id: this.$auth.user.sub
      })
      if (res && res.data && res.data.r) {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    async deleteSelectedAlert(_id) {
      const elemnt = this.tableData.filter(alert => alert._id === _id)[0]
      if (elemnt) {
        return await this.$confirm(
          'Are you sure you want to disable this alert?',
          'Please confirm to continue'
        )
          .then(async () => {
            await disableAlert({
              user_id: this.$auth.user.sub,
              elemnt: elemnt._idElement,
              t: getSelectionTypeNumber(elemnt.t)
            }).then(() => this.getALertsList())
          })
          .catch(() => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
