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
      :before-close="handleClose"
    >
      <h2 class="font-medium fs-large" slot="title">
        Print configuration
      </h2>
      <el-form :rules="formRules" :model="form">
        <el-form-item label="DPI">
          <el-select v-model="form.dpi" class="w-fit-full" :class="{ dark }">
            <el-option
              v-for="(opt, i) in dpiOptions"
              :key="i"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Filename">
          <el-input
            v-model="form.filename"
            class="w-fit-full"
            :class="{ dark }"
          />
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

export default {
  data: () => ({
    printDialog: false,
    printer: undefined,
    form: {
      filename: 'Infrapedia-map',
      dpi: 300
    },
    dpiOptions: [
      {
        label: '96 - lowest resolution',
        value: 96
      },
      {
        label: '150 - regular resolution',
        value: 150
      },
      {
        label: '300 - best resolution',
        value: 300
      }
    ],
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
    formRules() {
      return {
        dpi: []
      }
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
        await this.printer.printMap(this.form.dpi, this.form.filename)
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
