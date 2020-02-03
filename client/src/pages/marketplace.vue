<template>
  <div class="main-wrapper vph-full w-fit-full">
    <div class="hero-section no-selectable bottom-shadow">
      <div class="hero-img w-fit-full">
        <!-- <img
          alt="hero image"
          src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
          srcset="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
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
    <div class="search-section flex justify-content-center row wrap mt24 mb30">
      <div class="left w80 text-center">
        Left section
      </div>
      <el-divider direction="vertical" />
      <div class="right w80 text-center">
        right section
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarketPlace'
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/marketplace-styles.scss';
</style>
