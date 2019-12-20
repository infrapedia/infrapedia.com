<template>
  <div
    :class="{
      'is-dragover': dragover
    }"
    class="dragger-wrapper w-fit-full sm-round"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
    @click.stop="clickFileInput"
  >
    <div
      class="inner-wrapper p2 flex align-items-center column wrap justify-content-center"
    >
      <fa :icon="['fas', 'cloud-upload-alt']" class="icon upload fs-xlarge" />
      <span class="accent-text fs-regular mt2" @click.stop="clickFileInput">
        Upload kml
      </span>
      <input ref="file" type="file" class="hidden" @change="selectFile" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    dragover: false,
    file: []
  }),
  methods: {
    onDrop(e) {
      const file = e.dataTransfer.files
      if (file) this.file = Array.from(file)

      this.dragover = false
      this.$refs.file.value = ''
      this.handleFileReadProcess()
    },
    onDragover() {
      this.dragover = true
    },
    clickFileInput() {
      return this.$refs.file.click()
    },
    selectFile() {
      // @ts-ignore
      const file = this.$refs.file.files
      if (file) this.file = Array.from(file)
      this.$refs.file.value = ''
    },
    async handleFileReadProcess() {
      if (this.file.length > 1) {
        this.file = this.file.splice(1)
      }
      console.log(this.file)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/dragger-styles.scss';
</style>
