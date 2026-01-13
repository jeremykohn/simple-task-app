<template>
  <div
    class="flex items-center gap-3 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
  >
    <!-- Checkbox -->
    <input
      type="checkbox"
      :checked="task.completed"
      @change="$emit('toggle', task.id)"
      class="h-5 w-5 rounded border-gray-300 text-blue-600 cursor-pointer"
      :aria-label="`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`"
    />

    <!-- Task text -->
    <span
      :class="[
        'flex-1 text-base',
        task.completed ? 'line-through text-gray-400' : 'text-gray-900'
      ]"
    >
      {{ task.title }}
    </span>

    <!-- Delete button -->
    <button
      @click="$emit('delete', task.id)"
      class="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
      :aria-label="`Delete task: ${task.title}`"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/shared/types/task'

defineProps<{
  task: Task
}>()

defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()
</script>
