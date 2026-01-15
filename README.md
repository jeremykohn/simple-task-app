# Simple Task App

A simple task management application built with **Nuxt 4**, **Vue 3**, **TypeScript**, and **Tailwind CSS**.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

Run the development server with hot module reloading:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Generate Static Site

```bash
npm run generate
```

## Testing

Run the test suite with **Vitest**:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
simple-task-app/
├── app/
│   ├── app.vue              # Root component
│   ├── components/          # Reusable Vue components
│   │   ├── EmptyState.vue
│   │   ├── TaskInput.vue
│   │   ├── TaskItem.vue
│   │   ├── TaskList.vue
│   │   └── *.test.ts        # Component tests
│   ├── composables/         # Vue composables (reusable logic)
│   │   ├── useTasks.ts      # Task management composable
│   │   └── useTasks.test.ts
│   └── layouts/             # Layout components
├── public/                  # Static assets
├── server/                  # Nitro server configuration (if needed)
├── shared/
│   └── types/
│       └── task.ts          # TypeScript type definitions
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest configuration
└── package.json             # Dependencies and scripts
```

## Key Dependencies

- **Nuxt 4**: Full-stack Vue framework
- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vitest**: Unit testing framework
- **@vue/test-utils**: Vue component testing utilities

## Configuration Files

- `nuxt.config.ts` - Main Nuxt configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options
- `vitest.config.ts` - Test runner configuration

## Notes for Contributors

- Prefer non-destructive changes: add small feature files or tests before larger refactors
- Run tests before committing: `npm test`
- Follow the existing component and composable patterns
- Use TypeScript for type safety
