import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskItem from './TaskItem.vue'
import type { Task } from '~/shared/types/task'

describe('TaskItem.vue', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    completed: false,
    createdAt: Date.now()
  }

  it('renders task title', () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask }
    })
    expect(wrapper.text()).toContain('Test Task')
  })

  it('displays strikethrough when task is completed', () => {
    const completedTask = { ...mockTask, completed: true }
    const wrapper = mount(TaskItem, {
      props: { task: completedTask }
    })
    const taskText = wrapper.find('span')
    expect(taskText.classes()).toContain('line-through')
  })

  it('does not display strikethrough when task is incomplete', () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask }
    })
    const taskText = wrapper.find('span')
    expect(taskText.classes()).not.toContain('line-through')
  })

  it('emits toggle event when checkbox is clicked', async () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask }
    })
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.trigger('change')
    
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')?.[0]).toEqual(['task-1'])
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask }
    })
    const deleteButton = wrapper.find('button')
    await deleteButton.trigger('click')
    
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual(['task-1'])
  })

  it('has accessible labels', () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask }
    })
    const checkbox = wrapper.find('input[type="checkbox"]')
    const deleteButton = wrapper.find('button')
    
    expect(checkbox.attributes('aria-label')).toBeTruthy()
    expect(deleteButton.attributes('aria-label')).toBeTruthy()
  })
})
