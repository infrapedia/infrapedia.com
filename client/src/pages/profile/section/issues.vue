<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <table-list
      :is-loading="loading"
      :can-edit="false"
      :columns="columns"
      :config="issuesConf"
      :table-data="tableData"
      :can-view="true"
      @view-item="viewSelectedIssue"
      @delete-item="deleteIssues"
      :row-classes="['viewed', 'light-yellow-bg']"
    />

    <div class="flex w-fit-full align-items-center justify-content-center mt12">
      <el-pagination
        @current-change="getIssuesList"
        :current-page.sync="currentPage"
        layout="prev, next"
        :total="totalPages"
      />
    </div>
    <view-issue-dialog
      @close="() => (isViewDialog = false)"
      :is-visible="isViewDialog"
      :data="issueOnView"
    />
  </div>
</template>

<script>
import TableList from '../../../components/TableList.vue'
import { deleteIssue, viewIssue, getIssues } from '../../../services/api/issues'

export default {
  components: {
    TableList,
    ViewIssueDialog: () => import('../../../components/dialogs/ViewIssue')
  },
  data: () => ({
    tableData: [],
    loading: false,
    isDialog: false,
    currentPage: 0,
    isViewDialog: false,
    mode: 'create',
    issuesConf: {
      title: 'Issues',
      creation_link: '/user/section/issues-reported',
      btn_label: 'View my issues'
    },
    issueOnView: {
      name: '',
      phone: '',
      email: ''
    },
    columns: ['name', 'rgDate', 'uDate']
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
    await this.getIssuesList()
  },
  methods: {
    async getIssuesList(page = this.currentPage) {
      this.loading = true
      const res = await getIssues({
        page,
        user_id: this.$auth.user.sub
      })
      if (res && res.data && res.data.r) {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    async viewSelectedIssue(_id) {
      this.loading = true

      const issue = this.tableData.filter(i => i._id === _id)[0]
      if (issue) {
        const res = await viewIssue({
          elemnt: issue.t,
          id: issue.idReport,
          user_id: this.$auth.user.sub
        })
        try {
          this.issueOnView = res.data.r[0]
          this.isViewDialog = true
        } catch {
          // Ignore
        }
      }
      this.loading = false
    },
    async deleteIssues(id) {
      await this.$confirm(
        'Are you sure you want to delete this organization. This action is irreversible',
        'Please confirm to continue'
      )
        .then(async () => {
          await deleteIssue({
            user_id: this.$auth.user.sub,
            id
          }).then(() => this.getIssuesList())
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
