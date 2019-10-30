<template>
  <div class="pr8 pl8 pt2 pb8">
    <el-row :gutter="20" v-if="info.address1">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          Address
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p class="text-bold">
          {{ info.address1 }}
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="30" v-if="info.city">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          City
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p class="text-bold">
          {{ info.city }}
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="30" v-if="info.zipcode">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          Zip
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p class="text-bold">
          {{ info.zipcode }}
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="30" v-if="info.org_name">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          Org Name
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p class="text-bold">
          {{ info.org_name }}
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="30" v-if="info.net_count">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          Network Count
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p class="text-bold">
          {{ info.net_count }}
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="30" v-if="info.website">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          Website
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <a
          class="inline-block text-bold underline mt3 mb0"
          :href="info.website"
          target="_blank"
          v-text="info.website"
          />
      </el-col>
    </el-row>
    <el-row :gutter="30" v-if="info.updated">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          Last Updated
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p class="text-bold">
          {{ info.updated }}
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="30" v-if="info.status">
      <el-col :span="10" class="p2">
        <p class="label capitalize">
          Status
        </p>
      </el-col>
      <el-col :span="12" class="p2">
        <p class="text-bold"> {{ info.status }} </p>
      </el-col>
    </el-row>
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
export default {
  name: 'IDataCenter',
  props: {
    info: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/data-center-styles.scss';
</style>
