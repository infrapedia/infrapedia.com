<template>
  <el-dialog
    :visible="visible"
    width="30%"
    :before-close="handleBeforeClose"
    :close-on-click-modal="false"
  >
    <header slot="title" class="w-fit-full">
      <h1 class="title-user-variant w-fit-full fs-xlarge text-center">
        {{ title }} organization
      </h1>
    </header>
    <el-form ref="form" :model="form" class="p2">
      <el-form-item label="Name">
        <el-input class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="Notes">
        <el-input
          type="textarea"
          class="w-fit-full"
          v-model="form.notes"
          :rows="4"
        />
      </el-form-item>
      <el-upload
        accept="image/*.jpg"
        :action="uploadURL"
        :file-list="fileList"
        :headers="uploadLogoHeaders"
        :on-success="handleLogoUpload"
      >
        <el-button size="small" type="primary">Click to upload</el-button>
        <div slot="tip" class="el-upload__tip mt2 ml1">
          - jpg files only
        </div>
      </el-upload>
      <el-form-item label="Address" class="mt2">
        <el-tag
          :key="i"
          v-for="(tag, i) in form.address"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag.reference }}
          <fa
            :icon="['fas', 'pen']"
            class="cursor-pointer w24 ml1 inline-block"
            @click="editAddress(tag, i)"
          />
        </el-tag>
        <br />
        <el-collapse-transition>
          <el-card v-if="inputVisible" class="p4 w-auto mt4" shadow="never">
            <div class="w-fit-full">
              <label class="el-input__label" for="tagname">
                Reference
              </label>
              <el-input
                name="street"
                type="url"
                v-model="tag.reference"
                ref="saveTagInput"
                size="mini"
              />
            </div>
            <div>
              <label class="el-input__label" for="street">
                Street
              </label>
              <el-input
                name="street"
                type="url"
                v-model="tag.street"
                size="mini"
                placeholder="Street and number, P.O. box, c/o."
              />
              <el-input
                size="mini"
                v-model="tag.apt"
                placeholder="Apartment, suite, unit, building, floor, etc"
              />
            </div>
            <div>
              <label class="el-input__label" for="city">
                City
              </label>
              <el-input
                name="street"
                type="url"
                v-model="tag.city"
                size="mini"
                placeholder
              />
            </div>
            <div>
              <label for="state">State / Province / Region</label>
              <el-input size="mini" v-model="tag.state" />
            </div>
            <div>
              <label for="state">
                Zip Code
              </label>
              <el-input
                size="mini"
                type="number"
                v-model="tag.zipcode"
                placeholder
              />
            </div>
            <div class="flex justify-content-end pt3">
              <el-button
                plain
                type="success"
                size="mini"
                class="mr4"
                @click="handleSaveAddress"
              >
                Save address
              </el-button>
              <el-button plain size="mini" @click="clearAddress">
                Cancel
              </el-button>
            </div>
          </el-card>
          <el-button
            v-else
            class="w42 text-center"
            size="small"
            @click="showInput"
          >
            Add
          </el-button>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item class="mt12">
        <el-button type="primary" class="mr8" round @click="sendData">
          {{ title }} organization
        </el-button>
        <el-button round @click="handleBeforeClose">
          Cancel
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import apiConfig from '../../config/apiConfig'

export default {
  name: 'OrgForm',
  data: () => ({
    fileList: [],
    tag: {
      reference: '',
      street: '',
      apt: '',
      city: '',
      state: '',
      zipcode: ''
    },
    tagOnEdit: null,
    inputVisible: false
  }),
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  computed: {
    uploadLogoHeaders() {
      return { user_id: this.$auth.user.sub }
    },
    title() {
      return this.mode === 'create' ? 'Create' : 'Edit'
    },
    uploadURL() {
      return `${apiConfig.url}/auth/upload/logo`
    }
  },
  // watch: {
  //   visible(bool) {
  //     if (bool && this.form.logo && this.mode === 'edit') {
  //       this.fileList.push([{ name: this.form.logo, url: this.form.logo }])
  //     }
  //   }
  // },
  methods: {
    handleLogoUpload(res) {
      if (!res.data && res.data.r.length) return
      this.form.logo = res.data.r[0]
    },
    sendData() {
      return this.$emit('send-data')
    },
    handleBeforeClose() {
      this.fileList = []
      this.tagOnEdit = null
      return this.$emit('close')
    },
    handleClose(tag) {
      return this.form.address.splice(this.form.address.indexOf(tag), 1)
    },
    clearAddress() {
      this.inputVisible = false
      this.tagOnEdit = null
      this.tag = {
        reference: '',
        street: '',
        apt: '',
        city: '',
        state: '',
        zipcode: ''
      }
    },
    editAddress(tag, i) {
      this.tag = { ...tag }
      this.tagOnEdit = i
      this.inputVisible = true
    },
    handleSaveAddress() {
      const { tagOnEdit } = this

      if (tagOnEdit === null) this.form.address.push({ ...this.tag })
      else this.form.address[tagOnEdit] = { ...this.tag }
      this.clearAddress()
    },
    showInput() {
      this.inputVisible = true
      try {
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      } catch (err) {
        console.error(err)
      }
    },
    confirmTag() {
      let tag = this.tag
      const isTagAlreadyCreated = this.form.address.includes(tag)
      if (isTagAlreadyCreated) return

      if (tag) this.form.address.push(tag)
      this.inputVisible = false
      this.tag = ''
    }
  }
}
</script>
