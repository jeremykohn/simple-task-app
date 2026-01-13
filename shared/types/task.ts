export interface Task {
  id: string              // Unique identifier (UUID or timestamp-based)
  title: string           // Task text content
  completed: boolean      // Completion status
  createdAt: number       // Timestamp for ordering/debugging
}
