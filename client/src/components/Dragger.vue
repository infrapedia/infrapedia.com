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
        Upload kmz
      </span>
      <input ref="file" type="file" class="hidden" @change="selectFile" />
    </div>
  </div>
</template>

<script>
import { kmzToJSON, uploadKmz } from '../services/api/uploads'

export default {
  data: () => ({
    file: [],
    dragover: false,
    isUploadingKMZ: false,
    isConvertingKMZ: false
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
      const file = this.$refs.file.files
      if (file) this.file = Array.from(file)
      this.$refs.file.value = ''
      this.handleFileReadProcess()
    },
    async handleFileReadProcess() {
      this.isUploadingKMZ = true
      if (this.file.length > 1) {
        this.file = this.file.splice(1)
      }

      const user_id = this.$auth.user.sub
      const res = await uploadKmz({ file: this.file, user_id })

      if (res && res.data.r && res.data.r.length) {
        this.isConvertingKMZ = true
        const fCollection = await kmzToJSON({ link: res.data.r[0], user_id })

        if (fCollection && fCollection.data.r) {
          this.$emit('handle-file-converted', fCollection.data.r)
          this.isConvertingKMZ = false
        }
      }
      this.isUploadingKMZ = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/dragger-styles.scss';
</style>
