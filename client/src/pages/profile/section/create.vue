<template>
  <div
    class="main-wrapper flex row nowrap w-fit-full vph-full pt12 text-center"
    :class="{ dark, light: !dark }"
  >
    <div class="left el-card p6" v-loading="loading">
      <header class="w-fit-full text-left mb8">
        <router-link v-if="creationType != 'map'" :to="backButtonRoute">
          <fa :icon="['fas', 'arrow-left']" />
        </router-link>
      </header>
      <component
        :is="currentView"
        :form="form"
        :mode="mode"
        :is-send-data-disabled="checkGeomLength"
        :is-sending-data="isSendingData"
        @handle-file-converted="handleFileConverted"
        @cancel-geom-loading="toggleMapFormLoading(false)"
        @set-selection-onto-map="handleSetSelectionOntoMap"
        @loading-selection-geom="toggleMapFormLoading(true)"
        @send-data="handleSendData(mode, creationType, $event)"
        @dragger-geojson-upload-failed="handleFileConvertionFailed"
      />
    </div>
    <div class="right w-fit-full">
      <editor-map
        :key="mapKey"
        :type="creationType"
        :form="form"
        @features-list-change="featuresList = $event"
        @error-loading-draw-onto-map="handleFileConvertionFailed"
      />
    </div>
    <template>
      <el-dialog
        :visible.sync="isLoadingDialog"
        width="44%"
        top="12vh"
        title="Uploading file..."
        :show-close="false"
        :custom-class="customDialogClass"
        :close-on-click-modal="false"
      >
        Usually, this takes time when uploading large files... Please be
        patient.
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
        Usually, this takes time when loading a map with lots of data... Please
        be patient.
      </el-dialog>
      <el-dialog
        :visible.sync="isMapFormSendingData"
        width="44%"
        top="12vh"
        title="Uploading map and creating map files..."
        :show-close="false"
        :custom-class="customDialogClass"
        :close-on-click-modal="false"
      >
        Usually, this takes time when uploading a map with lots of data...
        Please be patient.
      </el-dialog>
    </template>

    <manual-kmz-submit-dialog
      :form-data="form"
      :is-visible="isManualUploadDialog"
      @close="closeMannualKmzSubmitDialog"
    />
  </div>
</template>

<script>
import { bus } from '../../../helpers/eventBus'
import cableStates from '../../../config/cableStates'
import EditorMap from '../../../components/editor/Editor'
import { createCls, editCLS, viewClsOwner } from '../../../services/api/cls'
import {
  createCable,
  editCable,
  viewCableOwner
} from '../../../services/api/cables'
import {
  EDITOR_FILE_CONVERTED,
  EDITOR_SET_FEATURES,
  EDITOR_SET_FEATURES_LIST
} from '../../../events/editor'
import {
  getMyMap,
  setMyMap,
  setupMyMapArchives
} from '../../../services/api/map'
import { viewIXPOwner, editIXP, createIXP } from '../../../services/api/ixps'
import ManualKMZSubmitDialog from '../../../components/dialogs/ManualKMZSubmit'
import debounce from '../../../helpers/debounce'
import { sceneDictionary } from '../../../components/editor'
import { STORAGE__WATCH } from '../../../lib/Dictionary'

const allowedCreationTypes = [
  'csp',
  'cls',
  'map',
  'ixps',
  'subsea',
  'terrestrial-network'
]

export default {
  name: 'CreateSection',
  components: {
    'editor-map': EditorMap,
    'manual-kmz-submit-dialog': ManualKMZSubmitDialog
  },
  data() {
    return {
      form: {},
      mapKey: 0,
      mode: 'create',
      loading: false,
      featuresList: [],
      isSendingData: false,
      isPropertiesDialog: false,
      isManualUploadDialog: false,
      isLoadingSelectionGeom: false,
      creationType: this.$route.query.id
    }
  },
  watch: {
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
          view = import('../../../components/userCreationForms/cls')
          break
        case 'map':
          view = () => import('../../../components/userCreationForms/map')
          break
        // case 'facilities':
        //   view = FacilityForm
        //   break
        case 'csp':
          view = () => import('../../../components/userCreationForms/cloud')
          break
        case 'ixps':
          view = () => import('../../../components/userCreationForms/ixp')
          break
        default:
          view = () => import('../../../components/userCreationForms/cables')
          break
      }
      return view
    },
    checkGeomLength() {
      return this.form.geom.length > 0 ? false : true
    },
    isMapFormLoading: {
      get() {
        return this.$store.state.editor.isMapFormLoading
      },
      set() {
        return this.$store.dispatch('editor/toggleMapFormLoading', false)
      }
    },
    backButtonRoute() {
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
        case 'csp':
          route = '/user/section/cloud-service-providers'
          break
        // case 'facilities':
        //   route = '/user/section/facilities'
        // break
        default:
          route = '/user/section/terrestrial-networks'
          break
      }
      return route
    }
  },
  beforeCreate() {
    if (
      !this.$route.query.id ||
      allowedCreationTypes.indexOf(this.$route.query.id) == -1
    )
      this.$router.push('/user')
  },
  async created() {
    try {
      this.creationType = this.$route.query.id
      if (this.creationType != 'map') {
        sceneDictionary.watchStorage()
        sceneDictionary.on(STORAGE__WATCH, this.handleSceneChanged)
      }

      this.checkCreationType(this.$route.query.id)

      if (this.$route.query.item) {
        this.getElementOnEdit(this.$route.query.item)
      } else if (this.$route.query.id == 'map') {
        await this.checkUserMapExistance()
      }
    } catch (err) {
      console.error(err)
    }
  },
  beforeDestroy() {
    if (this.creationType != 'map') {
      sceneDictionary.unwatchStorage()
      sceneDictionary.off(STORAGE__WATCH, this.handleSceneChanged)
    }
  },
  methods: {
    handleSceneChanged() {
      this.form.geom = sceneDictionary.getCollectionList()
    },
    closeMannualKmzSubmitDialog: debounce(function() {
      this.isManualUploadDialog = false
      this.$router.replace(`${this.$route.path}?id=${this.$route.query.id}`)
    }, 320),
    handleFileConvertionFailed: debounce(function() {
      this.isManualUploadDialog = true
      this.$router.replace(
        `${this.$route.path}?id=${this.$route.query.id}&failedToUploadKMz=true`
      )
    }, 320),
    toggleMapFormLoading(bool) {
      this.$store.dispatch('editor/toggleMapFormLoading', bool)
    },
    async handleSetSelectionOntoMap(data) {
      await bus.$emit(`${EDITOR_SET_FEATURES}`, data)
    },
    async checkUserMapExistance() {
      this.loading = true
      try {
        const {
          t,
          data: { r: mymap = [] }
        } = (await getMyMap({ user_id: await this.$auth.getUserID() })) || {
          data: { mymap: [] },
          t: 'error'
        }

        if (t != 'error' && mymap.length > 0) {
          this.mode = 'edit'
          const {
            draw,
            logos,
            address,
            googleID,
            techEmail,
            techPhone,
            saleEmail,
            salePhone,
            subdomain,
            config
          } = mymap[0]
          const fc = typeof draw == 'string' ? JSON.parse(draw) : draw

          this.form = {
            config,
            googleID,
            subdomain,
            geom: [],
            salePhone: salePhone ? salePhone : '',
            techEmail: techEmail ? techEmail : '',
            techPhone: techPhone ? techPhone : '',
            saleEmail: saleEmail ? saleEmail : '',
            address: Array.isArray(address) ? address : [],
            logo: Array.isArray(logos) && logos.length > 0 ? logos[0] : ''
          }

          if (fc.features && fc.features.length > 0) {
            bus.$emit(`${EDITOR_SET_FEATURES_LIST}`, fc.features)
          }
        }
      } catch {
        // Ignore
      } finally {
        this.loading = false
      }
    },
    handleFileConverted(fc) {
      bus.$emit(`${EDITOR_FILE_CONVERTED}`, fc)
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
            country: '',
            tags: [],
            cables: [],
            owners: [],
            state: 'unknown',
            geom: []
          }
          break
        case 'csp':
          this.form = {
            name: '',
            establishmentYear: '',
            url: '',
            statusUrl: '',
            color: '',
            geom: [],
            knownUsers: [],
            regions: [],
            ramps: []
          }
          break
        case 'map':
          this.form = {
            subdomain: '',
            googleID: '',
            cls: [],
            ixps: [],
            logo: '',
            terrestrials: [],
            subsea: [],
            geom: [],
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
            owners: [],
            geom: [],
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
        // case 'facilities':
        //   this.form = {
        //     name: '',
        //     point: '',
        //     address: [],
        //     website: '',
        //     geom: [],
        //     ixps: [],
        //     tags: [],
        //     t: '',
        //     owners: [],
        //     StartDate: new Date(),
        //     building: ''
        //   }
        //   break
        default:
          this.form = {
            cls: [],
            urls: [],
            tags: [],
            name: '',
            notes: '',
            // cc: '',
            knownUsers: [],
            facilities: [],
            fiberPairs: '',
            systemLength: 0,
            capacityTBPS: 0,
            litCapacity: [],
            owners: this.creationType == 'subsea' ? [] : '',
            terrestrial: this.creationType == 'subsea' ? false : true,
            category: cableStates[0],
            activationDateTime: '',
            geom: []
          }
          break
      }
    },
    async getElementOnEdit(_id) {
      try {
        this.loading = true
        this.mode = 'edit'
        let currentElement = {}

        switch (this.creationType) {
          case 'cls':
            currentElement = await this.viewCurrentCLS(_id)
            if (!currentElement.country || currentElement.country == 'null') {
              currentElement.country = ''
            }
            break
          // case 'facilities':
          //   currentElement = await this.viewCurrentFacility(_id)
          //   break
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
      } catch (err) {
        console.error(err)
      }
    },
    async handleEditModeSettings(data) {
      switch (this.creationType) {
        case 'cls':
          this.handleCLSEditMode(data)
          break
        case 'ixps':
          this.handleIxpsEditMode(data)
          break
        // case 'facilities':
        //   this.handleFacsEditMode(data)
        //   break
        default:
          this.handleCablesEditMode(data)
          break
      }

      let features = []

      // I need to set the proper structure for setting the features list
      // when it's a point feature
      {
        features =
          data.geom.type == 'Point' || data.geom.type == 'Feature'
            ? [
                {
                  type: 'Feature',
                  properties: data.geom.properties
                    ? data.geom.properties
                    : { name: '' },
                  geometry: data.geom.geometry
                    ? data.geom.geometry
                    : {
                        type: data.geom.type,
                        coordinates: data.geom.coordinates
                      }
                }
              ]
            : [...data.geom.features]
      }

      bus.$emit(`${EDITOR_SET_FEATURES_LIST}`, features)
    },
    handleCLSEditMode(data) {
      if (this.form.state == 'null' || this.form.state == 'undefined') {
        this.form.state = 'unknown'
      }

      {
        let clsData = data.cables.map(f => ({
          name: f.label,
          _id: f._id
        }))
        this.form.cables = clsData
        this.form.cablesList = clsData
      }

      if (data.owners && Array.isArray(data.owners)) {
        const ownersData = data.owners.map(owner => ({
          name: owner.label,
          _id: owner._id
        }))
        this.form.owners = ownersData
        this.form.ownersList = ownersData
      } else {
        this.form.owners = []
      }
    },
    // handleFacsEditMode(data) {
    //   {
    //     let ixpsData = data.ixps.map(ixp => ({
    //       name: ixp.label,
    //       _id: ixp._id
    //     }))
    //     this.form.ixps = ixpsData
    //     this.form.ixpsList = ixpsData
    //   }

    //   {
    //     let ownersData = data.owners.map(owner => ({
    //       name: owner.label,
    //       _id: owner._id
    //     }))
    //     this.form.owners = ownersData
    //     this.form.ownersList = ownersData
    //   }
    // },
    handleIxpsEditMode(data) {
      if (!this.form.media || this.form.media == 'undefined') {
        this.form.media = ''
      }

      if (data.owners && Array.isArray(data.owners)) {
        let ownersData = data.owners.map(owner => ({
          name: owner.label,
          _id: owner._id
        }))
        this.form.owners = ownersData
        this.form.ownersList = ownersData
      } else {
        this.form.owners = []
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
      const clsData = data.cls.map(f => ({
        name: f.label,
        _id: f._id
      }))
      const knownUsersData = data.knownUsers.map(f => ({
        name: f.label,
        _id: f._id
      }))

      this.form.activationDateTime = new Date(this.form.activationDateTime)

      this.form.facsList = facsData
      this.form.facilities = facsData

      this.form.owners = ownersData
      this.form.ownersList = ownersData

      this.form.cls = clsData
      this.form.clsList = clsData

      this.form.knownUsers = knownUsersData
      this.form.knownUsersList = knownUsersData

      if (
        data.category == 'null' ||
        data.category == 'undefined' ||
        data.category.length <= 0
      ) {
        this.form.category = 'unknown'
      }
    },
    // async viewCurrentFacility(_id) {
    //   const res = await viewFacilityOwner({
    //     user_id: await this.$auth.getUserID(),
    //     _id
    //   })
    //   return res && res.data && res.data.r ? res.data.r : {}
    // },
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
    async handleSendData(mode, creationType, mapData) {
      if (!mode || !creationType) return
      let method = null
      this.isSendingData = true

      if (mode == 'create') {
        switch (creationType.toLowerCase()) {
          case 'cls':
            method = createCls
            break
          case 'ixps':
            method = createIXP
            break
          case 'map':
            method = setMyMap
            break
          // case 'facilities':
          //   method = createFacility
          //   break
          default:
            method = createCable
            break
        }
      } else if (mode == 'edit') {
        switch (creationType.toLowerCase()) {
          case 'cls':
            method = editCLS
            break
          case 'ixps':
            method = editIXP
            break
          // case 'facilities':
          //   method = editFacility
          //   break
          case 'map':
            method = setMyMap
            break
          default:
            method = editCable
            break
        }
      }

      this.form.geom = sceneDictionary.getCollectionList()
      this.form.geom[0].properties.name === ''
        ? (this.form.geom[0].properties.name = this.form.name)
        : (this.form.geom[0].properties.name = this.form.geom[0].properties.name)

      /**
       * The only one that sends data throught the event is the custom map form
       */
      const formData = mapData ? mapData : this.form
      const { t, data } = (await method({
        ...formData,
        user_id: await this.$auth.getUserID()
      })) || { t: 'error', data: null }

      this.isSendingData = false
      if (t != 'error') {
        if (creationType == 'map') {
          await setupMyMapArchives(this.form.subdomain).catch(console.error)
        } else {
          if (mode !== 'edit') {
            this.$router.replace({
              path: '/user/section/create',
              query: {
                id: this.$route.query.id,
                item: mode == 'edit' ? this.$route.query.item : data.r
              }
            })
          }
        }
        this.mode = 'edit'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/create-styles.scss';
</style>
