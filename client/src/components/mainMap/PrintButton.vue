<template>
  <div class="relative">
    <el-button
      circle
      type="primary"
      class="w11 h11"
      title="Print map"
      @click.stop="openDialog"
    >
      <fa :icon="['fas', 'print']" />
    </el-button>
    <el-dialog
      :visible.sync="printDialog"
      append-to-body
      :width="dialogWidth"
      :before-close="handleClose"
    >
      <h2 class="font-medium fs-large" slot="title">
        Print configuration
      </h2>
      <el-form>
        <el-form-item>
          <el-radio-group class="w-fit-full" v-model="form.dpi">
            <div class="radio-buttons-wrapper">
              <el-radio-button
                v-for="(opt, i) in printDpiOptions"
                :key="i"
                :label="opt.value"
              >
                <div class="flex column wrap justify-content-center">
                  <el-image lazy :src="opt.img" fit="contain" />
                  <span class="w-fit-full inline-block mt2">
                    {{ opt.label }}
                  </span>
                </div>
              </el-radio-button>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="flex row nowrap justify-content-end footer-buttons">
            <el-button
              type="text"
              plain
              @click.stop="handleClose"
              class="p4 mr2 h12"
            >
              Cancel
            </el-button>
            <el-button
              type="primary"
              @click.stop="print"
              class="h12"
              :loading="donwloadingMap"
            >
              Print map
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import PrintGL from './print'
import printDpiOptions from '../../config/printDpiOptions'

export default {
  data: () => ({
    printDialog: false,
    printer: undefined,
    form: {
      dpi: 96
    },
    printDpiOptions,
    donwloadingMap: false
  }),
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    dialogWidth() {
      return window.innerWidth <= 1200 ? '82%' : '74%'
    }
  },
  mounted() {
    if (this.map) this.initPrint()
  },
  methods: {
    openDialog() {
      this.printDialog = true
    },
    initPrint() {
      this.printer = new PrintGL({ map: this.map })
    },
    handleClose() {
      this.printDialog = false
      this.form = {
        filename: 'Infrapedia-map',
        dpi: 300
      }
    },
    async print() {
      if (this.form.dpi) {
        await this.printer.printMap(this.form.dpi)
        const interval = setInterval(() => {
          this.donwloadingMap = this.printer.getLoading()
          if (!this.donwloadingMap) {
            clearInterval(interval)
          }
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/print-button-styles.scss';
</style>
