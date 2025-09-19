# Vue 3 Task Management App

A modern task management application built with Vue 3, featuring:

- ✨ **Framer Motion animations** using @vueuse/motion
- 🎨 **Beautiful UI** with Tailwind CSS
- 📱 **Responsive design** that works on all devices
- 🔄 **Drag & drop** task reordering
- 💾 **Local storage** persistence
- 🔍 **Search and filtering** capabilities
- ⚡ **Vue 3 Composition API** for optimal performance

## Features

- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Search through tasks
- Filter by status (all, pending, completed)
- Drag and drop to reorder tasks
- Smooth animations and transitions
- Persistent storage using localStorage

## Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **@vueuse/motion** - Vue motion library (Framer Motion equivalent)
- **vuedraggable** - Drag and drop functionality
- **lucide-vue-next** - Beautiful icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the provided local URL

## Project Structure

```
src/
├── components/
│   ├── TaskManager.vue      # Main task management component
│   ├── TaskModal.vue        # Create/edit task modal
│   └── DeleteConfirmation.vue # Delete confirmation modal
├── types/
│   └── task.js              # Task-related types and utilities
├── App.vue                  # Root component
├── main.js                  # Application entry point
└── style.css               # Global styles and CSS variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
