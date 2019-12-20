<template>
  <div
    class="main-wrapper flex row nowrap w-fit-full vph-full pt12 text-center"
    :class="{ dark, light: !dark }"
  >
    <div class="left el-card p6">
      <el-card shadow="never" class="pb6 pt6 pr8 pl8">
        <header slot="header" class="w-fit-full mb8">
          <h1 class="title">
            Create cable
          </h1>
        </header>
        <el-form ref="form" :model="form">
          <el-form-item label="Name">
            <el-input class="w-fit-full" v-model="form.name" />
          </el-form-item>
          <el-form-item label="System length">
            <el-input-number
              :min="0"
              class="w-fit-full"
              controls-position="right"
              v-model="form.system_length"
            />
          </el-form-item>
          <el-form-item label="Activation date">
            <el-date-picker
              class="w-fit-full-imp"
              v-model="form.activationDateTime"
            />
          </el-form-item>
          <el-form-item label="URL(s)">
            <el-tag
              :key="tag"
              v-for="tag in form.urls"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              type="url"
              v-if="inputVisible"
              v-model="tag"
              ref="saveTagInput"
              size="mini"
              @keyup.enter.native="confirmTag"
              @blur="confirmTag"
            />
            <el-button
              v-else
              class="w42 text-center"
              size="small"
              @click="showInput"
            >
              Add url
            </el-button>
          </el-form-item>
          <el-form-item label="Terrestrial">
            <el-radio-group v-model="form.terrestrial">
              <el-radio :label="true">
                Yes
              </el-radio>
              <el-radio :label="false">
                No
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="flo-right">
            <el-button type="primary" round @click="sendData">
              Create and start drawing
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="right w-fit-full">
      <editor-map />
    </div>
  </div>
</template>

<script>
import EditorMap from '../../../components/editor/Editor'

export default {
  name: 'CreateSection',
  components: {
    'editor-map': EditorMap
  },
  data: () => ({
    form: {},
    tag: '',
    creationType: null,
    inputVisible: false
  }),
  mounted() {
    if (!this.$route.query.id) {
      return this.$router.push('/')
    }

    this.creationType = this.$route.query.id
    this.checkCreationType(this.creationType)
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    sendData() {
      console.warn('Not done yet')
    },
    checkCreationType(type) {
      switch (type) {
        case 'cable':
          this.form = {
            cls: '',
            name: '',
            urls: [],
            notes: '',
            facilities: '',
            fiberPairs: '',
            system_length: 0,
            capacity_tbps: 0,
            terrestrial: false,
            activationDateTime: ''
          }
          break
        default:
          this.form = {
            cls: '',
            name: '',
            urls: [],
            notes: '',
            facilities: '',
            fiberPairs: '',
            system_length: 0,
            capacity_tbps: 0,
            terrestrial: false,
            activationDateTime: ''
          }
          break
      }
    },
    handleClose(tag) {
      this.form.urls.splice(this.form.urls.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    confirmTag() {
      let tag = this.tag
      const isTagAlreadyCreated = this.form.urls.includes(tag)
      if (isTagAlreadyCreated) return

      if (tag) this.form.urls.push(tag)
      this.inputVisible = false
      this.tag = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/create-styles.scss';
</style>
