<template>
  <el-dialog
    :visible="visible"
    width="80%"
    :custom-class="dark ? dark : ''"
    :before-close="handleBeforeClose"
    :close-on-click-modal="false"
  >
    <header slot="title" class="w-fit-full">
      <h1
        class="title-user-variant w-fit-full fs-xlarge text-center"
        :class="{ dark }"
      >
        {{ title }} organization
      </h1>
    </header>
    <el-form ref="form" :model="form" class="p2">
      <el-form-item label="Name">
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="Notes">
        <el-input
          :class="{ dark }"
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
        <div slot="tip" class="el-upload__tip mt2 ml1" :class="{ dark }">
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
                :class="{ dark }"
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
                :class="{ dark }"
                v-model="tag.street"
                size="mini"
                placeholder="Street and number, P.O. box, c/o."
              />
              <el-input
                :class="{ dark }"
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
                :class="{ dark }"
                v-model="tag.city"
                size="mini"
                placeholder
              />
            </div>
            <div>
              <label for="state">State / Province / Region</label>
              <el-input :class="{ dark }" size="mini" v-model="tag.state" />
            </div>
            <div>
              <label for="state">
                Zip Code
              </label>
              <el-input
                :class="{ dark }"
                size="mini"
                type="number"
                v-model="tag.zipcode"
                placeholder
              />
            </div>
            <div
              class="flex row wrap justify-content-end justify-center-sm pt3"
            >
              <el-button
                plain
                :class="{ dark }"
                type="success"
                size="mini"
                class="w25 h8 mb4"
                @click="handleSaveAddress"
              >
                Save address
              </el-button>
              <el-button
                class="w25 h8"
                :class="{ dark }"
                size="mini"
                @click="clearAddress"
              >
                Cancel
              </el-button>
            </div>
          </el-card>
          <el-button
            v-else
            :class="{ dark }"
            class="w42 text-center"
            size="small"
            @click="showInput"
          >
            Add
          </el-button>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item class="mt12">
        <el-button
          :class="{ dark }"
          type="primary"
          plain
          class="mr8 mb2"
          round
          @click="sendData"
        >
          {{ title }} organization
        </el-button>
        <el-button
          class="w42"
          :class="{ dark }"
          round
          @click="handleBeforeClose"
        >
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
    dark() {
      return this.$store.state.isDark
    },
    uploadURL() {
      return `${apiConfig.url}/auth/upload/logo`
    }
  },
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
      } catch {
        // Ignore
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
