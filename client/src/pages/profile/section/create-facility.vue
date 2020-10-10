<template>
  <div
    class="main-wrapper w-fit-full mt11 vph-full"
    :class="{ dark, light: !dark }"
  >
    <header class="w-fit-full text-left p5 pl8 top-header">
      <router-link to="/user/section/facilities" class="inline-block mr5">
        <fa :icon="['fas', 'arrow-left']" />
      </router-link>
      <div class="inline-block capitalize">{{ mode }} facility</div>
    </header>

    <div class="body-wrapper" :class="{ dark }">
      <header class="flex justify-content-center align-items-center h16">
        <div
          class="circle w5 h5 cursor-pointer active"
          title="Basic information"
        />
        <div class="circle w5 h5 cursor-pointer" title="Building details" />
        <div
          class="circle w5 h5 cursor-pointer"
          title="Power and Cooling details"
        />
        <div class="circle w5 h5 cursor-pointer" title="Security details" />
        <div class="circle w5 h5 cursor-pointer" title="Onsite Services" />
      </header>

      <div class="el-card p8 is-always-shadow">
        <div class="flex row nowrap">
          <facility-form
            :step="step"
            :form="form"
            :mode="mode"
            class="facility-form"
            :is-sending-data="isSendingData"
            :is-send-data-disabled="checkGeomLength"
            @handle-file-converted="handleFileConverted"
            @cancel-geom-loading="toggleMapFormLoading(false)"
            @set-selection-onto-map="handleSetSelectionOntoMap"
            @loading-selection-geom="toggleMapFormLoading(true)"
            @send-data="handleSendData(mode, creationType, $event)"
          />
          <div class="editor-map-wrapper" v-if="step == 1">
            <editor-map
              id="editor-map-facilities-dashboard"
              :key="1"
              :form="form"
              type="facilities"
              @features-list-change="featuresList = $event"
              @error-loading-draw-onto-map="handleFileConvertionFailed"
            />
          </div>
        </div>

        <footer class="flex row nowrap justify-content-end">
          <el-button round class="mr4">
            {{ step == 1 ? 'Cancel' : 'Back' }}
          </el-button>
          <el-button round type="primary">
            {{ nextBtnText }}
          </el-button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import {
  viewFacilityOwner,
  editFacility,
  createFacility
} from '../../../services/api/facs'
import { bus } from '../../../helpers/eventBus'
import debounce from '../../../helpers/debounce'
import EditorMap from '../../../components/editor/Editor'
import { sceneDictionary } from '../../../components/editor'
import {
  EDITOR_SET_FEATURES_LIST,
  EDITOR_FILE_CONVERTED,
  EDITOR_SET_FEATURES
} from '../../../events/editor'
import FacilityForm from '../../../components/userCreationForms/facilities'

export default {
  components: {
    FacilityForm,
    EditorMap
  },
  data: () => ({
    step: 1,
    featuresList: [],
    isSendingData: false,
    form: {
      name: '',
      point: '',
      address: [],
      website: '',
      geom: [],
      ixps: [],
      tags: [],
      t: '',
      owners: [],
      StartDate: new Date(),
      building: ''
    }
  }),
  computed: {
    nextBtnText() {
      return this.step <= 4 ? 'Next' : 'Save'
    },
    dark() {
      return this.$store.state.isDark
    },
    mode() {
      return this.$route.params.item ? 'edit' : 'create'
    },
    checkGeomLength() {
      return this.form.geom.length > 0 ? false : true
    }
  },
  methods: {
    handleFileConverted(fc) {
      bus.$emit(`${EDITOR_FILE_CONVERTED}`, fc)
    },
    async handleSetSelectionOntoMap(data) {
      await bus.$emit(`${EDITOR_SET_FEATURES}`, data)
    },
    async getElementOnEdit(_id) {
      try {
        this.loading = true
        this.mode = 'edit'

        const currentElement = await this.viewCurrentFacility(_id)
        this.form = { ...currentElement }
        await this.handleEditModeSettings(currentElement)
        this.loading = false
      } catch (err) {
        console.error(err)
      }
    },
    handleFileConvertionFailed: debounce(function() {
      this.isManualUploadDialog = true
      this.$router.replace(
        `${this.$route.path}?id=${this.$route.query.id}&failedToUploadKMz=true`
      )
    }, 320),
    handleEditModeSettings(data) {
      this.handleFacsEditMode(data)

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
    toggleMapFormLoading(bool) {
      this.$store.dispatch('editor/toggleMapFormLoading', bool)
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
    async viewCurrentFacility(_id) {
      const res = await viewFacilityOwner({
        user_id: await this.$auth.getUserID(),
        _id
      })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async handleSendData(mode) {
      if (!mode) return
      let method = null
      this.isSendingData = true

      if (mode == 'create') {
        method = createFacility
      } else if (mode == 'edit') {
        method = editFacility
      }

      this.form.geom = sceneDictionary.getCollectionList()
      this.form.geom[0].properties.name === ''
        ? (this.form.geom[0].properties.name = this.form.name)
        : (this.form.geom[0].properties.name = this.form.geom[0].properties.name)

      const formData = this.form
      const { t, data } = (await method({
        ...formData,
        user_id: await this.$auth.getUserID()
      })) || { t: 'error', data: null }

      this.isSendingData = false
      if (t != 'error') {
        this.mode = 'edit'
        this.$router.replace({
          path: '/user/section/create',
          query: {
            id: this.$route.query.id,
            item: data.r
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/create-facility-styles.scss';
</style>
