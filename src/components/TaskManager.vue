<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="border-b border-border bg-card">
      <div class="max-w-6xl mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Task Management</h1>
            <p class="text-muted-foreground mt-1">Organize and track your tasks efficiently</p>
          </div>
          <button 
            @click="openModal"
            class="bg-black text-white hover:bg-black/90 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus class="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-8">
      <!-- Filters and Search -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <div class="flex gap-2">
          <button
            v-for="filterType in filterTypes"
            :key="filterType"
            @click="setFilter(filterType)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === filterType
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            v-motion
            :initial="{ scale: 1 }"
            :hover="{ scale: 1.02 }"
            :tap="{ scale: 0.98 }"
          >
            {{ filterType.charAt(0).toUpperCase() + filterType.slice(1) }}
          </button>
        </div>

        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search tasks..."
            class="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-3">
        <!-- Skeleton Loaders -->
        <div v-for="n in 3" :key="n" class="bg-card border border-border rounded-lg p-4 animate-pulse">
          <div class="flex items-start gap-4">
            <div class="mt-1">
              <div class="w-4 h-4 bg-muted rounded"></div>
            </div>
            <div class="mt-1">
              <div class="w-5 h-5 bg-muted rounded-full"></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="h-5 bg-muted rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div class="h-3 bg-muted rounded w-1/4"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-muted rounded"></div>
              <div class="w-8 h-8 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task List -->
      <div v-else ref="sortableContainer" class="space-y-3">
        <div
          v-for="(task, index) in filteredTasks"
          :key="task.id"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
          :leave="{ opacity: 0, y: -20, scale: 0.95 }"
          class="bg-card border border-border rounded-lg p-4 transition-all hover:border-primary/50 group"
        >
          <div class="flex items-start gap-4">
            <div class="mt-1 cursor-grab active:cursor-grabbing drag-handle">
              <GripVertical class="w-4 h-4 text-muted-foreground" />
            </div>

            <button
              @click="handleToggleTask(task.id)"
              :disabled="loadingTasks.has(task.id)"
              class="mt-1 transition-colors hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="loadingTasks.has(task.id)" class="w-5 h-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <CheckCircle2 v-else-if="task.completed" class="w-5 h-5 text-success" />
              <Circle v-else class="w-5 h-5 text-muted-foreground" />
            </button>

            <div class="flex-1 min-w-0">
              <h3
                :class="[
                  'font-medium transition-all',
                  task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                ]"
                v-motion
                :animate="{ opacity: task.completed ? 0.6 : 1 }"
              >
                {{ task.title }}
              </h3>
              <p
                v-if="task.description"
                :class="[
                  'text-sm mt-1 transition-all',
                  task.completed ? 'line-through text-muted-foreground/60' : 'text-muted-foreground'
                ]"
              >
                {{ task.description }}
              </p>
              <div class="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Created {{ formatDate(task.createdAt) }}</span>
                <span v-if="task.updatedAt.getTime() !== task.createdAt.getTime()">
                  Updated {{ formatDate(task.updatedAt) }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="editTask(task)"
                :disabled="loadingTasks.has(task.id)"
                class="p-2 hover:bg-accent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="setDeletingTask(task)"
                :disabled="loadingTasks.has(task.id)"
                class="p-2 hover:bg-accent rounded-md transition-colors text-destructive hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!isLoading && filteredTasks.length === 0"
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1 }"
        class="text-center py-12"
      >
        <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 class="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-medium text-foreground mb-2">
          {{ getEmptyStateTitle() }}
        </h3>
        <p class="text-muted-foreground mb-6">
          {{ getEmptyStateDescription() }}
        </p>
        <button
          v-if="!searchQuery && filter === 'all'"
          @click="openModal"
          class="bg-black text-white hover:bg-black/90 px-4 py-2 rounded-md flex items-center gap-2 transition-colors mx-auto"
        >
          <Plus class="w-4 h-4" />
          Create Task
        </button>
      </div>
    </div>

    <!-- Modals -->
    <TaskModal
      :is-open="isModalOpen"
      :task="editingTask"
      @close="closeModal"
      @save="handleSave"
    />

    <DeleteConfirmation
      :is-open="!!deletingTask"
      :task-title="deletingTask?.title || ''"
      @close="setDeletingTask(null)"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  GripVertical 
} from 'lucide-vue-next'
import TaskModal from './TaskModal.vue'
import DeleteConfirmation from './DeleteConfirmation.vue'
import { useTasks } from '../composables/useTasks.js'

// Use tasks composable
const {
  tasks,
  isLoading,
  error,
  pendingTasks,
  completedTasks,
  totalTasks,
  loadTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks,
  searchTasks,
  debouncedSearch,
  filterTasksByStatus,
  refreshTasks,
  clearError
} = useTasks()

// Local state
const filter = ref('all')
const searchQuery = ref('')
const isModalOpen = ref(false)
const editingTask = ref(null)
const deletingTask = ref(null)
const loadingTasks = ref(new Set())

// Sortable container reference
const sortableContainer = ref(null)

const filterTypes = ['all', 'pending', 'completed']

// Computed properties
const filteredTasks = computed(() => tasks.value)

// Sortable integration
let sortableInstance = null

const initializeSortable = () => {
  if (sortableContainer.value && tasks.value.length > 0) {
    
    sortableInstance = useSortable(sortableContainer, tasks, {
      handle: '.drag-handle',
      animation: 200,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onStart: () => {
        
      },
      onUpdate: async (e) => {
        
        
        // Manually reorder the tasks array based on the drag operation
        const movedTask = tasks.value.splice(e.oldIndex, 1)[0]
        tasks.value.splice(e.newIndex, 0, movedTask)
        
        // Wait for the next tick to ensure the array is updated
        await nextTick()
        
        // Update the order property for each task based on its new position
        tasks.value.forEach((task, index) => {
          
          task.order = index + 1
        })
        
      
        try {
          // Call API to reorder tasks with the new order
          await reorderTasks(tasks.value)
        } catch (err) {
          console.error('Error reordering tasks:', err)
        }
      }
    })
  } else {
    console.log('Cannot initialize sortable:', {
      container: !!sortableContainer.value,
      tasksLength: tasks.value.length
    })
  }
}


// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const setFilter = async (filterType) => {
  filter.value = filterType
  
  try {
    if (filterType === 'all') {
      await loadTasks()
    } else if (filterType === 'completed') {
      await loadTasks({ status: 'completed' })
    } else if (filterType === 'pending') {
      await loadTasks({ status: 'pending' })
    }
  } catch (err) {
    console.error('Error filtering tasks:', err)
  }
}

const setDeletingTask = (task) => {
  deletingTask.value = task
}

const openModal = () => {
  editingTask.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingTask.value = null
}

const editTask = async (task) => {
  try {
    loadingTasks.value.add(task.id)
    // Get fresh task data from API
    const freshTask = await getTask(task.id)
    editingTask.value = freshTask
    isModalOpen.value = true
  } catch (err) {
    console.error('Error loading task for editing:', err)
    // Fallback to local task data if API fails
    editingTask.value = task
    isModalOpen.value = true
  } finally {
    loadingTasks.value.delete(task.id)
  }
}

const handleSave = async (taskData) => {
  try {
    if (editingTask.value) {
      // Update existing task
      await updateTask(editingTask.value.id, {
        title: taskData.title,
        description: taskData.description
      })
    } else {
      // Add new task
      await createTask({
        title: taskData.title,
        description: taskData.description
      })
    }
    closeModal()
  } catch (err) {
    console.error('Error saving task:', err)
  }
}

const handleToggleTask = async (id) => {
  try {
    loadingTasks.value.add(id)
    await toggleTask(id)
  } catch (err) {
    console.error('Error toggling task:', err)
  } finally {
    loadingTasks.value.delete(id)
  }
}

const confirmDelete = async () => {
  if (deletingTask.value) {
    try {
      await deleteTask(deletingTask.value.id)
      deletingTask.value = null
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }
}


const getEmptyStateTitle = () => {
  if (searchQuery.value) return 'No tasks found'
  if (filter.value === 'all') return 'No tasks yet'
  return `No ${filter.value} tasks`
}

const getEmptyStateDescription = () => {
  if (searchQuery.value) return 'Try adjusting your search terms'
  if (filter.value === 'all') return 'Create your first task to get started'
  return `You don't have any ${filter.value} tasks`
}

// Search functionality with debouncing
const handleSearch = () => {
  debouncedSearch(searchQuery.value)
}

// Watch for search query changes with debouncing
watch(searchQuery, (newQuery) => {
  if (newQuery.trim() === '') {
    loadTasks()
  } else {
    debouncedSearch(newQuery)
  }
})

// Initialize tasks from API on mount
onMounted(async () => {
  try {
    await loadTasks()
    // Initialize sortable after tasks are loaded
    await nextTick()
    initializeSortable()
  } catch (err) {
    console.error('Error loading tasks:', err)
  }
})

// Watch for tasks changes to reinitialize sortable
watch(tasks, () => {
  nextTick(() => {
    initializeSortable()
  })
}, { deep: true })
</script>
