<template>
  <el-form class="flex row nowrap" :model="form">
    <div class="el-card" :class="{ dark }">
      <header class="p4" :class="{ dark }">
        Power and Cooling details
      </header>
      <el-row class="p4" :gutter="40">
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="Total Power (Megawatts)" required>
                <el-input-number
                  :precision="2"
                  :step="0.1"
                  class="w-fit-full"
                  controls-position="right"
                  v-model="form.totalPower"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="PUE">
                <el-input-number
                  :precision="2"
                  :step="0.1"
                  class="w-fit-full"
                  controls-position="right"
                  v-model="form.pue"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Utility Connection Redundancy">
                <el-select
                  class="w-fit-full"
                  v-model="form.utilityConnectionRedundancy"
                  placeholder
                  :class="{ dark }"
                >
                  <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="Max Rack Power (Megawatts)">
                <el-input-number
                  :precision="2"
                  :step="0.1"
                  class="w-fit-full"
                  controls-position="right"
                  v-model="form.maxRackPower"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Backup Power Duration (hours)">
                <el-input-number
                  :class="{ dark }"
                  class="w-fit-full"
                  controls-position="right"
                  v-model="form.backupPowerDuration"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Backup Power Redundancy">
                <el-select
                  class="w-fit-full"
                  v-model="form.backupPowerRedundancy"
                  placeholder
                  :class="{ dark }"
                >
                  <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <div class="pr4 pl4">
        <el-divider :class="{ dark }" class="m0" />
      </div>

      <el-row class="p4" :gutter="40">
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="Cooling Capacity (Megawatts)">
                <el-input-number
                  class="w-fit-full"
                  controls-position="right"
                  v-model="form.coolingCapacity"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Temperature (Celsius)">
                <br />
                <el-slider
                  class="w-fit-full"
                  v-model="form.temperature.value"
                  show-input
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Temperature - + (Celsius)">
                <br />
                <el-slider
                  class="w-fit-full"
                  v-model="form.temperature.variant"
                  show-input
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="Humidity (%)" class="pr4 pl4">
                <br />
                <el-slider
                  class="w-fit-full"
                  v-model="form.humidity.value"
                  show-input
                />
              </el-form-item>
              <el-form-item label="Humidity - + (%)" class="pr4 pl4">
                <br />
                <el-slider
                  class="w-fit-full"
                  v-model="form.humidity.variant"
                  show-input
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="100%"
        height="40%"
        viewBox="0 0 314.75 219.57"
      >
        <defs>
          <linearGradient
            id="linear-gradient"
            x1="0.5"
            y1="1"
            x2="0.5"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="gray" stop-opacity="0.251" />
            <stop offset="0.54" stop-color="gray" stop-opacity="0.122" />
            <stop offset="1" stop-color="gray" stop-opacity="0.102" />
          </linearGradient>
        </defs>
        <g
          id="Group_15"
          data-name="Group 15"
          transform="translate(17.482)"
          opacity="0.5"
        >
          <rect
            id="Rectangle_121"
            data-name="Rectangle 121"
            width="111.71"
            height="148.832"
            rx="4.5"
            fill="url(#linear-gradient)"
          />
        </g>
        <rect
          id="Rectangle_122"
          data-name="Rectangle 122"
          width="108.846"
          height="145.822"
          rx="4.5"
          transform="translate(18.912 1.093)"
          fill="#f2f2f2"
        />
        <g
          id="Group_16"
          data-name="Group 16"
          transform="translate(29.798 27.956)"
          opacity="0.5"
        >
          <rect
            id="Rectangle_123"
            data-name="Rectangle 123"
            width="21.769"
            height="17.269"
            rx="4.5"
            fill="#e6e6e6"
          />
        </g>
        <rect
          id="Rectangle_124"
          data-name="Rectangle 124"
          width="58.777"
          height="1.92"
          rx="0.96"
          transform="translate(58.098 27.956)"
          fill="#e0e0e0"
        />
        <rect
          id="Rectangle_125"
          data-name="Rectangle 125"
          width="48.86"
          height="1.92"
          rx="0.96"
          transform="translate(58.098 33.711)"
          fill="#e0e0e0"
        />
        <g
          id="Group_17"
          data-name="Group 17"
          transform="translate(29.798 54.817)"
          opacity="0.5"
        >
          <rect
            id="Rectangle_126"
            data-name="Rectangle 126"
            width="21.769"
            height="17.269"
            rx="4.5"
            fill="#e6e6e6"
          />
        </g>
        <rect
          id="Rectangle_127"
          data-name="Rectangle 127"
          width="58.777"
          height="1.92"
          rx="0.96"
          transform="translate(58.098 54.817)"
          fill="#e0e0e0"
        />
        <rect
          id="Rectangle_128"
          data-name="Rectangle 128"
          width="58.777"
          height="1.92"
          rx="0.96"
          transform="translate(58.098 60.572)"
          fill="#e0e0e0"
        />
        <g
          id="Group_18"
          data-name="Group 18"
          transform="translate(29.798 81.678)"
          opacity="0.5"
        >
          <rect
            id="Rectangle_129"
            data-name="Rectangle 129"
            width="21.769"
            height="17.269"
            rx="4.5"
            fill="#e6e6e6"
          />
        </g>
        <rect
          id="Rectangle_130"
          data-name="Rectangle 130"
          width="58.777"
          height="1.92"
          rx="0.96"
          transform="translate(58.098 81.678)"
          fill="#e0e0e0"
        />
        <rect
          id="Rectangle_131"
          data-name="Rectangle 131"
          width="6.532"
          height="1.92"
          rx="0.96"
          transform="translate(58.098 87.435)"
          fill="#e0e0e0"
        />
        <g
          id="Group_19"
          data-name="Group 19"
          transform="translate(86.994 47.92)"
          opacity="0.5"
        >
          <rect
            id="Rectangle_132"
            data-name="Rectangle 132"
            width="110.036"
            height="87.482"
            rx="4.5"
            fill="url(#linear-gradient)"
          />
        </g>
        <rect
          id="Rectangle_133"
          data-name="Rectangle 133"
          width="106.821"
          height="84.735"
          rx="4.5"
          transform="translate(88.695 48.798)"
          fill="#fff"
        />
        <g
          id="Group_20"
          data-name="Group 20"
          transform="translate(99.183 67.003)"
          opacity="0.5"
        >
          <rect
            id="Rectangle_134"
            data-name="Rectangle 134"
            width="22.951"
            height="18.206"
            rx="4.5"
            fill="#e6e6e6"
          />
        </g>
        <rect
          id="Rectangle_135"
          data-name="Rectangle 135"
          width="61.968"
          height="2.023"
          rx="1.012"
          transform="translate(129.021 67.003)"
          fill="#e0e0e0"
        />
        <rect
          id="Rectangle_136"
          data-name="Rectangle 136"
          width="61.968"
          height="2.023"
          rx="1.012"
          transform="translate(129.021 73.073)"
          fill="#e0e0e0"
        />
        <rect
          id="Rectangle_137"
          data-name="Rectangle 137"
          width="94.101"
          height="2.023"
          rx="1.012"
          transform="translate(96.888 95.098)"
          fill="#e0e0e0"
        />
        <rect
          id="Rectangle_138"
          data-name="Rectangle 138"
          width="94.101"
          height="2.023"
          rx="1.012"
          transform="translate(96.888 101.168)"
          fill="#e0e0e0"
        />
        <rect
          id="Rectangle_139"
          data-name="Rectangle 139"
          width="94.101"
          height="2.023"
          rx="1.012"
          transform="translate(96.888 109.257)"
          fill="#e0e0e0"
        />
        <rect
          id="Rectangle_140"
          data-name="Rectangle 140"
          width="71.15"
          height="2.023"
          rx="1.012"
          transform="translate(96.888 115.327)"
          fill="#e0e0e0"
        />
        <g
          id="Group_21"
          data-name="Group 21"
          transform="translate(0 75.423)"
          opacity="0.5"
        >
          <path
            id="Path_187"
            data-name="Path 187"
            d="M328.689,340.1h0l.391-1.537-.548,1.5a192.033,192.033,0,0,0-43.7-5.195C178.468,334.32,129,417.17,129,417.17l100.793,46.872s12.363-33.79,56.271-32.689a85.513,85.513,0,0,1,9.021.695l-13.358,36.673a5.891,5.891,0,0,0-.594,6.631,7.517,7.517,0,0,0,6.3,3.657,7.729,7.729,0,0,0,6.676-3.1h0v-.018a5.947,5.947,0,0,0,1.093-3.3,4.938,4.938,0,0,0-.023-.589l9.656-38.031c28.769,7.8,37.486,30.068,37.486,30.068L443.75,419.349S405.659,358.527,328.689,340.1Z"
            transform="translate(-129 -334.871)"
            fill="url(#linear-gradient)"
          />
        </g>
        <path
          id="Path_188"
          data-name="Path 188"
          d="M288.843,337.994C183.84,337.455,135,419.242,135,419.242l99.51,46.268s12.209-33.36,55.556-32.285a84.4,84.4,0,0,1,9.118.713l32.952-90.778A189.575,189.575,0,0,0,288.843,337.994Z"
          transform="translate(-132.995 -261.649)"
          fill="#e6e6e6"
        />
        <path
          id="Path_189"
          data-name="Path 189"
          d="M659.332,355.54,626.38,446.327c35.959,4.815,46.434,31.564,46.434,31.564l100.122-44.115S735.316,373.728,659.332,355.54Z"
          transform="translate(-460.191 -274.03)"
          fill="#efefef"
        />
        <path
          id="Path_190"
          data-name="Path 190"
          d="M596.839,482.116,630.292,350.38l-46.751,128.5a5.82,5.82,0,0,0-.628,6.573,7.422,7.422,0,0,0,6.251,3.628,7.62,7.62,0,0,0,6.6-3.107h0v-.018a5.872,5.872,0,0,0,1.079-3.254A3.085,3.085,0,0,0,596.839,482.116Z"
          transform="translate(-430.757 -270.389)"
          fill="#535461"
        />
      </svg>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'BuildingDetails',
  data: () => ({
    options: ['n', 'n+1', 'n+n']
  }),
  props: {
    form: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  computed: {
    isViewMode() {
      return this.mode == 'view'
    },
    dark() {
      return this.$store.state.isDark
    },
    formRules() {
      return {}
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/components/facilities-steps/buiding-details-styles.scss';
</style>
