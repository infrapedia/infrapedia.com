<template>
  <el-row>
    <el-col :span="14">
      <div class="el-card" :class="{ dark }">
        <header class="p4" :class="{ dark }">
          Building details
        </header>
        <el-row class="p4" :gutter="40">
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-form-item label="Gross Building Size (sq meters)">
                  <div class="block">
                    <el-input-number
                      class="w-fit-full"
                      controls-position="right"
                      v-model="form.buildingSize"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Gross Colocation Size (sq meters)">
                  <div class="block">
                    <el-input-number
                      class="w-fit-full"
                      controls-position="right"
                      v-model="form.grossColocationSize"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Floor Loading Capacity (Kg/sq meters)">
                  <div class="block">
                    <el-input-number
                      class="w-fit-full"
                      controls-position="right"
                      v-model="form.floorLoadingCapacity"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-row :gutter="2">
                  <el-col :span="10">
                    <el-form-item label="Carrier Neutral">
                      <br />
                      <el-radio-group v-model="form.isCarrierNeutral">
                        <el-radio-button :label="true">
                          Yes
                        </el-radio-button>
                        <el-radio-button :label="false">
                          No
                        </el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Loading Docks">
                      <br />
                      <el-radio-group v-model="form.isLoadingDocks">
                        <el-radio-button :label="true">
                          Yes
                        </el-radio-button>
                        <el-radio-button :label="false">
                          No
                        </el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-form-item label="Type">
                  <el-select
                    class="w-fit-full"
                    v-model="form.type"
                    placeholder
                    :class="{ dark }"
                  >
                    <el-option
                      v-for="item in typeOptions"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Rack Height">
                  <div class="block">
                    <el-input-number
                      :class="{ dark }"
                      class="w-fit-full"
                      controls-position="right"
                      v-model="form.rackHeight"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Meet me rooms" class="pr2 pl2">
                  <br />
                  <el-slider v-model="form.meetMeRooms" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Platform">
                  <br />
                  <el-radio-group v-model="form.platform">
                    <el-radio-button label="antenna">
                      Antenna
                    </el-radio-button>
                    <el-radio-button label="satellite">
                      Satellite
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="10">
      <div class="svg-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 314.745 219.574"
        >
          <g
            id="undraw_coming_home_52ir_1_"
            data-name="undraw_coming_home_52ir(1)"
            transform="translate(0 0)"
          >
            <path
              id="Path_160"
              data-name="Path 160"
              d="M167.487,559.75l-.54-.139c6.022-30.65,21.157-58.483,42.617-78.372,32.983-30.521,77.383-39.429,117.471-23.568s70.2,54.25,79.667,101.566l-.54.141c-12.748-64.059-61.806-108.8-119.3-108.8C230.121,450.58,179.917,496.492,167.487,559.75Z"
              transform="translate(-129.452 -340.177)"
              fill="#3f3d56"
            />
            <path
              id="Path_161"
              data-name="Path 161"
              d="M214.261,775.652a6.3,6.3,0,0,0,2.075,3.212,7.2,7.2,0,0,0,.377-3.971,6.3,6.3,0,0,0-2.075-3.212A7.2,7.2,0,0,0,214.261,775.652Z"
              transform="translate(-163.567 -559.988)"
              fill="#3f3d56"
            />
            <path
              id="Path_162"
              data-name="Path 162"
              d="M208.719,779.52a6.893,6.893,0,0,1,1.444,3.637,5.184,5.184,0,0,1-3.216-1.554,6.893,6.893,0,0,1-1.444-3.637A5.184,5.184,0,0,1,208.719,779.52Z"
              transform="translate(-157.336 -564.282)"
              fill="#e6e6e6"
            />
            <path
              id="Path_163"
              data-name="Path 163"
              d="M343.261,775.652a6.3,6.3,0,0,0,2.075,3.212,7.2,7.2,0,0,0,.377-3.971,6.3,6.3,0,0,0-2.075-3.212A7.2,7.2,0,0,0,343.261,775.652Z"
              transform="translate(-256.857 -559.988)"
              fill="#3f3d56"
            />
            <path
              id="Path_164"
              data-name="Path 164"
              d="M337.719,779.52a6.893,6.893,0,0,1,1.444,3.637,5.184,5.184,0,0,1-3.216-1.554,6.893,6.893,0,0,1-1.444-3.637A5.184,5.184,0,0,1,337.719,779.52Z"
              transform="translate(-250.626 -564.282)"
              fill="#e6e6e6"
            />
            <path
              id="Path_165"
              data-name="Path 165"
              d="M322.94,101.056l-5.654-5.176,31.661-32.351H429.23V92l-52.015,40.115Z"
              transform="translate(-229.455 -43.404)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_166"
              data-name="Path 166"
              d="M600.565,81.676v-17.5H589.906v4.286l-3.978-4.932L559.92,95.88l-10.177,7.764L533.964,235.577l23.8,27.233h55.3V97.174Z"
              transform="translate(-386.152 -43.404)"
              fill="#ccc"
            />
            <rect
              id="Rectangle_99"
              data-name="Rectangle 99"
              width="85.937"
              height="166.93"
              transform="translate(87.831 52.476)"
              fill="#f2f2f2"
            />
            <rect
              id="Rectangle_100"
              data-name="Rectangle 100"
              width="15.831"
              height="40.762"
              transform="translate(121.188 178.644)"
              fill="#ccc"
            />
            <path
              id="Path_167"
              data-name="Path 167"
              d="M358.791,586.723v-6.47h-6.784v6.47h6.784Z"
              transform="translate(-254.564 -396.433)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_168"
              data-name="Path 168"
              d="M358.226,617.016h-6.219v6.47h6.784v-6.47Z"
              transform="translate(-254.564 -421.549)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_101"
              data-name="Rectangle 101"
              width="6.785"
              height="6.47"
              transform="translate(108.75 183.82)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_102"
              data-name="Rectangle 102"
              width="6.785"
              height="6.47"
              transform="translate(108.75 195.466)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_169"
              data-name="Path 169"
              d="M526.267,586.723v-6.47h-6.784v6.47h6.784Z"
              transform="translate(-375.679 -396.433)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_170"
              data-name="Path 170"
              d="M525.7,617.016h-6.219v6.47h6.784v-6.47Z"
              transform="translate(-375.679 -421.549)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_103"
              data-name="Rectangle 103"
              width="6.785"
              height="6.47"
              transform="translate(155.111 183.82)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_104"
              data-name="Rectangle 104"
              width="6.785"
              height="6.47"
              transform="translate(155.111 195.466)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_171"
              data-name="Path 171"
              d="M697.828,178.246v-6.47h-6.785v6.47h6.785Z"
              transform="translate(-499.748 -117.359)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_172"
              data-name="Path 172"
              d="M697.262,208.539h-6.219v6.47h6.785v-6.47Z"
              transform="translate(-499.748 -142.475)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_105"
              data-name="Rectangle 105"
              width="6.785"
              height="6.47"
              transform="translate(202.603 54.417)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_106"
              data-name="Rectangle 106"
              width="6.785"
              height="6.47"
              transform="translate(202.603 66.064)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_173"
              data-name="Path 173"
              d="M697.828,292.619v-6.47h-6.785v6.47h6.785Z"
              transform="translate(-499.748 -195.499)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_174"
              data-name="Path 174"
              d="M697.262,322.912h-6.219v6.47h6.785v-6.47Z"
              transform="translate(-499.748 -220.616)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_107"
              data-name="Rectangle 107"
              width="6.785"
              height="6.47"
              transform="translate(202.603 90.65)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_108"
              data-name="Rectangle 108"
              width="6.785"
              height="6.47"
              transform="translate(202.603 102.296)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_175"
              data-name="Path 175"
              d="M697.828,406.993v-6.47h-6.785v6.47h6.785Z"
              transform="translate(-499.748 -273.64)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_176"
              data-name="Path 176"
              d="M697.262,437.286h-6.219v6.47h6.785v-6.47Z"
              transform="translate(-499.748 -298.757)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_109"
              data-name="Rectangle 109"
              width="6.785"
              height="6.47"
              transform="translate(202.603 126.883)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_110"
              data-name="Rectangle 110"
              width="6.785"
              height="6.47"
              transform="translate(202.603 138.529)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_177"
              data-name="Path 177"
              d="M697.828,521.367V514.9h-6.785v6.47h6.785Z"
              transform="translate(-499.748 -351.781)"
              fill="rgba(63,61,86,0.3)"
            />
            <path
              id="Path_178"
              data-name="Path 178"
              d="M697.262,551.66h-6.219v6.47h6.785v-6.47Z"
              transform="translate(-499.748 -376.898)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_111"
              data-name="Rectangle 111"
              width="6.785"
              height="6.47"
              transform="translate(202.603 163.116)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_112"
              data-name="Rectangle 112"
              width="6.785"
              height="6.47"
              transform="translate(202.603 174.762)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_113"
              data-name="Rectangle 113"
              width="65.584"
              height="15.528"
              transform="translate(97.443 60.887)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_114"
              data-name="Rectangle 114"
              width="65.584"
              height="15.528"
              transform="translate(97.443 91.944)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_115"
              data-name="Rectangle 115"
              width="65.584"
              height="15.528"
              transform="translate(97.443 123.001)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_116"
              data-name="Rectangle 116"
              width="65.584"
              height="15.528"
              transform="translate(97.443 154.058)"
              fill="rgba(63,61,86,0.3)"
            />
            <rect
              id="Rectangle_117"
              data-name="Rectangle 117"
              width="314.745"
              height="0.634"
              transform="translate(0 218.755)"
              fill="#3f3d56"
            />
            <rect
              id="Rectangle_118"
              data-name="Rectangle 118"
              width="1.626"
              height="73.513"
              transform="translate(52.708 145.603)"
              fill="#3f3d56"
            />
            <path
              id="Path_179"
              data-name="Path 179"
              d="M198.987,492.433c.1,25.706-15.7,46.628-15.7,46.628s-15.971-20.755-16.075-46.46,15.7-46.628,15.7-46.628S198.883,466.728,198.987,492.433Z"
              transform="translate(-129.644 -337.462)"
              fill="#e6e6e6"
            />
            <path
              id="Path_180"
              data-name="Path 180"
              d="M198.987,492.433c.1,25.706-15.7,46.628-15.7,46.628s-15.971-20.755-16.075-46.46,15.7-46.628,15.7-46.628S198.883,466.728,198.987,492.433Z"
              transform="translate(-129.644 -337.462)"
              opacity="0.1"
            />
            <rect
              id="Rectangle_119"
              data-name="Rectangle 119"
              width="1.626"
              height="73.513"
              transform="translate(31.567 145.603)"
              fill="#3f3d56"
            />
            <path
              id="Path_181"
              data-name="Path 181"
              d="M122.615,492.433c.1,25.706-15.7,46.628-15.7,46.628S90.944,518.306,90.84,492.6s15.7-46.628,15.7-46.628S122.511,466.728,122.615,492.433Z"
              transform="translate(-74.413 -337.462)"
              fill="#e6e6e6"
            />
            <path
              id="Path_182"
              data-name="Path 182"
              d="M916.348,240.534c-12.81.068-23.237.284-23.237.284s12.394-18.788,23.191-11.827a138.1,138.1,0,0,0,23.2,11.583S929.158,240.466,916.348,240.534Z"
              transform="translate(-654.599 -188.162)"
              fill="#f2f2f2"
            />
            <path
              id="Path_183"
              data-name="Path 183"
              d="M145.348,354.534c-12.81.068-23.237.284-23.237.284S134.505,336.03,145.3,342.99a138.1,138.1,0,0,0,23.2,11.583S158.158,354.466,145.348,354.534Z"
              transform="translate(-97.028 -266.047)"
              fill="#f2f2f2"
            />
            <path
              id="Path_184"
              data-name="Path 184"
              d="M313.348,116.534c-12.81.068-23.237.284-23.237.284S302.505,98.03,313.3,104.991a138.1,138.1,0,0,0,23.2,11.583S326.158,116.466,313.348,116.534Z"
              transform="translate(-218.522 -103.444)"
              fill="#f2f2f2"
            />
            <rect
              id="Rectangle_120"
              data-name="Rectangle 120"
              width="1.626"
              height="73.513"
              transform="translate(286.518 145.603)"
              fill="#3f3d56"
            />
            <path
              id="Path_185"
              data-name="Path 185"
              d="M1043.62,492.433c.1,25.706-15.7,46.628-15.7,46.628s-15.971-20.755-16.075-46.46,15.7-46.628,15.7-46.628S1043.514,466.728,1043.62,492.433Z"
              transform="translate(-740.465 -337.462)"
              fill="#e6e6e6"
            />
            <path
              id="Path_186"
              data-name="Path 186"
              d="M802.489,537.852H818.9v-4.534h9.055v4.534h16.978v20.078H827.957v25.259H818.9V557.929H802.489L794,546.919Z"
              transform="translate(-574.204 -364.366)"
              fill="#72708b"
            />
          </g>
        </svg>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'BuildingDetails',
  data: () => ({
    typeOptions: ['Rack', 'Cages', 'Suites']
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/components/facilities-steps/buiding-details-styles.scss';
</style>
