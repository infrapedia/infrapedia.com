<template>
  <div
    class="main-wrapper flex row nowrap w-fit-full vph-full pt12 text-center"
    :class="{ dark, light: !dark }"
  >
    <div class="left el-card p6">
      <header class="w-fit-full text-left mb8">
        <router-link :to="routeGiver">
          <fa :icon="['fas', 'arrow-left']" />
        </router-link>
      </header>
      <component
        :is="currentView"
        :form="form"
        :mode="mode"
        @send-data="checkType"
        @handle-file-converted="handleFileConverted"
      />
    </div>
    <div class="right w-fit-full">
      <editor-map :is-cls="creationType === 'cls'" />
    </div>
  </div>
</template>

<script>
import { bus } from '../../../helpers/eventBus'
import cableStates from '../../../config/cableStates'
import EditorMap from '../../../components/editor/Editor'
import CLSForm from '../../../components/userCreationForms/cls'
import CableForm from '../../../components/userCreationForms/cables'
import { createCls, editCls, viewCls } from '../../../services/api/cls'
import { createCable, editCable, viewCable } from '../../../services/api/cables'
import { EDITOR_LOAD_DRAW, EDITOR_FILE_CONVERTED } from '../../../events/editor'

export default {
  name: 'CreateSection',
  components: {
    'cls-form': CLSForm,
    'editor-map': EditorMap,
    'cable-form': CableForm
  },
  data() {
    return {
      form: {},
      mode: 'create',
      isPropertiesDialog: false,
      creationType: this.$route.query.id
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    currentView() {
      return this.creationType === 'cls' ? CLSForm : CableForm
    },
    checkType() {
      if (this.mode === 'edit') {
        return this.creationType === 'cls' ? this.editCLS : this.editCable
      } else {
        return this.creationType === 'cls' ? this.createCLS : this.createCable
      }
    },
    routeGiver() {
      const { creationType } = this
      let route = '/user/section/cables'
      switch (creationType) {
        case 'cls':
          route = '/user/section/cls'
          break
        default:
          route = '/user/section/cables'
          break
      }
      return route
    }
  },
  async mounted() {
    if (!this.$route.query.id) {
      return this.$router.push('/')
    }

    this.creationType = this.$route.query.id
    this.checkCreationType(this.creationType)

    if (this.$route.query.item) {
      this.getElementOnEdit(this.$route.query.item)
    }
  },
  methods: {
    handleFileConverted(fc) {
      return bus.$emit(`${EDITOR_FILE_CONVERTED}`, fc)
    },
    handleDialogVisibility(bool) {
      this.isPropertiesDialog = bool
    },
    async checkCreationType(type) {
      switch (type) {
        case 'cls':
          this.form = {
            name: '',
            slug: '',
            cables: [],
            state: null,
            geom: this.$store.state.editor.scene.features.list
          }
          break
        case 'cables':
          this.form = {
            cls: [],
            urls: [],
            name: '',
            notes: '',
            facilities: [],
            fiberPairs: '',
            systemLength: 0,
            capacityTBPS: 0,
            terrestrial: false,
            status: cableStates[0],
            activationDateTime: '',
            geom: this.$store.state.editor.scene.features.list
          }
          break
      }
    },
    async getElementOnEdit(_id) {
      this.mode = 'edit'
      let currentElement = {}

      switch (this.creationType) {
        case 'cls':
          currentElement = await this.viewCurrentCLS(_id)
          break
        case 'cable':
          currentElement = await this.viewCurrentCable(_id)
          break
      }

      this.form = { ...currentElement }
      if (this.form.geom && this.form.geom.features) {
        this.$store.dispatch('editor/setList', this.form.geom.features)
        this.form.geom = this.$store.state.editor.scene.features.list
        bus.$emit(`${EDITOR_LOAD_DRAW}`)
      }
    },
    async viewCurrentCLS(_id) {
      const res = await viewCls({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async viewCurrentCable(_id) {
      const res = await viewCable({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async createCLS() {
      const res = await createCls({
        ...this.form,
        user_id: this.$auth.user.sub
      })
      if (res.t !== 'err') {
        return this.$router.push('/user/section/cls')
      }
    },
    async editCLS() {
      const res = await editCls({
        ...this.form,
        user_id: this.$auth.user.sub,
        _id: this.$route.query.item
      })
      if (res.t !== 'err') {
        return this.$router.push('/user/section/cls')
      }
    },
    async createCable() {
      const res = await createCable({
        ...this.form,
        user_id: this.$auth.user.sub
      })
      if (res.t !== 'err') {
        return this.$router.push('/user/section/cables')
      }
    },
    async editCable() {
      const res = await editCable({
        ...this.form,
        user_id: this.$auth.user.sub,
        _id: this.$route.query.item
      })
      if (res.t !== 'err') {
        return this.$router.push('/user/section/cables')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/create-styles.scss';
</style>
