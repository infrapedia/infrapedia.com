import { shallowMount } from '@vue/test-utils'
import Map from '@/components/Map.vue'

describe('Map.vue', () => {
  it('has a map container and the map is visible', () => {
    const wrapper = shallowMount(Map)
    expect(wrapper.contains('map'))
    expect(wrapper.isVisible())
  })
})
