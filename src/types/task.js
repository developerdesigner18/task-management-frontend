export const FilterType = {
  ALL: 'all',
  PENDING: 'pending',
  COMPLETED: 'completed'
}

// Convert API task to local format
export const apiTaskToLocal = (apiTask) => ({
  id: apiTask.id,
  title: apiTask.title,
  description: apiTask.description || '',
  completed: apiTask.completed || false,
  order: apiTask.order || 0,
  createdAt: new Date(apiTask.created_at),
  updatedAt: new Date(apiTask.updated_at)
})

// Convert task to API format for CREATE
export const taskToCreateFormat = (task) => ({
  title: task.title,
  description: task.description || null
})

// Convert task to API format for UPDATE
export const taskToUpdateFormat = (task) => {
  const updateData = {}
  
  if (task.title !== undefined) updateData.title = task.title
  if (task.description !== undefined) updateData.description = task.description || null
  if (task.completed !== undefined) updateData.completed = task.completed
  
  return updateData
}

// Convert tasks to API format for REORDER
export const tasksToReorderFormat = (tasks) => ({
  tasks: tasks.map((task, index) => ({
    id: task.id,
    order: index + 1
  }))
})
