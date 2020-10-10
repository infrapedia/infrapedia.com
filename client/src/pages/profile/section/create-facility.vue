<template>
  <div
    class="main-wrapper w-fit-full mt11 vph-full"
    :class="{ dark, light: !dark }"
  >
    <header class="w-fit-full text-left p5 pl8 top-header" :class="{ dark }">
      <router-link to="/user/section/facilities" class="inline-block mr5">
        <fa :icon="['fas', 'arrow-left']" />
      </router-link>
      <div class="inline-block capitalize">{{ mode }} facility</div>
    </header>

    <div class="body-wrapper" :class="{ dark }">
      <header class="flex justify-content-center align-items-center h10 pt2">
        <div
          class="circle w5 h5 cursor-pointer transition-all"
          title="Basic information"
          :class="{ active: step == 1 }"
        />
        <div
          class="circle w5 h5 cursor-pointer transition-all"
          title="Building details"
          :class="{ active: step == 2 }"
        />
        <div
          class="circle w5 h5 cursor-pointer transition-all"
          title="Power and Cooling details"
          :class="{ active: step == 3 }"
        />
        <div
          class="circle w5 h5 cursor-pointer transition-all"
          title="Security details"
          :class="{ active: step == 4 }"
        />
        <div
          class="circle w5 h5 cursor-pointer transition-all"
          title="Onsite Services"
          :class="{ active: step == 5 }"
        />
      </header>

      <fieldset class="el-card p8 is-always-shadow transition-all">
        <legend class="pl4 pr4 pt2 pb2" :class="{ dark }">
          {{ legendText }}
        </legend>
        <div class="flex row nowrap">
          <facility-form
            :step="step"
            :form="form"
            :mode="mode"
            class="facility-form"
            :is-sending-data="isSendingData"
            :is-send-data-disabled="checkGeomLength"
            @cancel-geom-loading="toggleMapFormLoading(false)"
            @loading-selection-geom="toggleMapFormLoading(true)"
            @send-data="handleSendData(mode, creationType, $event)"
          />
        </div>

        <footer class="flex row nowrap justify-content-end mt8">
          <el-button round class="mr4" @click="handleClickPreviousBtn">
            {{ step == 1 ? 'Cancel' : 'Back' }}
          </el-button>
          <el-button round type="primary" @click="handleClickNextBtn">
            {{ nextBtnText }}
          </el-button>
        </footer>
      </fieldset>
    </div>
  </div>
</template>

<script>
import {
  viewFacilityOwner,
  editFacility,
  createFacility
} from '../../../services/api/facs'
import { sceneDictionary } from '../../../components/editor'
import FacilityForm from '../../../components/userCreationForms/facilities'
import { bus } from '../../../helpers/eventBus'
import { EDITOR_SET_FEATURES_LIST } from '../../../events/editor'

export default {
  components: {
    FacilityForm
  },
  data: () => ({
    step: 3,
    featuresList: [],
    isSendingData: false,
    form: {
      name: '',
      point: '',
      type: '',
      address: [],
      buildingSize: 0,
      rackHeight: 0,
      meetMeRooms: 0,
      backupPowerRedundancy: '',
      utilityConnectionRedundancy: '',
      totalPower: 0,
      temperature: 0,
      coolingCapacity: 0,
      humidity: 0,
      maxRackPower: 0,
      backupPowerDuration: 0,
      pue: 0.0,
      platform: '',
      isLoadingDocks: false,
      isCarrierNeutral: false,
      grossColocationSize: 0,
      floorLoadingCapacity: 0,
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
    legendText() {
      let text = ['Basic Information', 'Specifications']
      return this.step <= 1 ? text[0] : text[1]
    },
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
    handleClickNextBtn() {
      if (this.step == 5) {
        console.log('not done yet. SEND DATA')
      }

      this.step++
    },
    handleClickPreviousBtn() {
      if (this.step == 1) {
        this.$router.push('/user/section/facilities')
        return
      }

      this.step--
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
