<template>
  <el-form class="flex row nowrap" :model="form">
    <div class="el-card" style="width: 50%" :class="{ dark }">
      <header class="p4" :class="{ dark }">
        Security details
      </header>
      <el-row class="p4" :gutter="40">
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="Bullet Proof Glass">
                <br />
                <el-radio-group v-model="form.bulletProffGlass">
                  <el-radio-button :label="true">
                    Yes
                  </el-radio-button>
                  <el-radio-button :label="false">
                    No
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CCTV">
                <br />
                <el-radio-group v-model="form.cctv">
                  <el-radio-button :label="true">
                    Yes
                  </el-radio-button>
                  <el-radio-button :label="false">
                    No
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Security Guards">
                <br />
                <el-radio-group v-model="form.securityGuards">
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
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="Mantrap">
                <br />
                <el-radio-group v-model="form.mantrap">
                  <el-radio-button :label="true">
                    Yes
                  </el-radio-button>
                  <el-radio-button :label="false">
                    No
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Biometric">
                <br />
                <el-radio-group v-model="form.biometric">
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
    </div>
    <div class="el-card" style="width: 50%" :class="{ dark }">
      <header class="p4" :class="{ dark }">
        Onsite Services
      </header>
      <el-row class="p4" :gutter="40">
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-row :gutter="4">
                <el-col :span="10">
                  <el-form-item label="Meeting Rooms">
                    <br />
                    <el-radio-group v-model="form.meetingRooms">
                      <el-radio-button :label="true">
                        Yes
                      </el-radio-button>
                      <el-radio-button :label="false">
                        No
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="Break Rooms">
                    <br />
                    <el-radio-group v-model="form.breakRooms">
                      <el-radio-button :label="true">
                        Yes
                      </el-radio-button>
                      <el-radio-button :label="false">
                        No
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="Car Parking">
                    <br />
                    <el-radio-group v-model="form.carParking">
                      <el-radio-button :label="true">
                        Yes
                      </el-radio-button>
                      <el-radio-button :label="false">
                        No
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="Spare Parts">
                    <br />
                    <el-radio-group v-model="form.spareParts">
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
            <el-row>
              <el-col :span="24">
                <el-row :gutter="4">
                  <el-col :span="10">
                    <el-form-item label="Staging Rooms">
                      <br />
                      <el-radio-group v-model="form.stagingRooms">
                        <el-radio-button :label="true">
                          Yes
                        </el-radio-button>
                        <el-radio-button :label="false">
                          No
                        </el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="Office Space">
                      <br />
                      <el-radio-group v-model="form.officeSpace">
                        <el-radio-button :label="true">
                          Yes
                        </el-radio-button>
                        <el-radio-button :label="false">
                          No
                        </el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="Internet Access">
                      <br />
                      <el-radio-group v-model="form.internetAccess">
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
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'SecurityDetails',
  data: () => ({
    options: []
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
