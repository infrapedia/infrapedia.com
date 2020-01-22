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
      :table-data="issues"
      @delete-item="deleteIssues"
    />

    <div class="flex w-fit-full align-items-center justify-content-center mt12">
      <el-pagination
        @current-change="getIssuesList"
        :current-page.sync="currentPage"
        layout="prev, next"
        :total="totalPages"
      />
    </div>
  </div>
</template>

<script>
import TableList from '../../../components/TableList.vue'
import { deleteIssue, getIssues } from '../../../services/api/issues'

export default {
  components: {
    TableList
  },
  data: () => ({
    issues: [],
    myIssues: [],
    loading: false,
    isDialog: false,
    currentPage: 0,
    mode: 'create',
    issuesConf: {
      title: 'Issues',
      creation_link: '/user/section/issues-reported',
      btn_label: 'View my issues'
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
        this.issues = res.data.r
      }
      this.loading = false
    },
    async deleteIssues(_id) {
      await this.$confirm(
        'Are you sure you want to delete this organization. This action is irreversible',
        'Please confirm to continue'
      )
        .then(async () => {
          await deleteIssue({
            user_id: this.$auth.user.sub,
            _id
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
