<template>
  <div class="flex gap-2 p-4 border-b border-gray-200 bg-white">
    <input
      v-model="inputValue"
      @keyup.enter="handleAdd"
      type="text"
      placeholder="Add a new task..."
      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      aria-label="New task input"
    />
    <button
      @click="handleAdd"
      :disabled="isButtonDisabled"
      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Add task button"
    >
      Add
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTasks } from '~/app/composables/useTasks'

const inputValue = ref('')
const { addTask } = useTasks()

const isButtonDisabled = computed(() => !inputValue.value.trim())

const handleAdd = () => {
  if (!isButtonDisabled.value) {
    addTask(inputValue.value)
    inputValue.value = ''
  }
}
</script>
