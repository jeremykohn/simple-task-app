import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTasks } from './useTasks'

declare const global: { localStorage: Storage }

describe('useTasks composable', () => {
  beforeEach(() => {
    // Reset shared state before each test
    const { resetState } = useTasks()
    resetState()

    // Mock localStorage
    const store: Record<string, string> = {}
    
    global.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        for (const key in store) {
          delete store[key]
        }
      },
      length: 0,
      key: (index: number) => null
    } as any
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('initializes with empty tasks array', () => {
    const { tasks, isEmpty } = useTasks()
    expect(tasks.value).toEqual([])
    expect(isEmpty.value).toBe(true)
  })

  it('adds a new task', () => {
    const { tasks, addTask } = useTasks()
    addTask('Test task')
    
    expect(tasks.value).toHaveLength(1)
    // `noUncheckedIndexedAccess` makes array indexing possibly-undefined in TS
    expect(tasks.value[0]!.title).toBe('Test task')
    expect(tasks.value[0]!.completed).toBe(false)
  })

  it('does not add empty or whitespace-only tasks', () => {
    const { tasks, addTask } = useTasks()
    addTask('')
    addTask('   ')
    
    expect(tasks.value).toHaveLength(0)
  })

  it('deletes a task by id', () => {
    const { tasks, addTask, deleteTask } = useTasks()
    addTask('Task 1')
    addTask('Task 2')
    
    const firstTaskId = tasks.value[0]!.id
    deleteTask(firstTaskId)
    
    expect(tasks.value).toHaveLength(1)
    expect(tasks.value[0]!.title).toBe('Task 2')
  })

  it('toggles task completion status', () => {
    const { tasks, addTask, toggleTask } = useTasks()
    addTask('Test task')
    
    const taskId = tasks.value[0]!.id
    expect(tasks.value[0]!.completed).toBe(false)
    
    toggleTask(taskId)
    expect(tasks.value[0]!.completed).toBe(true)
    
    toggleTask(taskId)
    expect(tasks.value[0]!.completed).toBe(false)
  })

  it('counts completed tasks correctly', () => {
    const { tasks, addTask, toggleTask, completedCount } = useTasks()
    addTask('Task 1')
    addTask('Task 2')
    addTask('Task 3')
    
    expect(completedCount.value).toBe(0)
    
    toggleTask(tasks.value[0]!.id)
    expect(completedCount.value).toBe(1)
    
    toggleTask(tasks.value[1]!.id)
    expect(completedCount.value).toBe(2)
  })

  it('saves tasks to localStorage', () => {
    const { addTask, saveTasks } = useTasks()
    addTask('Persistent task')
    saveTasks()
    
    const stored = localStorage.getItem('nuxt-tasks-v0.1.0')
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].title).toBe('Persistent task')
  })

  it('loads tasks from localStorage', () => {
    // First, save some tasks
    const savedTask = {
      id: 'test-id-1',
      title: 'Loaded task',
      completed: false,
      createdAt: Date.now()
    }
    localStorage.setItem('nuxt-tasks-v0.1.0', JSON.stringify([savedTask]))
    
    // Now load them
    const { tasks, loadTasks } = useTasks()
    loadTasks()
    
    expect(tasks.value).toHaveLength(1)
    expect(tasks.value[0]!.title).toBe('Loaded task')
  })

  it('handles invalid localStorage data gracefully', () => {
    localStorage.setItem('nuxt-tasks-v0.1.0', 'invalid json')
    
    const { tasks, loadTasks } = useTasks()
    // Should not throw
    expect(() => loadTasks()).not.toThrow()
    expect(tasks.value).toEqual([])
  })

  it('generates unique ids for tasks', () => {
    const { tasks, addTask } = useTasks()
    addTask('Task 1')
    addTask('Task 2')
    addTask('Task 3')
    
    const ids = tasks.value.map(t => t.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(3)
  })
})
