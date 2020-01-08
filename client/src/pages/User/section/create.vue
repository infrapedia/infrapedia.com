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
      <cable-form
        v-if="creationType === 'cables'"
        :form="form"
        :mode="mode"
        @send-data="checkType"
      />
      <cls-form
        v-else-if="creationType === 'cls'"
        :form="form"
        :mode="mode"
        @send-data="checkType"
      />
    </div>
    <div class="right w-fit-full">
      <editor-map :is-cls="creationType === 'cls'" />
    </div>
  </div>
</template>

<script>
import { bus } from '../../../helpers/eventBus'
import { EDITOR_LOAD_DRAW } from '../../../events/editor'
import EditorMap from '../../../components/editor/Editor'
import CLSForm from '../../../components/userCreationForms/cls'
import CableForm from '../../../components/userCreationForms/cables'
import { createCls, editCls, viewCls } from '../../../services/api/cls'

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
      if (this.creationType === 'cls') {
        this.getElementOnEdit(this.$route.query.item)
      } else {
        this.getElementOnEdit(this.$route.query.item, [])
      }
    }
  },
  methods: {
    handleDialogVisibility(bool) {
      this.isPropertiesDialog = bool
    },
    checkCreationType(type) {
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
    async getElementOnEdit(_id) {
      this.mode = 'edit'
      let currentElement = {}
      if (this.creationType === 'cls') {
        const res = await viewCls({ user_id: this.$auth.user.sub, _id })
        if (res && res.data && res.data.r) {
          currentElement = res.data.r
        }
      }

      this.form = { ...currentElement }
      if (this.form.geom.features) {
        for (let feat of this.form.geom.features) {
          this.$store.dispatch('editor/confirmCreation', {
            id: feat.id,
            feature: feat,
            type: feat.geometry.type
          })
        }
        bus.$emit(`${EDITOR_LOAD_DRAW}`)
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/create-styles.scss';
</style>
