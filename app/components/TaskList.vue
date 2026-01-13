<template>
  <div class="bg-white rounded-lg shadow">
    <EmptyState v-if="isEmpty" />
    <div v-else>
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @delete="deleteTask"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTasks } from '~/app/composables/useTasks'

const { tasks, isEmpty, toggleTask, deleteTask } = useTasks()
</script>
