<template>
  <div class="relative">
    <div
      :class="{
        'is-dragover': dragover,
        'no-opacity': isUploadingKMZ
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
    <div
      class="loading-bar-wrapper absolute h-fit-full flex align-items-center row wrap justify-content-center w-fit-full"
      v-if="isUploadingKMZ"
    >
      <loading-bar />
      {{ loadingText }}
    </div>
  </div>
</template>

<script>
import { kmzToJSON, uploadKmz } from '../services/api/uploads'
import LoadingBar from './LoadingBar'

export default {
  components: {
    LoadingBar
  },
  data: () => ({
    file: [],
    loadingText: '',
    dragover: false,
    isUploadingKMZ: false
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
      this.loadingText = 'We are loading your file. This will take a moment'
      if (this.file.length > 1) {
        this.file = this.file.splice(1)
      }

      const user_id = this.$auth.user.sub
      const res = await uploadKmz({ file: this.file, user_id })

      if (res && res.data.r && res.data.r.length) {
        this.loadingText =
          'We are converting your file from kmz to geojson format'
        const fCollection = await kmzToJSON({ link: res.data.r[0], user_id })

        if (fCollection && fCollection.data.r) {
          this.$emit('handle-file-converted', fCollection.data.r)
          this.loadingText =
            'The conversion has being succesfull! You should see now the result on the map'
        } else {
          this.loadingText = 'The conversion has failed! ... Please try again'
        }
        this.isConvertingKMZ = false
      }
      this.isUploadingKMZ = false
      this.loadingText = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/dragger-styles.scss';
</style>
