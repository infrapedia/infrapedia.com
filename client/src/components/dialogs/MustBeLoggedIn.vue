<template>
  <el-dialog
    :visible.sync="isVisible"
    width="40%"
    top="12vh"
    :show-close="false"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <div
          :class="{ animate: true }"
        >
          <el-image
            fit="contain"
            src="https://cdn1.infrapedia.com/assets/img/light-mode-logo.svg"
          />
      </div>
    </header>
    <div>
      <h1 style="font-weight: 400; font-size: 1.2em">
        You must be signed in to continue
      </h1>
    </div>
    <footer class="footer flex wrap justify-content-end pr0 pl6 mt4">
      <div>
        <el-button
          type="primary"
          class="w28"
          plain
          @click="redirect"
        >
          Sign in
        </el-button>
      </div>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    customDialogClass() {
      return this.dark ? 'custom-dialog dark login-dialog' : 'custom-dialog light login-dialog'
    }
  },
  methods: {
    async redirect() {
      this.$router.push('/login')
    }
  }
}
</script>

<style>
</style>
