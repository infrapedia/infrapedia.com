<template>
  <div
    class="main-wrapper w-fit-full mt12 pt8 vph-full pl4 pr4 flex row wrap align-items-start"
    :class="{ dark, light: !dark }"
  >
    <div class="flex row wrap w-fit-full">
      <header class="mb8">
        <h1 class="title-user color-inherit">
          Account
        </h1>
      </header>
      <el-card shadow="never" class="w-fit-full p8" v-loading="loading">
        <div class="flex justify-content-space-between">
          <div>
            <p class="m0 fs-large">
              <strong>
                {{
                  userData.user_metadata && userData.user_metadata.name
                    ? user_metadata.namename
                    : userData.name
                }}
              </strong>
            </p>
            <p class="mt6 fs-small">
              {{ userData.company ? userData.company : 'Company: Unknown' }}
            </p>
          </div>
          <router-link
            id="profileBtn"
            to="/user/profile"
            class="inline-block w28 h7 mr1 color-inherit p1 vertical-align round fs-regular"
          >
            See my profile
          </router-link>
        </div>
      </el-card>
      <div class="w-fit-full mt10">
        <el-row :gutter="50">
          <el-col :md="24" :lg="10">
            <el-card shadow="never" class="pr8 pl8 h100 overflow-y-auto">
              <header class="header p4">
                <h2 class="title-user-variant m0 color-inherit">
                  My activity
                </h2>
              </header>
              <el-table :data="logsData" class="mt2">
                <el-table-column prop="path" label="Path" />
                <el-table-column
                  prop="rgDate"
                  label="Register date"
                  :formatter="row => formatDate(row.rgDate)"
                />
              </el-table>
            </el-card>
          </el-col>
          <el-col :md="24" :lg="14">
            <el-card shadow="never" class="pr8 pl8 h100">
              <header class="header p4">
                <h2 class="title-user-variant m0 color-inherit">
                  Map
                </h2>
              </header>
              <div
                id="map"
                style="height: 32vh;"
                class="mt3 relative w-fit-full"
              />
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserData } from '../../services/api/auth'
import { usersLogs } from '../../services/api/users'
import { formatDate } from '../../helpers/formatDate'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { mapConfig } from '../../config/mapConfig'

export default {
  name: 'user',
  data: () => ({
    userData: {},
    loading: true,
    logsData: [],
    formatDate
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  beforeCreate() {
    this.$emit('layout', 'profile-layout')
  },
  async mounted() {
    if (Object.keys(this.$route.query).length) this.$router.replace('/user')
    await this.loadLogs()
    this.createMap()
    await this.setUserData()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Object.keys(vm.$route.query).length) vm.$router.replace('/user')
    })
  },
  methods: {
    async loadLogs() {
      const res = await usersLogs({ user_id: this.$auth.user.sub })
      if (res && res.t !== 'err' && res.data && res.data.r) {
        this.logsData = res.data.r
      }
    },
    async setUserData() {
      if (!this.$auth || !this.$auth.user) return
      this.loading = true
      const userID = this.$auth.user.sub
      if (userID) {
        const userData = await getUserData(userID)
        if (userData) {
          const { user_metadata } = userData
          this.userData = {
            name:
              user_metadata && user_metadata.name
                ? user_metadata.name
                : userData.name,
            company:
              user_metadata && user_metadata.companyname
                ? user_metadata.companyname
                : ''
          }
        }
      } else {
        setTimeout(() => {
          this.setUserData()
        }, 320)
      }
      this.loading = false
    },
    createMap() {
      try {
        mapboxgl.accessToken = mapConfig.mapToken

        const map = new mapboxgl.Map({
          container: 'map',
          zoom: mapConfig.zoom,
          center: mapConfig.center,
          style: mapConfig.default
        })

        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: false
        })
        const scaleCtrl = new mapboxgl.ScaleControl({
          maxWidth: 80,
          unit: 'metric'
        })

        this.draw = draw
        let vm = this
        map.addControl(scaleCtrl, 'bottom-left')
        map.addControl(draw, 'bottom-left')
        // eslint-disable-next-line
        map.on('draw.selectionchange', function(e) {
          return vm.draw.changeMode('simple_select', {})
        })
        return map
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pages/user/account-styles.scss';
</style>
