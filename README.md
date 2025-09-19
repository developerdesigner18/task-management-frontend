# Vue 3 Task Management App

A modern task management application built with Vue 3, featuring:

- ✨ **Smooth animations** using @vueuse/motion
- 🎨 **Beautiful UI** with Tailwind CSS
- 📱 **Responsive design** that works on all devices
- 🔄 **Drag & drop** task reordering with @vueuse/integrations
- 🌐 **API integration** with Laravel backend
- 🔍 **Search and filtering** capabilities
- ⚡ **Vue 3 Composition API** for optimal performance
- 🔔 **Toast notifications** for user feedback

## Features

- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Search through tasks with debouncing
- Filter by status (all, pending, completed)
- Drag and drop to reorder tasks
- Smooth animations and transitions
- Real-time API synchronization
- Loading states and error handling
- Toast notifications for all actions

## Technologies Used

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **@vueuse/motion** - Vue motion library for animations
- **@vueuse/integrations** - Sortable.js integration for drag & drop
- **@vueuse/core** - Vue composition utilities (useDebounceFn)
- **Axios** - HTTP client for API requests
- **vue-toastification** - Toast notification system
- **lucide-vue-next** - Beautiful icons
- **Laravel API** - Backend API for data persistence

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Laravel API backend running

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-vue-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your API URL in `.env`:
```env
VITE_API_BASE_URL=http://your-laravel-api-url.com/api
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to the provided local URL (usually `http://localhost:5173`)

### Dependencies

The project uses the following main dependencies:

```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.0",
  "axios": "^1.6.0",
  "vue-toastification": "^2.0.0",
  "@vueuse/core": "^10.7.0",
  "@vueuse/integrations": "^10.7.0",
  "@vueuse/motion": "^2.0.0",
  "lucide-vue-next": "^0.294.0",
  "tailwindcss": "^3.4.0"
}
```

## Project Structure

```
src/
├── components/
│   ├── TaskManager.vue      # Main task management component
│   ├── TaskModal.vue        # Create/edit task modal
│   └── DeleteConfirmation.vue # Delete confirmation modal
├── composables/
│   └── useTasks.js          # Task management composable with API integration
├── services/
│   ├── apiService.js        # Axios instance configuration
│   └── taskApiService.js    # Task-specific API methods
├── types/
│   └── task.js              # Task-related types and utilities
├── App.vue                  # Root component
├── main.js                  # Application entry point
└── style.css               # Global styles and CSS variables
```

## API Integration

The application integrates with a Laravel backend API with the following endpoints:

- `GET /tasks` - Get all tasks with filtering and search
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get a specific task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `PATCH /tasks/reorder` - Reorder tasks
- `PATCH /tasks/{id}/complete` - Toggle task completion

## Environment Setup

1. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://your-laravel-api-url.com/api
```

2. Make sure your Laravel API is running and accessible

## Key Features Explained

### Drag & Drop Reordering
- Uses `@vueuse/integrations` with Sortable.js
- Smooth animations and visual feedback
- Real-time API synchronization after reordering
- Maintains order consistency across all operations

### Search & Filtering
- Debounced search to prevent excessive API calls
- Real-time filtering by task status
- Server-side filtering for better performance
- Instant UI updates with loading states

### API Integration
- Complete CRUD operations via Laravel API
- Error handling with user-friendly messages
- Loading states for all operations
- Toast notifications for success/error feedback

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive layouts for all screen sizes
- Touch-friendly drag and drop on mobile devices
- Consistent design system with CSS variables

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Development

### Code Structure
- **Composables**: Reusable logic in `useTasks.js`
- **Services**: API layer separation with `apiService.js` and `taskApiService.js`
- **Components**: Modular Vue components with clear responsibilities
- **Types**: Centralized type definitions and utility functions

### API Communication
- All data operations go through the API
- No local storage for task data
- Automatic data refresh after mutations
- Optimistic UI updates with error rollback
