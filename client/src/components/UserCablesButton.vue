<template>
  <div class="absolute mainw">
    <el-popover
      :visible-arrow="false"
      placement="bottom-start"
      width="320"
      trigger="manual"
      transition="el-zoom-in-top"
      v-model="isListOpen"
    >
      <el-button
        slot="reference"
        round
        @click="toggleListVisibility"
        type="primary"
        title="My terrestrial networks and subsea cables"
        id="reference-toggler"
      >
        <fa :icon="['fas', 'bezier-curve']" class="mr1" />
      </el-button>
      <div
        :class="{ dark, light: !dark }"
        class="list-wrapper bottom-shadow sm-round h-fit-content absolute w90 mt4 flex column"
      >
        <div class="relative list-wrapper__inner">
          <header class=" h8 text-right">
            <span
              @click="toggleListVisibility"
              class="inline-block cursor-pointer"
            >
              <fa :icon="['fas', 'times']" class="fs-large icon" />
            </span>
          </header>
          <ul
            class="w-fit-full flex row wrap m0 p0 block"
            v-loading="loading"
            role="group"
          >
            <li
              v-for="(cable, i) in cablesList"
              class="transition-all cursor-pointer bg-white no-outline mt4 mb4 pr4 pl4 h-fit"
              role="listitem"
              style="width: 100%"
              :key="i"
            >
              <div
                class="flex row pt5 pb4 pl2 pr2 nowrap justify-content-space-between align-items-center"
                @click="loadCable(cable._id)"
              >
                <div>
                  <strong>
                    <p class="name m0 p0 mb1">
                      <fa :icon="getIcon(cable.terrestrial)" />
                      {{ cable.name }}
                    </p>
                  </strong>
                  <small class="hidden-sm-and-down">
                    ID: {{ cable._id }}
                  </small>
                </div>
                <p
                  class="m0 p0 status-text"
                  :class="{ on: cable.status, off: !cable.status }"
                >
                  {{ cable.status ? 'On' : 'Off' }}
                </p>
              </div>
            </li>
          </ul>
          <footer
            class="pl2 pr2 pb2 flex nowrap justify-content-space-between align-items-center"
          >
            <el-button
              class="create-btn p2 h10"
              plain
              type="text"
              @click="headToCreationRoute('subsea')"
            >
              <fa :icon="['fas', 'plus']" class="mr1" /> Create new subsea
            </el-button>
            <el-button
              class="create-btn p2 h10"
              plain
              type="text"
              @click="headToCreationRoute('terrestrial')"
            >
              <fa :icon="['fas', 'plus']" class="mr1" /> Create new network
            </el-button>
          </footer>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import dataCollection from '../mixins/dataCollection'
import { getCablesShortList } from '../services/api/cables'

export default {
  name: 'UserCablesButton',
  data: () => ({
    isListOpen: false,
    cablesList: [],
    loading: false
  }),
  mixins: [dataCollection],
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    getIcon() {
      return isTerrestrial =>
        isTerrestrial ? ['fas', 'bezier-curve'] : ['fas', 'water']
    }
  },
  watch: {
    async isListOpen(bool) {
      if (bool) await this.getCablesList()
      else this.cablesList = []
    }
  },
  methods: {
    toggleListVisibility() {
      this.isListOpen = !this.isListOpen
    },
    async getCablesList() {
      this.loading = true
      const res = await getCablesShortList({
        user_id: await this.$auth.getUserID()
      })
      if (res && res.data && res.data.r) {
        this.cablesList = res.data.r
      }
      this.loading = false
    },
    loadCable(id) {
      this.toggleListVisibility()
      this.handleItemListSelection({ option: 'cable', id })
    },
    headToCreationRoute(r) {
      return r == 'subsea'
        ? this.$router.push('/user/section/create?id=subsea')
        : this.$router.push('/user/section/create?id=terrestrial-network')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/user-cables-button-syles.scss';
</style>
