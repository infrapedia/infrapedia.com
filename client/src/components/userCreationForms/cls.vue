<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title">{{ title }} CLS</h1>
    </header>
    <el-form ref="form" :model="form">
      <el-form-item label="Name">
        <el-input class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="State">
        <el-radio-group v-model="form.state">
          <el-radio :label="true">
            Yes
          </el-radio>
          <el-radio :label="false">
            No
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Slug">
        <el-input
          class="w-fit-full"
          controls-position="right"
          v-model="form.slug"
        />
      </el-form-item>
      <el-form-item label="Geometry">
        <el-input class="w-fit-full" v-model="form.geom" />
      </el-form-item>
      <el-form-item label="Cables">
        <el-select
          class="w-fit-full"
          v-model="form.cables"
          multiple
          filterable
          collapse-tags
          placeholder
        >
          <el-option
            v-for="(opt, i) in []"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <dragger />
      </el-form-item>
      <el-form-item class="mt24">
        <el-button type="primary" class="w-fit-full" round @click="sendData">
          {{ this.title }} CLS
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Dragger from '../../components/Dragger'

export default {
  name: 'CLSForm',
  components: {
    Dragger
  },
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
    title() {
      return this.mode === 'create' ? 'Create' : 'Edit'
    }
  },
  methods: {
    sendData() {
      return this.$emit('send-data')
    }
  }
}
</script>
