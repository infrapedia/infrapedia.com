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
          {{ tableConfig.title }}
        </h1>
      </header>
      <el-divider />
      <el-card shadow="never">
        <el-table
          :data="tableData"
          max-height="700"
          v-loading="loading"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            :label="col.label"
            v-for="(col, i) in columns"
            :key="i"
          >
            <template slot-scope="scope">
              {{ `${scope.row[col.value]}` }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="120">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.disabled"
                type="primary"
                class="p2 no-y fs-regular"
                size="small"
                @click="toggleSelectedAlert(scope.row._id)"
              >
                <fa :icon="['fas', 'bell']" />
              </el-button>
              <el-button
                v-else
                type="danger"
                class="p2 no-y fs-regular"
                size="small"
                @click="toggleSelectedAlert(scope.row._id)"
              >
                <fa :icon="['fas', 'bell']" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

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
import { getUserData } from '../../../services/api/auth'
import {
  getAlerts,
  createAlert,
  disableAlert
} from '../../../services/api/alerts'
import { getSelectionTypeNumber } from '../../../helpers/getSelectionTypeNumber'

export default {
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
    columns: [
      { label: 'Name', value: 'name' },
      { label: 'Type', value: 't' },
      { label: 'Element status', value: 'status' }
    ]
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
    tableRowClassName({ row }) {
      return !row.status ? 'light-yellow-bg' : ''
    },
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
    async toggleSelectedAlert(_id) {
      const elemnt = this.tableData.filter(alert => alert._id === _id)[0]
      if (elemnt) {
        this.loading = true
        try {
          if (!elemnt.disabled) {
            return await this.$confirm(
              'Are you sure you want to disable this alert?',
              'Please confirm to continue'
            )
              .then(async () => {
                await disableAlert({
                  user_id: this.$auth.user.sub,
                  elemnt: elemnt._idElement,
                  t: getSelectionTypeNumber(elemnt.t)
                })
              })
              .catch(() => {})
          } else if (elemnt.disabled) {
            const userData = await getUserData(this.$auth.user.sub)
            if (userData) {
              return await createAlert({
                user_id: this.$auth.user.sub,
                elemnt: elemnt._idElement,
                email: userData.email,
                phone:
                  userData.user_metadata && userData.user_metadata.phonenumber
                    ? userData.user_metadata.phonenumber.num
                    : '',
                t: getSelectionTypeNumber(elemnt.t)
              })
            }
          }
        } catch (err) {
          return console.error(err)
        } finally {
          this.loading = false
          this.getALertsList()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/section-styles.scss';
</style>
