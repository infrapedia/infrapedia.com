import UserCablesButton from '@/components/UserCablesButton.vue'
import { mount, createLocalVue } from '@vue/test-utils'
// eslint-disable-next-line
import Vue from 'vue' // added
import ElementUI from 'element-ui' // added
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
  faTimes,
  faBezierCurve
} from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faTimes, faBezierCurve)

const localVue = createLocalVue() // added
localVue.use(ElementUI)
localVue.component('fa', FontAwesomeIcon)

function factory(opts = {}) {
  return mount(UserCablesButton, {
    ...opts,
    localVue
  })
}

test('main wrapper to be visible', () => {
  const wrapper = factory({
    computed: {
      dark() {
        return false
      }
    }
  })

  expect(wrapper.isVisible()).toBe(true)
})

test('el-popover element to exist and not be visible', () => {
  const wrapper = factory({
    computed: {
      dark() {
        return false
      }
    }
  })

  expect(wrapper.get('.el-popover').isVisible()).toBe(false)
})
