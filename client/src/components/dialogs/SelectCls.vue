<template>
  <el-dialog
    :visible.sync="isVisible"
    width="40%"
    top="12vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :show-close="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        Search and select CLS
      </h1>
    </header>
    <div>
      <header>
        <el-input
          v-model="clsSearch"
          class="w-fit-full"
          @input="handleSearchChange"
        >
          <el-button slot="append">
            <fa :icon="['fas', 'search']" />
          </el-button>
        </el-input>
      </header>
      <el-divider />
      <div class="flex row wrap mt8" v-loading="loading">
        <div
          v-for="(cls, i) in clsList"
          :key="i"
          class="box p2 w32 ml2 mb2 text-center h-fit-full cursor-pointer transition-all"
          :class="{ selected: selectionList.map(c => c._id).includes(cls._id) }"
          @click="handleSelectionChange(cls)"
        >
          <fa :icon="['fas', 'award']" v-if="cls.yours === 1" class="mr1" />
          <p class="m0 p0 font-thin fs-medium">
            {{ cls.name }}
          </p>
        </div>
      </div>
    </div>
    <footer class="footer flex wrap justify-content-start p0 mt4">
      <small>
        <strong> Remark: </strong>these changes are independent whether you save
        the subsea cable or not, the selected cls will stay put.
      </small>
    </footer>
    <div class="flex row flex-end">
      <el-button plain @click="handleClose">
        Close
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  searchCls,
  clsUpdateCable,
  clsRemoveCable
} from '../../services/api/cls'
import debounce from '../../helpers/debounce'
import { SELECTION_CHANGE } from '../../events/selectClsDialog'

export default {
  name: 'SelectClsDialog',
  data: () => ({
    loading: false,
    clsList: [],
    clsSearch: '',
    selectionList: []
  }),
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    selectedData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  watch: {
    isVisible(bool) {
      if (bool && this.selectedData.length) {
        this.clsList = this.selectedData
        this.selectionList = this.selectedData
      }
    }
  },
  methods: {
    handleSelectionChange(data) {
      return !this.selectionList.map(c => c._id).includes(data._id)
        ? this.updateSelectedCLS(data)
        : this.updateRemoveSelectedCLS(data)
    },
    async updateSelectedCLS(data) {
      const res = await clsUpdateCable({
        cable_id: this.$route.query.item,
        user_id: await this.$auth.getUserID(),
        _id: data._id
      })

      if (res && res.data && res.t !== 'error') {
        this.selectionList.push(data)
        this.$emit(`${SELECTION_CHANGE}`, [...this.selectionList])
      }
    },
    async updateRemoveSelectedCLS(data) {
      const res = await clsRemoveCable({
        cable_id: this.$route.query.item,
        user_id: await this.$auth.getUserID(),
        _id: data._id
      })

      if (res && res.data && res.t !== 'error') {
        this.selectionList = this.selectionList.filter(c => c._id !== data._id)
        this.$emit(`${SELECTION_CHANGE}`, [...this.selectionList])
      }
    },
    handleSearchChange: debounce(async function(s) {
      this.loading = true
      const res = await searchCls({ user_id: await this.$auth.getUserID(), s })
      if (res && res.data) {
        this.clsList = res.data
      }
      this.loading = false
    }, 320),
    handleClose() {
      this.clsSearch = ''
      this.clsList = []
      return this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/components/select-cls-dialog-styles.scss';
</style>
