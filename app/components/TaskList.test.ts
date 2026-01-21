import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import TaskList from './TaskList.vue'
import TaskItem from './TaskItem.vue'
import EmptyState from './EmptyState.vue'

const mockTasks = ref([
  { id: '1', title: 'Task 1', completed: false, createdAt: Date.now() },
  { id: '2', title: 'Task 2', completed: true, createdAt: Date.now() },
  { id: '3', title: 'Task 3', completed: false, createdAt: Date.now() }
])

vi.mock('~/composables/useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasks,
    isEmpty: computed(() => mockTasks.value.length === 0),
    toggleTask: vi.fn(),
    deleteTask: vi.fn()
  })
}))

describe('TaskList.vue', () => {
  it('shows EmptyState when no tasks', () => {
    mockTasks.value = []
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
    mockTasks.value = [
      { id: '1', title: 'Task 1', completed: false, createdAt: Date.now() },
      { id: '2', title: 'Task 2', completed: true, createdAt: Date.now() },
      { id: '3', title: 'Task 3', completed: false, createdAt: Date.now() }
    ]
    const wrapper = mount(TaskList, {
      global: {
        components: {
          EmptyState,
          TaskItem
        }
      }
    })
    
    const taskItems = wrapper.findAllComponents(TaskItem)
    expect(taskItems).toHaveLength(3)
    // `noUncheckedIndexedAccess` makes array indexing possibly-undefined in TS
    expect(taskItems[0]!.props('task').title).toBe('Task 1')
    expect(taskItems[1]!.props('task').title).toBe('Task 2')
    expect(taskItems[2]!.props('task').title).toBe('Task 3')
  })
})
