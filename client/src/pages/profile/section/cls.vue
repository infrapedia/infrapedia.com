<template>
  <div
    class="main-wrapper w-fit-full mt12 pt8 vph-full pl4 pr4 flex align-items-start"
    :class="{ dark, light: !dark }"
  >
    <table-list
      ref="tableList"
      :is-loading="loading"
      :columns="columns"
      :config="tableConfig"
      :table-data="tableData"
      @edit-item="handleEditCLS"
      @delete-item="handleDeleteCLS"
      @alert-message="handleSendMessage"
      @search-input="handleCLSSearch"
      @sort-by="handleCLSSearch"
      @clear-search-input="getClssList"
      :pagination="true"
      @page-change="getClssList"
      :row-classes="['state', 'light-yellow-bg', 'false']"
    />
    <prompt-delete
      :elemnt="elemntType"
      :is-visible="promptDelete"
      @delete-cancel="$emit('delete-cancel')"
      @delete-confirm="$emit('delete-confirm')"
    />
  </div>
</template>

<script>
import { clsColumns } from '../../../config/columns'
import TableList from '../../../components/TableList.vue'
import { getClss, deleteCls, searchCls } from '../../../services/api/cls'
import { TOGGLE_MESSAGE_DIALOG } from '../../../store/actionTypes'
import { MAP_FOCUS_ON } from '../../../store/actionTypes/map'
import debounce from '../../../helpers/debounce'
import { deleteClsPermanently } from '../../../services/api/permanentDelete'

export default {
  name: 'ClsSection',
  components: {
    TableList,
    PromptDelete: () => import('../../../components/PromptDelete')
  },
  data: () => ({
    tableData: [],
    loading: false,
    promptDelete: false,
    tableConfig: {
      title: 'CLS',
      creation_link: '/user/section/create?id=cls',
      btn_label: 'Create cls'
    },
    columns: [...clsColumns].filter(col => col.showTable)
  }),
  beforeCreate() {
    this.$emit('layout', 'profile-layout')
  },
  async mounted() {
    await this.getClssList()
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    elemntType() {
      return 'cls'
    }
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
    async getClssList(page = 0) {
      this.loading = true
      const res = await getClss({ user_id: await this.$auth.getUserID(), page })
      if (res.t !== 'error' && res.data) {
        this.tableData = res.data.r
      }
      this.loading = false
    },
    handleEditCLS(_id) {
      this.$router.push({
        path: '/user/section/create',
        query: { id: 'cls', item: _id }
      })
    },
    handleDeleteCLS(_id, isPermanent) {
      this.promptDelete = true

      this.$once('delete-confirm', async () => {
        if (!isPermanent) {
          await deleteCls({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() => {
            this.handleCLSSearch(...this.$refs.tableList.getTableSearchValue())
          })
        } else {
          await deleteClsPermanently({
            user_id: await this.$auth.getUserID(),
            _id
          }).then(() => {
            this.handleCLSSearch(...this.$refs.tableList.getTableSearchValue())
          })
        }
        this.promptDelete = false
      })

      this.$once('delete-cancel', async () => {
        this.promptDelete = false
      })
    },
    handleCLSSearch: debounce(async function(s, sortBy) {
      this.loading = true
      if (s == '') {
        await this.getClssList()
        return
      }

      const res = await searchCls({
        user_id: await this.$auth.getUserID(),
        psz: true,
        s,
        sortBy
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
