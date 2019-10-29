<template>
  <div class="pr8 pl8 pt2 pb2">
    <el-row :gutter="20">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          System status
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p v-if="info.has_partial_outage">
          Partial Outage
        </p>
        <p v-else class="status-text" :class="{ 'active-cable': !currentCableStatus }">
          {{ currentCableStatus ? 'Off' : 'On' }}
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          System Length
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p class="text-bold">
          {{ `${info.system_length} km`}}
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          Activation Year
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p class="text-bold">
          {{ convertToYear(info.activation_datetime) }}
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="30" v-if="info.capacity_tbps > 0">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          Capacity
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p>
          {{ `${info.capacity_tbps} tbps` }}
        </p>
      </el-col>
    </el-row>
    <el-divider />
    <div class="w-fit-full">
      <p class="label"> Owners </p>
      <p class="mt4">
        {{ info.orgs ? info.orgs : 'There is no owners ...' }}
      </p>
    </div>
    <div class="w-fit-full mt10" v-if="currentCableUrls.length">
      <p class="mb1"> More information: </p>
      <a
        v-for="(link, i) in currentCableUrls"
        v-text="link" :key="i"
        :href="link"
        target="_blank"
        class="inline-block underline fs-regular truncate"
      />
    </div>
    <el-divider />
    <footer class="p0">
      <el-row :gutter="20">
        <el-col :span="12" @click="$emit('buy')">
          <el-button
            type="warning"
            circle
            class="mr1 w9 h9 vertical-align"
          >
            <fa :icon="['fas', 'cart-plus']" class="sm-icon mt-1" />
          </el-button>
          <span class="cursor-pointer fs-regular label">
            Buy capacity
          </span>
        </el-col>
        <el-col :span="12">
          <el-button
            type="warning"
            circle
            class="mr1 w9 h9 vertical-align"
          >
            <fa :icon="['fas', 'bell']" class="sm-icon mt-1" />
          </el-button>
          <span class="cursor-pointer fs-regular label">
            Receive alerts
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt8">
        <el-col :span="12" @click="$emit('buy')">
          <el-button
            type="warning"
            circle
            class="mr1 w9 h9 vertical-align"
          >
            <fa :icon="['fas', 'pen']" class="sm-icon mt-1" />
          </el-button>
          <span class="cursor-pointer fs-regular label">
            Edit this cable
          </span>
        </el-col>
        <el-col :span="12">
          <el-button
            type="warning"
            circle
            class="mr1 w9 h9 vertical-align"
          >
            <fa :icon="['fas', 'exclamation-circle']" class="sm-icon mt-1" />
          </el-button>
          <span class="cursor-pointer fs-regular label">
            Report issue
          </span>
        </el-col>
      </el-row>
    </footer>
  </div>
</template>

<script>
import convertToYear from '../../helpers/converToYear'

export default {
  name: 'ICableAttributes',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    convertToYear
  }),
  computed: {
    isFutureState() {
      const date = this.info.activation_datetime
      const currentEpoch = Math.round(new Date().getTime() / 1000)
      return !!(date !== null && parseInt(date) > currentEpoch)
    },
    currentCableStatus() {
      return this.info.has_outage || this.isFutureState
    },
    currentCableUrls() {
      const { url1, url2, url3 } = this.info
      const urls = []

      if (url1) urls.push(url1)
      else if (url2) urls.push(url2)
      else if (url3) urls.push(url3)

      return urls
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/cable-attributes-styles.scss';
</style>
