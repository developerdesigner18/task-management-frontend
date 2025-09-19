import apiService from './apiService.js'

class TaskApiService {
  // Get all tasks with optional filtering
  async getTasks(params = {}) {
    return await apiService.get('/tasks', params)
  }

  // Get single task by ID
  async getTask(id) {
    return await apiService.get(`/tasks/${id}`)
  }

  // Create new task
  async createTask(taskData) {
    return await apiService.post('/tasks', taskData)
  }

  // Update existing task
  async updateTask(id, taskData) {
    return await apiService.put(`/tasks/${id}`, taskData)
  }

  // Delete task
  async deleteTask(id) {
    return await apiService.delete(`/tasks/${id}`)
  }

  // Reorder tasks
  async reorderTasks(tasks) {
    return await apiService.patch('/tasks/reorder', { tasks })
  }

  // Complete task
  async completeTask(id, completed = true) {
    return await apiService.patch(`/tasks/${id}/complete`, { completed })
  }
}

// Create and export singleton instance
const taskApiService = new TaskApiService()
export default taskApiService
