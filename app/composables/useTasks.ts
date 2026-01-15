import { ref, computed, readonly } from 'vue'
import type { Task } from '~/shared/types/task'

const STORAGE_KEY = 'nuxt-tasks-v0.1.0'

// Shared state - defined outside the function so all components share the same state
const tasks = ref<Task[]>([])
const isHydrated = ref<boolean>(false)

export function useTasks() {

  // Computed properties
  const isEmpty = computed(() => tasks.value.length === 0)
  const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
  const totalCount = computed(() => tasks.value.length)

  // ID generation with fallback
  const generateId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Action: Add task
  const addTask = (title: string): void => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const newTask: Task = {
      id: generateId(),
      title: trimmedTitle,
      completed: false,
      createdAt: Date.now()
    }

    tasks.value.push(newTask)
    saveTasks()
  }

  // Action: Delete task
  const deleteTask = (id: string): void => {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      saveTasks()
    }
  }

  // Action: Toggle task completion status
  const toggleTask = (id: string): void => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      saveTasks()
    }
  }

  // Persistence: Save tasks to localStorage
  const saveTasks = (): void => {
    if (typeof window === 'undefined') return

    try {
      const serialized = JSON.stringify(tasks.value)
      localStorage.setItem(STORAGE_KEY, serialized)
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error)
      // Gracefully degrade: tasks continue to exist in memory
    }
  }

  // Persistence: Load tasks from localStorage
  const loadTasks = (): void => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Task[]
        // Validate that each item has required fields
        const validated = parsed.filter(
          item => item.id && item.title && typeof item.completed === 'boolean'
        )
        tasks.value = validated
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error)
      // Gracefully degrade: start with empty array
      tasks.value = []
    }
  }

  // Hydration: Initialize tasks on client mount
  const initializeTasks = (): void => {
    if (typeof window === 'undefined') return

    loadTasks()
    isHydrated.value = true
  }

  // Reset state (for testing)
  const resetState = (): void => {
    tasks.value = []
    isHydrated.value = false
  }

  return {
    tasks: readonly(tasks),
    isHydrated: readonly(isHydrated),
    isEmpty,
    completedCount,
    totalCount,
    addTask,
    deleteTask,
    toggleTask,
    saveTasks,
    loadTasks,
    initializeTasks,
    resetState
  }
}
