import UserCablesButton from '@/components/UserCablesButton.vue'
import { mount, createLocalVue } from '@vue/test-utils'
// eslint-disable-next-line
import Vue from 'vue'
import ElementUI from 'element-ui'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
  faTimes,
  faBezierCurve
} from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faTimes, faBezierCurve)

const localVue = createLocalVue()
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

test('el-popover element to exist and be visible', () => {
  const wrapper = factory({
    data: () => ({
      isListOpen: true,
      cablesList: []
    }),
    computed: {
      dark() {
        return false
      }
    }
  })

  expect(wrapper.get('.el-popover').isVisible()).toBe(true)
})

test('expect cablesList to exist and be an empty Array', () => {
  const wrapper = factory({
    data: () => ({
      isListOpen: true,
      cablesList: []
    }),
    computed: {
      dark() {
        return false
      }
    }
  })

  expect(wrapper.vm.cablesList).toEqual([])
})

test('expect loading to be false', () => {
  const wrapper = factory({
    data: () => ({
      isListOpen: true,
      cablesList: [],
      loading: false
    }),
    computed: {
      dark() {
        return false
      }
    }
  })

  expect(wrapper.vm.loading).toBe(false)
})

test('expect handleItemListSelection function to be defined', () => {
  const wrapper = factory({
    data: () => ({
      isListOpen: true,
      cablesList: [],
      loading: false
    }),
    computed: {
      dark() {
        return false
      }
    }
  })

  expect(wrapper.vm.handleItemListSelection).toBeDefined()
})

// test('expect handleItemListSelection function to throw an error when not passing an id', async () => {
//   const wrapper = factory({
//     data: () => ({
//       isListOpen: true,
//       cablesList: [],
//       loading: false
//     }),
//     computed: {
//       dark() {
//         return false
//       }
//     }
//   })
// const funcT = wrapper.vm.handleItemListSelection
// console.log(funcT({}))
// // const fn = jest.fn()
// // console.log(fn)
// expect.assertions(1)
// await expect(funcT({ option: 'cable', id: null })).rejects()
// })
