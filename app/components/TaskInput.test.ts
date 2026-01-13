import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskInput from './TaskInput.vue'

describe('TaskInput.vue', () => {
  it('renders input field and button', () => {
    const wrapper = mount(TaskInput)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('disables button when input is empty', async () => {
    const wrapper = mount(TaskInput)
    const button = wrapper.find('button')
    
    expect(button.attributes('disabled')).toBe('')
  })

  it('enables button when input has text', async () => {
    const wrapper = mount(TaskInput)
    const input = wrapper.find('input')
    
    await input.setValue('New task')
    const button = wrapper.find('button')
    
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('disables button when input is whitespace only', async () => {
    const wrapper = mount(TaskInput)
    const input = wrapper.find('input')
    
    await input.setValue('   ')
    const button = wrapper.find('button')
    
    expect(button.attributes('disabled')).toBe('')
  })

  it('clears input after adding task', async () => {
    const wrapper = mount(TaskInput)
    const input = wrapper.find('input') as any
    const button = wrapper.find('button')
    
    await input.setValue('New task')
    await button.trigger('click')
    
    expect(input.element.value).toBe('')
  })

  it('adds task on Enter key press', async () => {
    const wrapper = mount(TaskInput)
    const input = wrapper.find('input')
    
    await input.setValue('Task via Enter')
    await input.trigger('keyup.enter')
    
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('has accessible labels', () => {
    const wrapper = mount(TaskInput)
    const input = wrapper.find('input')
    const button = wrapper.find('button')
    
    expect(input.attributes('aria-label')).toBeTruthy()
    expect(button.attributes('aria-label')).toBeTruthy()
  })
})
