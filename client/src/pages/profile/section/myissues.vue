<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <div>
      <header
        class="flex w-fit-full p2 row nowrap justify-content-space-between"
      >
        <h1 class="title-user color-inherit">
          My issues reported
        </h1>
      </header>
      <el-divider />
      <el-card shadow="never">
        <el-table
          :data="tableData"
          :row-class-name="viewedClass"
          max-height="700"
          v-loading="loading"
        >
          <el-table-column :label="col" v-for="(col, i) in columns" :key="i">
            <template slot-scope="scope">
              <span>
                {{ `${scope.row[col]}` }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="120">
            <template slot-scope="scope">
              <el-button
                size="small"
                class="p2 mr4 fs-regular no-y"
                @click="
                  viewIssue({
                    _id: scope.row.t || scope.row._id,
                    idReport: scope.row.idReport || false
                  })
                "
              >
                <fa :icon="['fas', 'eye']" />
              </el-button>
              <el-button
                type="danger"
                class="p2 fs-regular no-y"
                size="small"
                @click="deleteIssues(scope.row.idReport)"
              >
                <fa :icon="['fas', 'trash']" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="flex w-fit-full align-items-center justify-content-center mt12">
      <el-pagination
        @current-change="getMyIssuesList"
        :current-page.sync="currentPage"
        layout="prev, next"
      />
    </div>
    <el-dialog
      :visible.sync="isViewDialog"
      width="40%"
      top="12vh"
      :custom-class="customDialogClass"
      :close-on-click-modal="false"
    >
      <header slot="title" class="p0 no-selectable">
        <h1 class="inline-block font-semibold fs-xlarge">
          Viewing issue: {{ issueOnView.name }}
        </h1>
      </header>
      <el-row>
        <el-col :span="18">
          <p>Issue:</p>
        </el-col>
        <el-col :span="6">
          <p>{{ issueOnView.issue }}</p>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteIssue,
  getMyIssues,
  viewIssue
} from '../../../services/api/issues'

export default {
  data: () => ({
    issues: [],
    tableData: [],
    loading: false,
    isDialog: false,
    currentPage: 0,
    mode: 'create',
    isViewDialog: false,
    issueOnView: {
      name: '',
      phone: '',
      email: ''
    },
    columns: ['name', 'rgDate', 't', 'elemntStatus', 'uDate']
  }),
  computed: {
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    },
    dark() {
      return this.$store.state.isDark
    }
  },
  async mounted() {
    await this.getMyIssuesList()
  },
  methods: {
    async getMyIssuesList(page = this.currentPage) {
      this.loading = true
      const res = await getMyIssues({
        page,
        user_id: this.$auth.user.sub
      })
      if (res && res.data && res.data.r) {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    async viewIssue({ _id, idReport }) {
      this.loading = true
      const res = await viewIssue({
        elemnt: _id,
        id: idReport,
        user_id: this.$auth.user.sub
      })
      try {
        this.issueOnView = res.data.r[0]
        this.isViewDialog = true
      } catch {
        // Ignore
      }
      this.loading = false
    },
    viewedClass({ row }) {
      return row.viewed ? 'light-yellow-bg' : ''
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
          }).then(() => this.getMyIssuesList())
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
