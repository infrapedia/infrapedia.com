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
      >
        <fa :icon="['fas', 'bezier-curve']" class="mr1" /> My cables
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
            class="w-fit-full cursor-pointer bg-white no-outline mt4 pr4 pl4 h-fit"
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
                    {{ cable.name }}
                  </p>
                </strong>
                <small> Cable ID: {{ cable._id }} </small>
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
        <el-button
          class="mt2 mb2 w-fit-full h10"
          round
          plain
          @click="headToCreationRoute"
        >
          <fa :icon="['fas', 'plus']" class="mr1" /> Create new cable
        </el-button>
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
    headToCreationRoute() {
      return this.$router.push('/user/section/create?id=cables')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/user-cables-button-syles.scss';
</style>
