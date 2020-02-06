<template>
  <div class="main-wrapper vph-full w-fit-full no-overflow-x">
    <div class="hero-section no-selectable bottom-shadow">
      <div class="hero-img w-fit-full">
        <img
          alt="hero image bottom-shadow"
          src="https://media.istockphoto.com/photos/world-map-connectivity-picture-id908432970"
          srcset="https://media.istockphoto.com/photos/world-map-connectivity-picture-id908432970"
        />
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
    <div class="search-section pt62">
      <div class="search-wrapper">
        <search-table />
      </div>
      <div class="card-view-wrapper">
        <card-view
          v-for="(data, i) in listingsData"
          :key="i"
          :card-data="data"
          class="relative"
        />
        <div class="flex flex-center">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalPages"
          />
        </div>
      </div>
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
  }),
  computed: {
    totalPages() {
      return this.listingsData.length
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/marketplace-styles.scss';
</style>
