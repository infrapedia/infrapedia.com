<template>
  <div
    class="main-wrapper flex row nowrap w-fit-full vph-full pt12 text-center"
    :class="{ dark, light: !dark }"
  >
    <div class="left el-card p6" v-loading="loading">
      <header class="w-fit-full text-left mb8">
        <router-link :to="routeGiver" v-if="creationType !== 'map'">
          <fa :icon="['fas', 'arrow-left']" />
        </router-link>
      </header>
      <component
        :is="currentView"
        :form="form"
        :mode="mode"
        :is-sending-data="isSendingData"
        @send-data="checkType"
        @handle-file-converted="handleFileConverted"
      />
    </div>
    <div class="right w-fit-full">
      <editor-map :type="creationType" :key="mapKey" />
    </div>
  </div>
</template>

<script>
import { bus } from '../../../helpers/eventBus'
import cableStates from '../../../config/cableStates'
import EditorMap from '../../../components/editor/Editor'
import CLSForm from '../../../components/userCreationForms/cls'
import CableForm from '../../../components/userCreationForms/cables'
import { createCls, editCls, viewClsOwner } from '../../../services/api/cls'
import {
  createCable,
  editCable,
  viewCableOwner
} from '../../../services/api/cables'
import { EDITOR_LOAD_DRAW, EDITOR_FILE_CONVERTED } from '../../../events/editor'
import MapForm from '../../../components/userCreationForms/map'
import { getMyMap, setMyMap } from '../../../services/api/map'

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
      mapKey: 0,
      mode: 'create',
      loading: false,
      isSendingData: false,
      isPropertiesDialog: false,
      creationType: this.$route.query.id
    }
  },
  watch: {
    '$store.state.editor.scene.features.list'(fc) {
      if (this.form.geom && fc.length) {
        this.form.geom = JSON.parse(JSON.stringify(fc))
      }
    },
    '$route.query'(q) {
      if (q.id !== this.creationType) {
        this.creationType = q.id
        this.mapKey += 1
      }
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    currentView() {
      let view

      switch (this.creationType) {
        case 'cls':
          view = CLSForm
          break
        case 'map':
          view = MapForm
          break
        default:
          view = CableForm
          break
      }
      return view
    },
    featuresList() {
      return this.$store.state.editor.scene.features.list
    },
    checkType() {
      let method

      if (this.mode === 'edit') {
        switch (this.creationType) {
          case 'cls':
            method = this.editCLS
            break
          case 'map':
            method = this.setMap
            break
          default:
            method = this.editCable
            break
        }
      } else {
        switch (this.creationType) {
          case 'cls':
            method = this.createCLS
            break
          case 'map':
            method = this.setMap
            break
          default:
            method = this.createCable
            break
        }
      }

      return method
    },
    routeGiver() {
      const { creationType } = this
      let route
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
    } else if (this.$route.query.id === 'map') {
      await this.checkUserMapExistance()
    }
  },
  methods: {
    async checkUserMapExistance() {
      this.loading = true
      const res = await getMyMap({ user_id: this.$auth.user.sub })
      if (res && res.t !== 'error' && res.data && res.data.r) {
        this.mode = 'edit'
        const {
          subdomain,
          googleID,
          cls,
          facilities,
          cables,
          logos,
          draw
        } = res.data.r

        this.form = {
          subdomain,
          googleID,
          logos: Array.isArray(logos) ? logos : [],
          cls: Array.isArray(cls) ? cls.map(c => JSON.parse(c)) : [],
          cables: Array.isArray(cables) ? cables.map(c => JSON.parse(c)) : [],
          facilities: Array.isArray(facilities)
            ? facilities.map(f => JSON.parse(f))
            : []
        }

        const fc = typeof draw === 'string' ? JSON.parse(draw) : draw
        if (fc.features && fc.features.length) {
          this.$store.dispatch('editor/setList', fc.features)
          bus.$emit(`${EDITOR_LOAD_DRAW}`)
        }
      }
      this.loading = false
    },
    handleFileConverted(fc) {
      return bus.$emit(`${EDITOR_FILE_CONVERTED}`, fc)
    },
    handleDialogVisibility(bool) {
      this.isPropertiesDialog = bool
    },
    async setMap(data) {
      this.isSendingData = true
      const res = await setMyMap({ ...data, user_id: this.$auth.user.sub })
      if (res && res.t !== 'error') {
        await this.checkUserMapExistance()
      }
      this.isSendingData = false
    },
    async checkCreationType(type) {
      switch (type) {
        case 'cls':
          this.form = {
            name: '',
            slug: '',
            tags: [],
            cables: [],
            state: null,
            geom: this.featuresList
          }
          break
        case 'map':
          this.form = {
            name: '',
            subdomain: '',
            googleID: '',
            facilities: [],
            cls: [],
            cables: [],
            logos: []
          }
          break
        default:
          this.form = {
            cls: [],
            urls: [],
            tags: [],
            name: '',
            notes: '',
            facilities: [],
            fiberPairs: '',
            systemLength: 0,
            capacityTBPS: 0,
            terrestrial: false,
            category: cableStates[0],
            activationDateTime: '',
            geom: this.featuresList
          }
          break
      }
    },
    async getElementOnEdit(_id) {
      this.mode = 'edit'
      let currentElement = {}
      this.loading = true

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
      this.loading = false
    },
    async viewCurrentCLS(_id) {
      const res = await viewClsOwner({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async viewCurrentCable(_id) {
      const res = await viewCableOwner({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async createCLS() {
      this.isSendingData = true
      const res = await createCls({
        ...this.form,
        user_id: this.$auth.user.sub
      })

      this.isSendingData = false
      if (res.t !== 'error') {
        return this.$router.push('/user/section/cls')
      }
    },
    async editCLS() {
      this.isSendingData = true
      const res = await editCls({
        ...this.form,
        user_id: this.$auth.user.sub,
        _id: this.$route.query.item
      })

      this.isSendingData = false
      if (res.t !== 'error') {
        return this.$router.push('/user/section/cls')
      }
    },
    async createCable() {
      this.isSendingData = true
      const res = await createCable({
        ...this.form,
        user_id: this.$auth.user.sub
      })

      this.isSendingData = false
      if (res.t !== 'error') {
        return this.$router.push('/user/section/cables')
      }
    },
    async editCable() {
      this.isSendingData = true
      const res = await editCable({
        ...this.form,
        user_id: this.$auth.user.sub,
        _id: this.$route.query.item
      })

      this.isSendingData = false
      if (res.t !== 'error') {
        return this.$router.push('/user/section/cables')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/create-styles.scss';
</style>
