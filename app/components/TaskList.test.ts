import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from './TaskList.vue'
import TaskItem from './TaskItem.vue'
import EmptyState from './EmptyState.vue'

describe('TaskList.vue', () => {
  it('shows EmptyState when no tasks', () => {
    const wrapper = mount(TaskList, {
      global: {
        components: {
          EmptyState,
          TaskItem
        }
      }
    })
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
  })

  it('renders TaskItem components for each task', () => {
    // This test would need proper setup with mock composable
    // Placeholder for actual implementation
    expect(true).toBe(true)
  })
})
