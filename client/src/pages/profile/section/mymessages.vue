<template>
  <div
    class="main-wrapper w-fit-full mt12 pt8 vph-full pl4 pr4 flex row wrap align-items-start"
    :class="{ dark, light: !dark }"
  >
    <table-list
      :is-loading="loading"
      :can-edit="false"
      :columns="columns"
      :config="config"
      :can-view="true"
      :can-create="false"
      :table-data="tableData"
      @view-item="viewSelectedMessage"
      :return-link="returnLink"
      @delete-item="deleteMessages"
      :row-classes="['status', 'light-yellow-bg', 'false']"
    />

    <div class="flex w-fit-full align-items-center justify-content-center">
      <el-pagination
        @current-change="getMyMessagesList"
        :current-page.sync="currentPage"
        layout="prev, next"
      />
    </div>
    <view-data-dialog
      @close="() => (isViewDialog = false)"
      :is-visible="isViewDialog"
      :data="issueOnView"
      :accepted-keys="['rgDate', 'message', 'email', 'phone']"
    />
  </div>
</template>

<script>
import {
  deleteMessage,
  getMyMessages,
  viewMessage
} from '../../../services/api/messages'
import TableList from '../../../components/TableList.vue'

export default {
  components: {
    TableList,
    ViewDataDialog: () => import('../../../components/dialogs/ViewData')
  },
  data: () => ({
    tableData: [],
    loading: false,
    isDialog: false,
    currentPage: 0,
    mode: 'create',
    config: {
      title: 'My messages',
      creation_link: false,
      btn_label: false
    },
    isViewDialog: false,
    issueOnView: {
      name: '',
      phone: '',
      email: ''
    },
    columns: [
      { label: 'Name', value: 'name' },
      { label: 'Register date', value: 'rgDate' },
      { label: 'Type', value: 't' },
      { label: 'Element status', value: 'elemntStatus' },
      { label: 'Update date', value: 'uDate' }
    ]
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    returnLink() {
      return {
        visible: true,
        url: '/user/section/messages'
      }
    }
  },
  async mounted() {
    await this.getMyMessagesList()
  },
  methods: {
    async getMyMessagesList(page = this.currentPage) {
      this.loading = true
      const res = await getMyMessages({
        page,
        user_id: this.$auth.user.sub
      })

      if (res && res.data && res.data.r) {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    async viewSelectedMessage(_id) {
      this.loading = true

      const issue = this.tableData.filter(i => i._id === _id)[0]
      if (issue) {
        const res = await viewMessage({
          elemnt: issue.t,
          id: issue.idMessage,
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
    viewedClass({ row }) {
      return row.viewed ? 'light-yellow-bg' : ''
    },
    async deleteMessages(id) {
      return await this.$confirm(
        'Are you sure you want to delete this message. This action is irreversible',
        'Please confirm to continue'
      )
        .then(async () => {
          await deleteMessage({
            user_id: this.$auth.user.sub,
            id
          }).then(() => this.getMyMessagesList())
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
