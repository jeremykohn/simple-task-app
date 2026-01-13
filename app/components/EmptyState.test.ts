import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'

describe('EmptyState.vue', () => {
  it('renders friendly message', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.text()).toContain('No tasks yet')
    expect(wrapper.text()).toContain('Add one to get started')
  })

  it('renders checkmark icon', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.text()).toContain('✓')
  })

  it('has centered styling classes', () => {
    const wrapper = mount(EmptyState)
    const container = wrapper.find('div')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('items-center')
    expect(container.classes()).toContain('justify-center')
  })
})
