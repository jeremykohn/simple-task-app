# Nuxt 4 Task List Application — Implementation Plan

## 1. Project Structure & Architecture

### Directory Layout (Nuxt 4 Standard)
```
nuxt-task-app/
├── app/                         # Client-side app code (Vue components, pages, layouts)
│   ├── app.vue                  # Root component (main entry point)
│   ├── layouts/
│   │   └── default.vue          # Default layout wrapper
│   ├── pages/                   # File-based routing (optional for this simple app)
│   ├── components/
│   │   ├── TaskInput.vue        # Input field + Add button
│   │   ├── TaskList.vue         # Task list wrapper
│   │   ├── TaskItem.vue         # Individual task row (checkbox, text, delete button)
│   │   └── EmptyState.vue       # Friendly message when no tasks
│   └── composables/
│       └── useTasks.ts          # State management composable for tasks
│
├── server/                      # Server-side code (API routes, middleware, utils)
│   └── utils/                   # Optional: server utilities (not needed for this app)
│
├── shared/                      # Shared code (types, utilities, constants)
│   └── types/
│       └── task.ts              # TypeScript interfaces (Task interface)
│
├── public/                      # Static assets (favicon, images, etc.)
│   └── (static files, if needed)
│
├── content/                     # Content collection (not needed for this app)
│   └── (optional: could store task templates or docs)
│
├── modules/                     # Nuxt modules (Tailwind module auto-imported)
│   └── (managed via nuxt.config.ts)
│
├── nuxt.config.ts              # Nuxt configuration (Tailwind, auto-imports, etc.)
├── package.json                # Dependencies (Nuxt 4, @nuxtjs/tailwindcss, etc.)
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── .gitignore
```

### Directory Purpose Reference

| Directory | Purpose | For This App |
|-----------|---------|--------------|
| **app/** | All client-side code (Vue components, composables, layouts) | ✅ Used (TaskInput, TaskList, TaskItem, EmptyState, useTasks) |
| **server/** | Server-side code (API endpoints, middleware) | ⚠️ Optional (not needed for this simple app; data lives in LocalStorage) |
| **shared/** | Shared types, utils, constants (used by both client & server) | ✅ Used (Task interface) |
| **public/** | Static assets served directly | ✅ Used (if we add images/icons) |
| **content/** | Markdown/data content collections | ❌ Not used (this app doesn't need content) |
| **modules/** | Custom Nuxt modules | ❌ Not needed (Tailwind is auto-configured) |

### Auto-Import Behavior in Nuxt 4
- Components in `app/components/` are auto-imported (no manual `import` needed)
- Composables in `app/composables/` are auto-imported (no manual `import` needed)
- Types in `shared/types/` must be explicitly imported where needed
- Server routes in `server/` are auto-generated as API endpoints

### Why This Structure?
- **app/** — Encapsulates all UI logic and presentation
- **shared/** — Types and utilities available to both client and server
- **server/** — Separates server concerns (ready for future API routes, auth, etc.)
- **public/** — Static assets with optimized serving
- Follows Nuxt 4 best practices and conventions
- Scales well as the app grows

---

## 2. TypeScript Interface Design

### Task Interface (`shared/types/task.ts`)
```typescript
export interface Task {
  id: string;              // Unique identifier (UUID or timestamp-based)
  title: string;           // Task text content
  completed: boolean;      // Completion status
  createdAt: number;       // Timestamp for ordering/debugging
}
```

### Design Rationale
- **id**: Ensures stable React/Vue key binding and simplifies removal logic
- **title**: Plain text; no HTML to prevent XSS and keep it simple
- **completed**: Boolean flag for toggle and strikethrough styling
- **createdAt**: Useful for sorting tasks chronologically (new → old or old → new)

---

## 3. Composable: `useTasks()` Design

### Core Responsibilities
The composable will manage:
1. **State** — Array of tasks, reactive updates
2. **Actions** — Add, delete, toggle, edit (future)
3. **Persistence** — Load from LocalStorage on mount, save after mutations
4. **Initialization** — Hydrate state safely (handle missing LocalStorage)

### Function Signatures
```typescript
// In app/composables/useTasks.ts

export function useTasks() {
  // State
  const tasks = useState<Task[]>('tasks', () => [])
  const isHydrated = useState<boolean>('isHydrated', () => false)
  
  // Actions
  const addTask = (title: string): void
  const deleteTask = (id: string): void
  const toggleTask = (id: string): void
  const saveTasks = (): void                    // Persist to LocalStorage
  const loadTasks = (): void                    // Load from LocalStorage
  const initializeTasks = (): void              // Hydration on client mount
  
  // Computed
  const completedCount = computed(() => ...)   // Count of completed tasks
  const totalCount = computed(() => ...)       // Total task count
  const isEmpty = computed(() => ...)          // Boolean for empty state
  
  return {
    tasks,
    isHydrated,
    addTask,
    deleteTask,
    toggleTask,
    saveTasks,
    loadTasks,
    initializeTasks,
    completedCount,
    totalCount,
    isEmpty,
  }
}
```

### Implementation Details

#### Hydration Strategy
- On component mount (client-side only), load tasks from LocalStorage
- Use `isHydrated` flag to prevent mismatches between server & client renders
- Delay rendering task list until `isHydrated === true` (avoid flicker)

#### ID Generation
- Use `crypto.randomUUID()` for production (modern browsers)
- Fallback: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

#### Persistence Logic
- After every mutation (add/delete/toggle), call `saveTasks()`
- Save to `localStorage.setItem('nuxt-tasks', JSON.stringify(tasks.value))`
- On load, safely parse and validate before restoring

#### Error Handling
- Try-catch around localStorage operations (quota exceeded, disabled localStorage)
- Gracefully degrade: if localStorage fails, tasks live in memory only
- Log errors to console for debugging

---

## 4. UI Component Design

### Component Tree
```
app.vue
├── TaskInput (input + add button)
├── TaskList (list wrapper)
│   └── TaskItem (repeating, one per task)
├── EmptyState (conditional: shown if tasks.isEmpty)
└── Stats (optional: shows "X/Y tasks completed")
```

### Component Breakdown

#### 1. **TaskInput.vue**
- **Props**: None (uses composable)
- **Emits**: None (directly calls `addTask` from composable)
- **Behavior**:
  - Text input field (placeholder: "Add a new task...")
  - "Add" button (disabled if input is empty/whitespace-only)
  - On Enter key or button click → addTask + clear input
  - Optimistic UI: input clears immediately on submit

#### 2. **TaskList.vue**
- **Props**: `tasks: Task[]`
- **Behavior**:
  - Renders `TaskItem` for each task (key by `task.id`)
  - Conditionally shows `EmptyState` if no tasks
  - Optional: Sort tasks (completed tasks at bottom, or customizable)

#### 3. **TaskItem.vue**
- **Props**: `task: Task`
- **Behavior**:
  - Checkbox (bound to task.completed)
  - Task text with conditional strikethrough (if completed)
  - Delete button (icon or text, e.g., "×" or "Delete")
  - On checkbox change → `toggleTask(task.id)`
  - On delete click → `deleteTask(task.id)` with optional confirmation

#### 4. **EmptyState.vue**
- **Props**: None
- **Behavior**:
  - Centered, friendly message: "No tasks yet. Add one to get started!"
  - Optional icon (e.g., checkmark emoji or SVG)
  - Light gray text for secondary importance

#### 5. **app.vue** (Root)
- **Purpose**: Orchestrate the app, handle hydration
- **Behavior**:
  - Call `initializeTasks()` on mounted (client-side)
  - Wait for `isHydrated` before rendering list
  - Render header, TaskInput, TaskList, optional stats
  - Use Tailwind for outer layout (container, spacing, colors)

---

## 5. Styling Strategy (Tailwind CSS)

### Design Principles
- **Minimal, clean aesthetic** — Focus on usability
- **Color scheme**: Neutral grays + accent (blue/green for actions)
- **Spacing**: Consistent padding/margins (Tailwind's scale: 4px increments)
- **Typography**: Simple sans-serif, readable sizes

### Key Classes to Use
- **Layout**: `container mx-auto py-8 px-4`
- **Input**: `border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`
- **Button**: `bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`
- **Task item**: `flex items-center gap-3 p-3 border-b hover:bg-gray-50 transition`
- **Strikethrough**: `line-through text-gray-400` (on completed tasks)
- **Delete button**: `text-red-500 hover:text-red-700 cursor-pointer`

### Responsive Design
- Mobile-first approach (full width on mobile, max-width container on desktop)
- Ensure touch targets are ≥44px (accessibility)
- Test on mobile devices before shipping

---

## 6. LocalStorage Persistence Strategy

### Storage Key
- **Key**: `"nuxt-tasks-v0.1.0"` (versioned to allow migrations)
- **Format**: JSON array of Task objects

### Persistence Flow
```
1. Component mounts
   ↓
2. Check if browser (typeof window !== 'undefined')
   ↓
3. Load from localStorage (key: "nuxt-tasks-v0.1.0")
   ↓
4. Validate JSON + type-check Task objects
   ↓
5. Set `tasks.value` and `isHydrated.value = true`
   ↓
6. Component renders with hydrated data
```

### Save Triggers
- After `addTask()`
- After `deleteTask()`
- After `toggleTask()`
- (Optional) Debounce saves if edits become frequent

### Fallback Behavior
- If localStorage is unavailable (quota, disabled, private mode):
  - Keep tasks in memory (will be lost on refresh)
  - Show optional warning toast/banner
  - Continue functioning normally

---

## 7. Development & Testing Strategy

### Local Development
```bash
npm install
npm run dev          # Start dev server (http://localhost:3000)
```

### Manual Testing Checklist
- [ ] Add task → appears in list
- [ ] Refresh page → tasks persist
- [ ] Toggle checkbox → task marked complete + strikethrough applied
- [ ] Delete task → task removed from list
- [ ] Empty state → shown when no tasks
- [ ] Input validation → "Add" button disabled if input empty
- [ ] Mobile responsiveness → test on mobile browser or DevTools

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- localStorage available (tested in private mode)
- No IE11 support (Nuxt 4 targets modern JS)

---

## 8. Performance Optimizations

### Built-in by Nuxt 4
- Automatic code splitting
- Hydration (SSR-friendly, though this app is client-heavy)
- Auto-import of components & composables (no manual imports needed)

### Custom Optimizations
- **Lazy render EmptyState**: Only render when `tasks.isEmpty`
- **Key binding**: Use `task.id` (not index) to avoid list reordering bugs
- **Computed properties**: Use `completedCount`, `totalCount` to avoid recalculating on every render

---

## 9. Future Enhancements (Out of Scope)

- [ ] Edit task inline
- [ ] Task categories or tags
- [ ] Due dates
- [ ] Recurring tasks
- [ ] Sync across tabs (BroadcastChannel API)
- [ ] Dark mode toggle
- [ ] Drag-and-drop reordering
- [ ] Cloud sync (Dropbox, iCloud, Google Drive)
- [ ] PWA / offline mode

---

## 10. Implementation Roadmap

### Phase 1: Setup
1. Create Nuxt 4 project with TypeScript
2. Install & configure Tailwind CSS
3. Create `shared/types/task.ts` interface
4. Set up folder structure (app/, server/, shared/, public/, modules/)

### Phase 2: Core Logic
1. Implement `app/composables/useTasks.ts` (state + actions + localStorage)
2. Test hydration and persistence

### Phase 3: Components
1. Build `TaskInput.vue`
2. Build `TaskItem.vue`
3. Build `TaskList.vue`
4. Build `EmptyState.vue`
5. Wire everything into `app.vue`

### Phase 4: Styling & Polish
1. Apply Tailwind classes
2. Test responsive design
3. Refine accessibility (focus states, ARIA labels)
4. Test on mobile

### Phase 5: Verification & Deployment
1. Manual testing checklist
2. Build for production (`npm run build`)
3. Deploy to Vercel (`vercel deploy`)
4. Smoke test in production

---

## 11. Key Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| `useState()` instead of Pinia | Nuxt native, simpler for small apps, no boilerplate |
| LocalStorage instead of IndexedDB | Simple, sufficient for task list, no querying needed |
| Client-side hydration with flag | Prevents SSR mismatch; safe on Nuxt 4 |
| Tailwind CSS | Fast styling, consistent design, no CSS-in-JS overhead |
| Composition API | Modern Vue 3, better code organization, tree-shakeable |
| TypeScript | Type safety, better DX, prevents bugs |

---

## Summary

This plan establishes a **simple, performant, and maintainable** Nuxt 4 task application. The composable pattern centralizes state logic, Tailwind ensures consistent styling, and LocalStorage provides persistence without backend complexity. The component structure is modular and easy to extend with future features.

Ready to implement when you give the signal!

