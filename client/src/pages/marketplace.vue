<template>
  <div class="main-wrapper vph-full overflow-y-auto mt12 p2">
    <div class="h24 p8">
      <div>
        <h1 class="title">
          Explore Infrapedia's Marketplace
        </h1>
        <small>
          The best way to source and sell your network.
        </small>
      </div>
    </div>
    <el-divider />
    <div class="flex justify-content-center row wrap mt4 shadow-bottom">
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
