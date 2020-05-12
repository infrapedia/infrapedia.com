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
      <editor-map :key="mapKey" :type="creationType" :form="form" />
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
import { createCls, editCLS, viewClsOwner } from '../../../services/api/cls'
import {
  createCable,
  editCable,
  viewCableOwner
  // viewCableBBoxHMR
} from '../../../services/api/cables'
import {
  EDITOR_LOAD_DRAW,
  EDITOR_FILE_CONVERTED,
  EDITOR_SET_FEATURES
} from '../../../events/editor'
import MapForm from '../../../components/userCreationForms/map'
import {
  getMyMap,
  setMyMap,
  setupMyMapArchives
} from '../../../services/api/map'
import {
  viewFacilityOwner,
  editFacility,
  createFacility
} from '../../../services/api/facs'
import { viewIXPOwner, editIXP, createIXP } from '../../../services/api/ixps'

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
      return this.isSendingData && this.creationType == 'map'
    },
    isLoadingDialog() {
      const type =
        this.creationType == 'cls' ||
        this.creationType == 'subsea' ||
        this.creationType == 'terrestrial-network'
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
    checkGeomLength() {
      return this.$store.state.editor.scene.features.list.length ? false : true
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

      if (this.mode == 'edit') {
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
    } else if (this.$route.query.id == 'map') {
      await this.checkUserMapExistance()
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
      const {
        t,
        data: { r: mymap = [] }
      } = (await getMyMap({ user_id: await this.$auth.getUserID() })) || {
        data: { mymap: [] }
      }

      if (t != 'error' && mymap.length > 0) {
        this.mode = 'edit'
        const {
          subdomain,
          googleID,
          cls,
          facilities,
          terrestrials,
          subsea,
          logos,
          draw,
          ixps,
          config,
          owners,
          address,
          techEmail,
          techPhone,
          saleEmail,
          salePhone
        } = mymap[0]

        this.form = {
          googleID,
          subdomain,
          ixps: Array.isArray(ixps) ? ixps : [],
          cls: Array.isArray(cls) ? cls : [],
          logo: Array.isArray(logos) && logos.length > 0 ? logos[0] : '',
          subsea: Array.isArray(subsea) ? subsea : [],
          terrestrials: Array.isArray(terrestrials) ? terrestrials : [],
          facilities: Array.isArray(facilities) ? facilities : [],
          config: typeof config == 'string' ? JSON.parse(config) : config,
          owners: Array.isArray(owners) ? owners : [],
          address: Array.isArray(address) ? address : [],
          techEmail: techEmail ? techEmail : '',
          techPhone: techPhone ? techPhone : '',
          saleEmail: saleEmail ? saleEmail : '',
          salePhone: salePhone ? salePhone : ''
        }

        const fc = typeof draw == 'string' ? JSON.parse(draw) : draw
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
      const { t } = (await setMyMap({
        ...data,
        user_id: await this.$auth.getUserID()
      })) || { t: 'error' }

      if (t != 'error') {
        this.mode = 'create'
        await setupMyMapArchives(data.subdomain).catch(console.error)
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
            state: 'unknown',
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
            logo: '',
            terrestrials: [],
            subsea: [],
            owners: [],
            facilities: [],
            address: [],
            techEmail: '',
            techPhone: '',
            saleEmail: '',
            salePhone: ''
          }
          break
        case 'ixps':
          this.form = {
            name: '',
            tags: [],
            geom: this.featuresList,
            nameLong: '',
            media: '',
            techEmail: '',
            techPhone: '',
            policyEmail: '',
            policyPhone: '',
            proto_ipv6: false,
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
            geom: this.featuresList,
            ixps: [],
            tags: [],
            t: '',
            owners: [],
            StartDate: new Date(),
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
            owners: this.creationType == 'subsea' ? [] : '',
            terrestrial: this.creationType == 'subsea' ? false : true,
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
          currentElement.owners
            ? currentElement.owners
            : (currentElement.owners = [])
          break
        default:
          currentElement = await this.viewCurrentCable(_id)
          if (this.creationType == 'subsea' && !currentElement.litCapacity) {
            currentElement.litCapacity = []
          }
          break
      }

      this.form = { ...currentElement }
      await this.handleEditModeSettings(currentElement)
      this.loading = false
    },
    async handleEditModeSettings(data) {
      switch (this.creationType) {
        case 'cls':
          this.handleCLSEditMode(data)
          break
        case 'ixps':
          if (!this.form.media || this.form.media == 'undefined') {
            this.form.media = ''
          }
          if (!this.form.geom || this.form.geom == 'undefined') {
            this.form.geom = this.featuresList
          }
          break
        case 'facilities':
          this.handleFacsEditMode(data)
          break
        default:
          this.handleCablesEditMode(data)
          break
      }

      let coordinates = []
      let features = []

      // If if any type of cable I need to get cable bounds
      // From a hot service
      {
        if (
          (this.creationType == 'subsea' ||
            this.creationType == 'terrestrial-network') &&
          data.geom.features.length > 0
        ) {
          const bbox = async () => await import('@turf/bbox')
          const coords = data.geom.features.map(ft => ft.geometry.coordinates)
          const bounds = bbox(coords)
          coordinates = bounds
        }
      }

      // I need to set the proper structure for setting the features list
      // when it's a point feature
      {
        features =
          data.geom.type == 'Point'
            ? [
                {
                  type: 'Feature',
                  properties: data.geom.properties
                    ? { ...data.geom.properties }
                    : { name: '' },
                  geometry: {
                    type: data.geom.type,
                    coordinates: data.geom.coordinates
                  }
                }
              ]
            : data.geom.features
      }

      await this.$store.dispatch('editor/setList', features)
      this.form.geom = this.$store.state.editor.scene.features.list
      await bus.$emit(
        `${EDITOR_LOAD_DRAW}`,
        coordinates.length > 0 ? [{ geometry: { coordinates } }] : false
      )
    },
    handleCLSEditMode(data) {
      const clsData = data.cables.map(f => ({
        name: f.label,
        _id: f._id
      }))
      this.form.cables = clsData
      this.form.cablesList = clsData
      if (this.form.state == 'null' || this.form.state == 'undefined') {
        this.form.state = 'unknown'
      }
    },
    handleFacsEditMode(data) {
      {
        let ixpsData = data.ixps.map(ixp => ({
          name: ixp.label,
          _id: ixp._id
        }))
        this.form.ixps = ixpsData
        this.form.ixpsList = ixpsData
      }

      {
        let ownersData = data.owners.map(owner => ({
          name: owner.label,
          _id: owner._id
        }))
        this.form.owners = ownersData
        this.form.ownersList = ownersData
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
      const res = await viewFacilityOwner({
        user_id: await this.$auth.getUserID(),
        _id
      })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async viewCurrentIXP(_id) {
      const res = await viewIXPOwner({
        user_id: await this.$auth.getUserID(),
        _id
      })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async viewCurrentCLS(_id) {
      const res = await viewClsOwner({
        user_id: await this.$auth.getUserID(),
        _id
      })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async viewCurrentCable(_id) {
      const res = await viewCableOwner({
        user_id: await this.$auth.getUserID(),
        _id
      })
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
        user_id: await this.$auth.getUserID()
      })

      this.isSendingData = false
      if (res.t !== 'error') return this.handleReturningRoute(this.creationType)
    },
    async editCLS() {
      this.isSendingData = true

      this.featuresList[0].properties.name === ''
        ? (this.form.geom[0].properties.name = this.form.name)
        : (this.form.geom[0].properties.name = this.featuresList[0].properties.name)

      const res = await editCLS({
        ...this.form,
        user_id: await this.$auth.getUserID(),
        _id: this.$route.query.item
      })

      this.isSendingData = false
      if (res.t !== 'error') return this.handleReturningRoute(this.creationType)
    },
    async createCable() {
      this.isSendingData = true
      const {
        t,
        data: { r: cableid }
      } = (await createCable({
        ...this.form,
        user_id: await this.$auth.getUserID()
      })) || { t: 'error' }

      this.isSendingData = false
      if (t != 'error') {
        this.mode = 'edit'
        this.$router.push({
          path: '/user/section/create',
          query: {
            id: this.$route.query.id,
            item: cableid
          }
        })
      }
    },
    async editCable() {
      this.isSendingData = true
      const { t } = (await editCable({
        ...this.form,
        user_id: await this.$auth.getUserID(),
        _id: this.$route.query.item
      })) || { t: 'error' }

      this.isSendingData = false
      if (t !== 'error') return this.handleReturningRoute(this.creationType)
    },
    async createIXP() {
      this.isSendingData = true

      this.featuresList[0].properties.name === ''
        ? (this.form.geom[0].properties.name = this.form.name)
        : (this.form.geom[0].properties.name = this.featuresList[0].properties.name)

      const res = await createIXP({
        ...this.form,
        user_id: await this.$auth.getUserID()
      })

      this.isSendingData = false
      if (res.t !== 'error') return this.handleReturningRoute(this.creationType)
    },
    async editIXP() {
      this.isSendingData = true

      this.featuresList[0].properties.name === ''
        ? (this.form.geom[0].properties.name = this.form.name)
        : (this.form.geom[0].properties.name = this.featuresList[0].properties.name)

      const res = await editIXP({
        ...this.form,
        _id: this.$route.query.item,
        user_id: await this.$auth.getUserID()
      })

      this.isSendingData = false
      if (res.t !== 'error') return this.handleReturningRoute(this.creationType)
    },
    async createFacility() {
      this.isSendingData = true

      const res = await createFacility({
        ...this.form,
        user_id: await this.$auth.getUserID()
      })

      this.isSendingData = false
      if (res.t !== 'error') return this.handleReturningRoute(this.creationType)
    },
    async editFacility() {
      this.isSendingData = true

      const res = await editFacility({
        ...this.form,
        _id: this.$route.query.item,
        user_id: await this.$auth.getUserID()
      })

      this.isSendingData = false
      if (res.t !== 'error') return this.handleReturningRoute(this.creationType)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/create-styles.scss';
</style>
