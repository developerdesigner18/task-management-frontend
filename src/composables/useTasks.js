import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useDebounceFn } from '@vueuse/core'
import taskApiService from '../services/taskApiService.js'
import { 
  apiTaskToLocal,
  taskToCreateFormat,
  taskToUpdateFormat,
  tasksToReorderFormat
} from '../types/task.js'

export function useTasks() {
  // Toast notifications
  const toast = useToast()
  
  // Reactive state
  const tasks = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentParams = ref({}) // Store current filter/search params

  // Computed properties
  const pendingTasks = computed(() => tasks.value.filter(task => !task.completed))
  const completedTasks = computed(() => tasks.value.filter(task => task.completed))
  const totalTasks = computed(() => tasks.value.length)

  // Methods
  const setError = (err) => {
    error.value = err
    console.error('Task API Error:', err)
  }

  const clearError = () => {
    error.value = null
  }

  // Load tasks from API
  const loadTasks = async (params = {}) => {
    try {
      isLoading.value = true
      clearError()
      
      // Store current params for refresh
      currentParams.value = { ...params }
      
      const response = await taskApiService.getTasks(params)
      
      // Convert API tasks to local format
      tasks.value = response.data?.map(apiTaskToLocal) || []
      
      return tasks.value
    } catch (err) {
      setError(err)
      toast.error(err.message || 'Failed to load tasks')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Refresh tasks with current params
  const refreshTasks = async () => {
    return await loadTasks(currentParams.value)
  }

  // Get single task by ID
  const getTask = async (id) => {
    try {
      isLoading.value = true
      clearError()
      
      const response = await taskApiService.getTask(id)
      const task = apiTaskToLocal(response.data)
      
      // Update task in local array if it exists
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = task
      }
      
      return task
    } catch (err) {
      setError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Create new task
  const createTask = async (taskData) => {
    try {
      isLoading.value = true
      clearError()
      
      const apiData = taskToCreateFormat(taskData)
      const response = await taskApiService.createTask(apiData)
      
      // Show success message
      toast.success(response.message || 'Task created successfully')
      
      // Refresh tasks to get fresh data
      await refreshTasks()
      
      return tasks.value[0] // Return the first task (newly created)
    } catch (err) {
      setError(err)
      toast.error(err.message || 'Failed to create task')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update existing task
  const updateTask = async (id, taskData) => {
    try {
      isLoading.value = true
      clearError()
      
      const apiData = taskToUpdateFormat(taskData)
      const response = await taskApiService.updateTask(id, apiData)
      
      // Show success message
      toast.success(response.message || 'Task updated successfully')
      
      // Refresh tasks to get fresh data
      await refreshTasks()
      
      // Return the updated task
      return tasks.value.find(t => t.id === id)
    } catch (err) {
      setError(err)
      toast.error(err.message || 'Failed to update task')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete task
  const deleteTask = async (id) => {
    try {
      isLoading.value = true
      clearError()
      
      const response = await taskApiService.deleteTask(id)
      
      // Show success message
      toast.success(response.message || 'Task deleted successfully')
      
      // Refresh tasks to get fresh data
      await refreshTasks()
      
      return true
    } catch (err) {
      setError(err)
      toast.error(err.message || 'Failed to delete task')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Toggle task completion using complete API
  const toggleTask = async (id) => {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return

    const newCompleted = !task.completed
    
    try {
      isLoading.value = true
      clearError()
      
      const response = await taskApiService.completeTask(id, newCompleted)
      
      // Show success message
      toast.success(response.message || 'Task status updated successfully')
      
      // Refresh tasks to get fresh data
      await refreshTasks()
      
      // Return the updated task
      return tasks.value.find(t => t.id === id)
    } catch (err) {
      setError(err)
      toast.error(err.message || 'Failed to update task status')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Reorder tasks
  const reorderTasks = async (reorderedTasks) => {
    try {
      isLoading.value = true
      clearError()
      
      // Send to API with the reordered tasks
      const apiData = tasksToReorderFormat(reorderedTasks)
      const response = await taskApiService.reorderTasks(apiData.tasks)
      
      // Show success message
      toast.success(response.message || 'Tasks reordered successfully')
      
      // Refresh tasks to get fresh data
      await refreshTasks()
      
      return true
    } catch (err) {
      setError(err)
      toast.error(err.message || 'Failed to reorder tasks')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Search tasks
  const searchTasks = async (query) => {
    return await loadTasks({ search: query })
  }

  // Debounced search function
  const debouncedSearch = useDebounceFn(async (query) => {
    if (query.trim()) {
      await searchTasks(query.trim())
    } else {
      await loadTasks()
    }
  }, 500) // 500ms delay

  // Filter tasks by status
  const filterTasksByStatus = async (status) => {
    return await loadTasks({ status })
  }


  return {
    // State
    tasks,
    isLoading,
    error,
    
    // Computed
    pendingTasks,
    completedTasks,
    totalTasks,
    
    // Methods
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
  }
}