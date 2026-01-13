<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Task List</h1>
        <p class="text-gray-600">
          Keep track of your tasks. Data is automatically saved to your browser.
        </p>
      </div>

      <!-- Stats (optional) -->
      <div v-if="isHydrated && !isEmpty" class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div class="bg-white rounded-lg p-4 shadow">
          <div class="text-gray-500 text-sm mb-1">Total Tasks</div>
          <div class="text-2xl font-bold text-gray-900">{{ totalCount }}</div>
        </div>
        <div class="bg-white rounded-lg p-4 shadow">
          <div class="text-gray-500 text-sm mb-1">Completed</div>
          <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
        </div>
        <div class="bg-white rounded-lg p-4 shadow col-span-2 md:col-span-1">
          <div class="text-gray-500 text-sm mb-1">Remaining</div>
          <div class="text-2xl font-bold text-blue-600">{{ totalCount - completedCount }}</div>
        </div>
      </div>

      <!-- Main content (only render when hydrated to prevent SSR mismatch) -->
      <div v-if="isHydrated" class="space-y-4">
        <TaskInput />
        <TaskList />
      </div>

      <!-- Loading state -->
      <div v-else class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="text-gray-500 mt-4">Loading tasks...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTasks } from '~/app/composables/useTasks'

const { isHydrated, isEmpty, totalCount, completedCount, initializeTasks } = useTasks()

// Initialize tasks on client mount
onMounted(() => {
  initializeTasks()
})
</script>
