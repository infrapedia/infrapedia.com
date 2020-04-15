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
        @set-selection-onto-map="handleSetSelectionOntoMap"
        @cancel-geom-loading="toggleMapFormLoading(false)"
        @loading-selection-geom="toggleMapFormLoading(true)"
      />
    </div>
    <div class="right w-fit-full">
      <editor-map :key="mapKey" :type="creationType" />
    </div>
    <el-dialog
      :visible.sync="isLoadingDialog"
      width="44%"
      top="12vh"
      title="Uploading file..."
      :show-close="false"
      :custom-class="customDialogClass"
      :close-on-click-modal="false"
    >
      Usually, this takes time when uploading large files... Please be patient.
    </el-dialog>
    <el-dialog
      :visible.sync="isMapFormLoading"
      width="44%"
      top="12vh"
      title="Loading map..."
      :show-close="false"
      :custom-class="customDialogClass"
      :close-on-click-modal="false"
    >
      Usually, this takes time when loading a map with lots of data... Please be
      patient.
    </el-dialog>
    <el-dialog
      :visible.sync="isMapFormSendingData"
      width="44%"
      top="12vh"
      title="Uploading map and creating map archives..."
      :show-close="false"
      :custom-class="customDialogClass"
      :close-on-click-modal="false"
    >
      Usually, this takes time when uploading a map with lots of data... Please
      be patient.
    </el-dialog>
  </div>
</template>

<script>
import { bus } from '../../../helpers/eventBus'
import cableStates from '../../../config/cableStates'
import EditorMap from '../../../components/editor/Editor'
import CLSForm from '../../../components/userCreationForms/cls'
import CableForm from '../../../components/userCreationForms/cables'
import FacilityForm from '../../../components/userCreationForms/facilities'
import IXPForm from '../../../components/userCreationForms/ixp'
import { createCls, editCls, viewClsOwner } from '../../../services/api/cls'
import {
  createCable,
  editCable,
  viewCableOwner
} from '../../../services/api/cables'
import {
  EDITOR_LOAD_DRAW,
  EDITOR_FILE_CONVERTED,
  EDITOR_SET_FEATURES,
  SET_MAP_SOURCES
} from '../../../events/editor'
import MapForm from '../../../components/userCreationForms/map'
import {
  getMyMap,
  setMyMap,
  setupMyMapArchives
} from '../../../services/api/map'
import { fCollectionFormat } from '../../../helpers/featureCollection'
import { viewFacilityOwner } from '../../../services/api/facs'
import { viewIXPOwner } from '../../../services/api/ixps'

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
      isLoadingSelectionGeom: false,
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
      if (q.id != this.creationType) {
        this.creationType = q.id
        this.mapKey += 1
      }
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    },
    isMapFormSendingData() {
      return this.isSendingData && this.creationType === 'map'
    },
    isLoadingDialog() {
      const type =
        this.creationType === 'cls' ||
        this.creationType === 'subsea' ||
        this.creationType === 'terrestrial-network'
      return type && this.isSendingData
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
        case 'facilities':
          view = FacilityForm
          break
        case 'ixps':
          view = IXPForm
          break
        default:
          view = CableForm
          break
      }
      return view
    },
    isMapFormLoading: {
      get() {
        return this.$store.state.editor.isMapFormLoading
      },
      set() {
        return this.$store.dispatch('editor/toggleMapFormLoading', false)
      }
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
          case 'facilities':
            method = this.editFacility
            break
          case 'ixps':
            method = this.editIXP
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
          case 'facilities':
            method = this.createFacility
            break
          case 'ixps':
            method = this.createIXP
            break
          default:
            method = this.createCable
            break
        }
      }

      return method
    },
    routeGiver() {
      let route
      switch (this.creationType.toLowerCase()) {
        case 'cls':
          route = '/user/section/cls'
          break
        case 'subsea':
          route = '/user/section/subsea-cables'
          break
        case 'ixps':
          route = '/user/section/ixps'
          break
        case 'facilities':
          route = '/user/section/facilities'
          break
        default:
          route = '/user/section/terrestrial-networks'
          break
      }
      return route
    }
  },
  beforeCreate() {
    this.$emit('layout', 'profile-layout')
    if (!this.$route.query.id) return this.$router.push('/user')
  },
  async mounted() {
    this.creationType = this.$route.query.id
    this.checkCreationType(this.creationType)

    if (this.$route.query.item) {
      this.getElementOnEdit(this.$route.query.item)
    } else if (this.$route.query.id === 'map') {
      bus.$emit(`${SET_MAP_SOURCES}`)
      await this.checkUserMapExistance()
    }

    if (this.creationType === 'ixps' || this.creationType == 'facilities') {
      this.mode = 'view'
    }
  },
  methods: {
    toggleMapFormLoading(bool) {
      return this.$store.dispatch('editor/toggleMapFormLoading', bool)
    },
    async handleSetSelectionOntoMap(data) {
      return await bus.$emit(`${EDITOR_SET_FEATURES}`, data)
    },
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
          draw,
          ixps,
          config
        } = res.data.r

        this.form = {
          googleID,
          subdomain,
          ixps: Array.isArray(ixps) ? ixps : [],
          cls: Array.isArray(cls) ? cls : [],
          logos: Array.isArray(logos) ? logos : [],
          cables: Array.isArray(cables) ? cables : [],
          facilities: Array.isArray(facilities) ? facilities : [],
          config: typeof config === 'string' ? JSON.parse(config) : config
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
        this.mode = 'create'
        await setupMyMapArchives(data.subdomain)
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
            subdomain: '',
            googleID: '',
            name: '',
            cls: [],
            ixps: [],
            logos: [],
            cables: [],
            facilities: []
          }
          break
        case 'ixps':
          this.form = {
            name: '',
            tags: [],
            nameLong: '',
            policyEmail: '',
            policyPhone: '',
            proto_ivp6: false,
            proto_unicast: false,
            proto_multicast: false
          }
          break
        case 'facilities':
          this.form = {
            name: '',
            point: '',
            address: [],
            website: '',
            geometry: fCollectionFormat([]),
            ixps: [],
            tags: [],
            t: '',
            startDate: '',
            building: ''
          }
          break
        default:
          this.form = {
            cls: [],
            urls: [],
            tags: [],
            name: '',
            notes: '',
            // cc: '',
            facilities: [],
            fiberPairs: '',
            systemLength: 0,
            capacityTBPS: 0,
            litCapacity: [],
            owners: this.creationType === 'subsea' ? [] : '',
            terrestrial: this.creationType === 'subsea' ? false : true,
            category: cableStates[0],
            activationDateTime: '',
            geom: this.featuresList
          }
          break
      }
    },
    async getElementOnEdit(_id) {
      this.loading = true
      this.mode = 'edit'
      let currentElement = {}

      switch (this.creationType) {
        case 'cls':
          currentElement = await this.viewCurrentCLS(_id)
          break
        case 'facilities':
          currentElement = await this.viewCurrentFacility(_id)
          break
        case 'ixps':
          currentElement = await this.viewCurrentIXP(_id)
          break
        default:
          currentElement = await this.viewCurrentCable(_id)
          break
      }

      if (this.creationType === 'subsea' && !currentElement.litCapacity) {
        currentElement.litCapacity = []
      }

      this.form = { ...currentElement }
      await this.handleEditModeSettings(currentElement)
      this.loading = false
    },
    async handleEditModeSettings(data) {
      switch (this.creationType) {
        case 'cls':
          this.form.cablesList = data.cables.map(f => ({
            name: f.label,
            _id: f._id
          }))
          this.form.cables = data.cables.map(f => f._id)
          break
        case 'ixps':
          break
        case 'facilities':
          break
        default:
          this.handleCablesEditMode(data)
          break
      }

      if (data.geom) {
        const features =
          data.geom.type == 'Point'
            ? [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: data.geom.type,
                    coordinates: data.geom.coordinates
                  }
                }
              ]
            : data.geom.features

        await this.$store.dispatch('editor/setList', features)
        await (this.form.geom = this.$store.state.editor.scene.features.list)
        await bus.$emit(`${EDITOR_LOAD_DRAW}`)
      }
    },
    handleCablesEditMode(data) {
      const facsData = data.facilities.map(f => ({
        name: f.label,
        _id: f._id
      }))
      const ownersData = data.owners.map(f => ({
        name: f.label,
        _id: f._id
      }))

      this.form.facsList = facsData
      this.form.facilities = facsData

      this.form.owners = ownersData
      this.form.ownersList = ownersData
      this.form.activationDateTime = new Date(this.form.activationDateTime)
    },
    async viewCurrentFacility(_id) {
      const res = await viewFacilityOwner({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async viewCurrentIXP(_id) {
      const res = await viewIXPOwner({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async viewCurrentCLS(_id) {
      const res = await viewClsOwner({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async viewCurrentCable(_id) {
      const res = await viewCableOwner({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    handleReturningRoute(type) {
      let route = ''
      switch (type) {
        case 'cls':
          route = '/user/section/cls'
          break
        case 'subsea':
          route = '/user/section/subsea-cables'
          break
        case 'ixps':
          route = '/user/section/ixps'
          break
        case 'facilities':
          route = '/user/section/facilities'
          break
        default:
          route = '/user/section/terrestrial-networks'
          break
      }
      return this.$router.push(route)
    },
    async createCLS() {
      this.isSendingData = true

      this.featuresList[0].properties.name === ''
        ? (this.form.geom[0].properties.name = this.form.name)
        : (this.form.geom[0].properties.name = this.featuresList[0].properties.name)

      const res = await createCls({
        ...this.form,
        user_id: this.$auth.user.sub
      })

      this.isSendingData = false
      if (res.t !== 'error') return this.handleReturningRoute(this.creationType)
    },
    async editCLS() {
      this.isSendingData = true

      this.featuresList[0].properties.name === ''
        ? (this.form.geom[0].properties.name = this.form.name)
        : (this.form.geom[0].properties.name = this.featuresList[0].properties.name)

      const res = await editCls({
        ...this.form,
        user_id: this.$auth.user.sub,
        _id: this.$route.query.item
      })

      this.isSendingData = false
      if (res.t !== 'error') return this.handleReturningRoute(this.creationType)
    },
    async createCable() {
      this.isSendingData = true
      const res = await createCable({
        ...this.form,
        user_id: this.$auth.user.sub
      })

      this.isSendingData = false
      if (res.t !== 'error') this.mode = 'edit'
    },
    async editCable() {
      this.isSendingData = true
      const res = await editCable({
        ...this.form,
        user_id: this.$auth.user.sub,
        _id: this.$route.query.item
      })

      this.isSendingData = false
      if (res.t !== 'error') return this.handleReturningRoute(this.creationType)
    },
    async createIXP() {
      return await console.log('not done yet')
    },
    async createFacility() {
      return await console.log('not done yet')
    },
    async editIXP() {
      return await console.log('not done yet')
    },
    async editFacility() {
      return await console.log('not done yet')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/create-styles.scss';
</style>
