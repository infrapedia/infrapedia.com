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
          {{ helpText }}
        </span>
        <input ref="file" type="file" class="hidden" @change="selectFile" />
      </div>
    </div>
    <div
      class="loading-bar-wrapper absolute h-fit-full flex align-items-center row wrap justify-content-center w-fit-full"
      v-if="isUploadingKMZ"
    >
      <loading-bar />
      <p class="m0">
        {{ loadingText }}
      </p>
    </div>
    <el-alert
      v-if="showAlert"
      type="success"
      class="mt4"
      title="The conversion has been successful! You should see the result on the map now"
      :closable="false"
      show-icon
    />
  </div>
</template>

<script>
import {
  //   kmzPointsToJSON,
  //   kmzLinesToJSON,
  convertFileToGeojson
} from '../services/api/uploads'
import { fCollectionFormat } from '../helpers/featureCollection'

export default {
  components: {
    LoadingBar: () => import('./LoadingBar')
  },
  data: () => ({
    file: [],
    loadingText: '',
    dragover: false,
    showAlert: false,
    isUploadingKMZ: false
  }),
  props: {
    creationType: {
      type: String,
      default: () => 'cables'
    },
    isRawFile: {
      type: Boolean,
      default: () => false
    },
    helpText: {
      type: String,
      default: () => 'Upload kmz/kml'
    }
  },
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
      if (this.isRawFile && this.file.length) {
        return this.$emit('raw-file', this.file[0])
      }

      this.isUploadingKMZ = true
      this.showAlert = false
      this.loadingText = 'We are loading your file. This will take a moment'
      if (this.file.length > 1) {
        this.file = this.file.splice(1)
      }

      const user_id = await this.$auth.getUserID()
      const {
        data: { r: fCollection }
      } = (await convertFileToGeojson({ file: this.file, user_id })) || {
        data: { fCollection: fCollectionFormat() }
      }

      this.loadingText =
        'We are converting your file from kmz to geojson format'

      if (
        fCollection &&
        fCollection.features &&
        fCollection.features.length > 0
      ) {
        this.$emit('handle-file-converted', fCollection)
        this.showAlert = true
        this.showAlert = false
      } else {
        this.loadingText = 'The conversion has failed! ... Please try again'
        this.$emit('dragger-geojson-upload-failed')
      }
      this.isUploadingKMZ = false
      this.isConvertingKMZ = false
      setTimeout(() => {
        this.loadingText = ''
        this.showAlert = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/dragger-styles.scss';
</style>
