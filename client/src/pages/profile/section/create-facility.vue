<template>
  <div
    class="main-wrapper w-fit-full mt11 vph-full overflow-y-auto"
    :class="{ dark, light: !dark }"
  >
    <header class="w-fit-full text-left p5 pl8 top-header" :class="{ dark }">
      <router-link to="/user/section/facilities" class="inline-block mr5">
        <fa :icon="['fas', 'arrow-left']" />
      </router-link>
      <div class="inline-block capitalize">{{ mode }} facility</div>
    </header>

    <div class="body-wrapper pb50" :class="{ dark }">
      <header class="flex justify-content-center align-items-center h10 pt2">
        <div v-for="(title, i) in btnSteps" :key="i">
          <el-button
            circle
            class="transparent h5 w5 mr2 no-border circle cursor-pointer transition-all"
            :title="title"
            :class="{ active: step == i + 1 }"
            @click="moveToStep(i + 1)"
          />
        </div>
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
            @set-selection-onto-map="handleSetSelectionOntoMap"
            @cancel-geom-loading="toggleMapFormLoading(false)"
            @loading-selection-geom="toggleMapFormLoading(true)"
            @send-data="handleSendData(mode, creationType, $event)"
          />
        </div>

        <footer class="flex row nowrap justify-content-end mt8">
          <el-button round class="mr4" @click="handleClickPreviousBtn">
            {{ step == 1 ? 'Cancel' : 'Back' }}
          </el-button>
          <el-tooltip
            effect="dark"
            :disabled="!checkGeomLength"
            content="Remember to either create a point or a polygon on the map to set the facility location"
            placement="top-start"
          >
            <el-button
              round
              type="primary"
              @click="handleClickNextBtn"
              :disabled="checkGeomLength"
            >
              {{ nextBtnText }}
            </el-button>
          </el-tooltip>
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
import FacilityForm from '../../../components/userCreationForms/facilities'
import { bus } from '../../../helpers/eventBus'
import {
  EDITOR_SET_FEATURES_LIST,
  EDITOR_SET_FEATURES
} from '../../../events/editor'
import { sceneDictionary } from '../../../components/editor'

export default {
  components: {
    FacilityForm
  },
  data: () => ({
    step: 1,
    featuresList: [],
    isSendingData: false,
    form: {
      name: '',
      point: '',
      t: 'data_center',
      address: {
        fullAddress: '',
        reference: '',
        country: '',
        street: '',
        apt: '',
        city: '',
        state: '',
        zipcode: ''
      },
      enType: [],
      sProviders: [],
      subsea: [],
      owners: [],
      ixps: [],
      csp: [],
      terrestrials: [],
      buildingSize: 0,
      rackHeight: 0,
      meetMeRooms: 0,
      meetingRooms: false,
      carParking: false,
      spareParts: false,
      breakRooms: false,
      stagingRooms: false,
      officeSpace: false,
      internetAccess: false,
      backupPowerRedundancy: '',
      utilityConnectionRedundancy: '',
      totalPower: 0,
      temperature: {
        value: 0,
        variant: 0
      },
      coolingCapacity: 0,
      bulletProffGlass: false,
      mantrap: false,
      securityGuards: false,
      cctv: false,
      biometric: false,
      humidity: {
        value: 0,
        variant: 0
      },
      authentication: false,
      maxRackPower: 0,
      backupPowerDuration: 0,
      pue: 0.0,
      platform: false,
      isLoadingDocks: false,
      isCarrierNeutral: false,
      grossColocationSize: 0,
      floorLoadingCapacity: 0,
      website: '',
      geom: [],
      tags: [],
      StartDate: new Date(),
      building: ''
    }
  }),
  computed: {
    legendText() {
      let text = ['Basic Information', 'Specifications']
      return this.step <= 1 ? text[0] : text[1]
    },
    btnSteps() {
      return [
        'Basic information',
        'Building details',
        'Power and Cooling details',
        'Security and Onsite services details'
      ]
    },
    nextBtnText() {
      return this.step <= 3 ? 'Next' : 'Save'
    },
    dark() {
      return this.$store.state.isDark
    },
    mode() {
      return this.$route.query.item ? 'edit' : 'create'
    },
    checkGeomLength() {
      return this.form.geom.length > 0 ? false : true
    }
  },
  async created() {
    sceneDictionary.watchStorage()
    if (this.$route.query.item) {
      this.getElementOnEdit(this.$route.query.item)
    }
  },
  beforeDestroy() {
    sceneDictionary.unwatchStorage()
  },
  methods: {
    async handleSetSelectionOntoMap(data) {
      await bus.$emit(`${EDITOR_SET_FEATURES}`, data)
    },
    moveToStep(num) {
      if (this.step <= 1 && this.checkGeomLength) {
        this.$message.info(
          "You can't move further until you add a point of the location of the facility on the map"
        )
        return
      }
      this.step = num
    },
    handleClickNextBtn() {
      if (this.step == 4) {
        this.handleSendData(this.mode)
        return
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
      this.form.StartDate = new Date(data.StartDate)

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

      if (
        data.temperature &&
        data.temperature.value &&
        typeof data.temperature.value == 'number'
      ) {
        this.form.temperature = {
          value: data.temperature.value,
          variant: data.temperature.variant
        }
      } else {
        this.form.temperature = {
          value: 0,
          variant: 0
        }
      }

      if (
        data.humidity &&
        data.humidity.value &&
        typeof data.humidity.value == 'number'
      ) {
        this.form.humidity = {
          value: data.humidity.value,
          variant: data.humidity.variant
        }
      } else {
        this.form.humidity = {
          value: 0,
          variant: 0
        }
      }

      if (data.address && data.address.length >= 1) {
        this.form.address = { ...data.address[0] }
      }

      if (!data.enType) {
        this.form.enType = []
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
        if (!this.$route.query.item) {
          this.$router.replace({
            path: this.$route.path,
            query: {
              item: data.r
            }
          })
        }
        this.step = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/create-facility-styles.scss';
</style>
