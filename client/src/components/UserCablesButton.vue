<template>
  <div class="absolute mainw">
    <el-button round @click="toggleListVisibility">
      My cables
    </el-button>
    <div v-if="isListOpen">
      <div v-for="i in 10" :key="i">
        {{ i }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCablesButton',
  data: () => ({
    isListOpen: false
  }),
  methods: {
    toggleListVisibility() {
      this.isListOpen = !this.isListOpen
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/user-cables-button-syles.scss';
</style>
