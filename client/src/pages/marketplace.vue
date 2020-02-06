<template>
  <div class="main-wrapper vph-full w-fit-full">
    <div class="hero-section no-selectable bottom-shadow">
      <div class="hero-img w-fit-full">
        <!-- <img
          alt="hero image"
          src="https://images.unsplash.com/photo-1579122549707-440e9edc4a6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
          srcset="https://images.unsplash.com/photo-1579122549707-440e9edc4a6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
        /> -->
      </div>
      <div class="title-wrapper h24 p8 z-index1">
        <div class="text-center">
          <h1 class="title m0 text-bold mb8">
            Explore Infrapedia's Marketplace
          </h1>
          <p>
            The best way to source and sell your network.
          </p>
        </div>
      </div>
      <el-button
        icon="el-arrow-down"
        flat
        round
        class="z-index1 w20 text-center transparent-btn"
      >
        <fa :icon="['fas', 'angle-down']" class="animate-icon" />
      </el-button>
    </div>
    <div class="search-section flex justify-content-center row no-wrap pt8 pb8">
      <el-row :gutter="30">
        <el-col :lg="6">
          <search-table />
        </el-col>
        <el-col :lg="12">
          <card-view
            v-for="(data, i) in listingsData"
            :key="i"
            :card-data="data"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import listingsMokedData from '../mokedData/marketplaceListings'

export default {
  name: 'MarketPlace',
  components: {
    cardView: () => import('../components/marketplace/CardView'),
    searchTable: () => import('../components/marketplace/SearchTable')
  },
  data: () => ({
    listingsData: [...listingsMokedData]
  })
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/marketplace-styles.scss';
</style>
