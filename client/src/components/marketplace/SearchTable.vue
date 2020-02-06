<template>
  <div class="main-wrapper m0">
    <div>
      <el-input
        v-model="search"
        placeholder="Search marketplace listings"
        class="w80"
      >
        <fa slot="prefix" :icon="['fas', 'search']" class="mt3 ml1" />
      </el-input>
    </div>
    <div class="mt12 p4 bottom-shadow">
      Listings down here
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: ''
  })
}
</script>

<style lang="scss" scoped></style>
