<template>
  <div
    class="text-center h-fit-full flex align-items-center"
    @click.stop="toggleVisibility"
  >
    <span class="drawer-opener">
      Market Place
      <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon" />
    </span>
    <transition
      tag="div"
      enter-active-class="animated faster slideInDown"
      leave-active-class="animated faster slideOutUp"
      mode="out-in"
    >
      <div
        v-if="isOpen"
        class="wrapper flex column bg-white pr6 pl6 pt12"
        @click.stop
      >
        <h1 class="title w-fit-full mb8">Community Market Place</h1>
        <el-table
          :data="marketplaceData"
          class="w-fit-full"
          id="marketplace-banner-table"
          :height="120"
          border
          size="small"
          max-height="620px"
          stripe
        >
          <el-table-column label="Date" prop="rgDate" :formatter="formatDate" />
          <el-table-column label="Item">
            <template slot-scope="scope">
              <div v-html="scope.row.item" />
            </template>
          </el-table-column>
          <el-table-column label="Request">
            <template slot-scope="scope">
              <div v-html="scope.row.request" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" />
        </el-table>
      </div>
    </transition>
  </div>
</template>

<script>
import { bus } from '../helpers/eventBus'
import { formatDate } from '../helpers/formatDate'
import { getMarketPlaceList } from '../services/api/marketplace'

export default {
  data: () => ({
    marketplaceData: [],
    isOpen: false
  }),
  mounted() {
    this.getMarketPlace()
    bus.$on('close-marketplace', this.handleCloseSheet)
    window.addEventListener('click', this.handleCloseSheet)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleCloseSheet)
  },
  methods: {
    async getMarketPlace() {
      const res = await getMarketPlaceList()
      if (res && res.data && res.data.r) {
        this.marketplaceData = res.data.r.map(this.formatMarketPlaceData)
      }
    },
    formatDate(_, __, value) {
      return formatDate(value)
    },
    formatMarketPlaceData(item) {
      let request = this.formatMessage(item.message)
        .split('Type:')[1]
        .split('<p style="font-size: 14px">')[1]
      let customRequest = item.message.includes('Custom Request: true')

      return {
        rgDate: item.rgDate,
        status: item.status ? 'Open' : 'Closed',
        item: `${
          this.formatMessage(item.message)
            .split('Element:')[1]
            .split('<p style')[0]
        }`,
        request: `${
          customRequest
            ? 'Data Center space: Custom requirements'
            : request
            ? `<p>${request.split('</p>')[0]}`
            : 'None'
        }`
      }
    },
    formatMessage(value) {
      const v = value.split('The user has the following request:</p>')
      return v[1]
    },
    toggleVisibility() {
      this.isOpen = !this.isOpen
    },
    handleCloseSheet() {
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/marketplace-navbar-styles.scss';
</style>
