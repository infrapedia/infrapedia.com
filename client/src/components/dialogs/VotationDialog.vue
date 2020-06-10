<template>
  <transition name="animated slideInUp" mode="out-in">
    <div
      class="el-dialog absolute transition-all z-index12"
      :class="{ dark, visible: isVisible }"
    >
      <div>
        <el-image src="https://cdn1.infrapedia.com/assets/awards.png" />
        <p class="fs-regular p4">
          Hi!, we are having our first Infrapedia Infrastructure Awards and we
          would love if you can be part of the voting process.
        </p>
      </div>
      <footer class="footer flex wrap mt4 p2">
        <div>
          <el-button
            type="primary"
            plain
            class="mr2"
            style="width: 9.5rem"
            @click="redirecToVotingPage"
            @keyup.enter.space="redirecToVotingPage"
            >Would like to vote</el-button
          >
          <el-button
            style="width: 9.5rem"
            plain
            type="info"
            @click="closeDialog"
            >Not interested</el-button
          >
        </div>
      </footer>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'VotationDialog',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    customDialogClass() {
      return this.dark ? 'dark' : 'light'
    }
  },
  methods: {
    redirecToVotingPage() {
      this.$router.replace('/vote')
    },
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/votation-dialog.scss';
</style>
