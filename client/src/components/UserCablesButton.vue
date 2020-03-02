<template>
  <div class="absolute mainw">
    <el-popover
      :visible-arrow="false"
      placement="bottom-end"
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
        class="list-wrapper bottom-shadow sm-round h-fit-content absolute w90 p4 mt4 flex row wrap"
      >
        <header class="w-fit-full h8 text-right">
          <span
            @click="toggleListVisibility"
            class="inline-block cursor-pointer"
          >
            <fa :icon="['fas', 'times']" class="fs-large icon" />
          </span>
        </header>
        <ul
          class="flex w-fit-full row wrap m0 p0"
          v-loading="loading"
          role="group"
        >
          <li
            v-for="(cable, i) in cablesList"
            class="w-fit-full transition-all cursor-pointer bg-white no-outline mt4 mb4 pr4 pl4 h-fit"
            role="listitem"
            :key="i"
          >
            <div
              class="flex row pt5 pb4 pl2 pr2 nowrap justify-content-space-between align-items-center"
              @click="loadCable(cable._id)"
            >
              <div>
                <strong>
                  <p class="m0 p0 mb1">
                    <fa :icon="getIcon(cable.terrestrial)" />
                    {{ cable.name }}
                  </p>
                </strong>
                <small> ID: {{ cable._id }} </small>
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
        <div
          class="mt2 mb2 w-fit-full flex column nowrap justify-content-center align-items-center"
        >
          <el-button
            class="mb4 h10"
            round
            plain
            @click="headToCreationRoute('subsea')"
          >
            <fa :icon="['fas', 'plus']" class="mr1" /> Create new subsea
          </el-button>
          <el-button
            class="h10"
            round
            plain
            @click="headToCreationRoute('terrestrial')"
          >
            <fa :icon="['fas', 'plus']" class="mr1" /> Create new network
          </el-button>
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
    isListOpen(bool) {
      if (!bool) return
      else return this.getCablesList()
    }
  },
  methods: {
    toggleListVisibility() {
      this.isListOpen = !this.isListOpen
    },
    async getCablesList() {
      this.loading = true
      const res = await getCablesShortList({ user_id: this.$auth.user.sub })
      if (res && res.data && res.data.r) {
        this.cablesList = res.data.r
      }
      this.loading = false
    },
    loadCable(id) {
      this.toggleListVisibility()
      return this.handleItemListSelection({ option: 'cable', id })
    },
    headToCreationRoute(r) {
      return r === 'subsea'
        ? this.$router.push('/user/section/create?id=subsea')
        : this.$router.push('/user/section/create?id=terrestrial-network')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/user-cables-button-syles.scss';
</style>
