<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50">
      <!-- Backdrop -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1 }"
        :leave="{ opacity: 0 }"
        class="fixed inset-0 bg-white/60 backdrop-blur-md"
        @click="$emit('close')"
      />

      <!-- Modal -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.95, y: 20 }"
          :enter="{ opacity: 1, scale: 1, y: 0 }"
          :leave="{ opacity: 0, scale: 0.95, y: 20 }"
          class="bg-card border border-border rounded-lg shadow-xl w-full max-w-md"
          @keydown="handleKeyDown"
          tabindex="-1"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-border">
            <h2 class="text-lg font-semibold text-foreground">
              {{ task ? 'Edit Task' : 'Create New Task' }}
            </h2>
            <button
              @click="$emit('close')"
              class="text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-md transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                id="title"
                v-model="title"
                type="text"
                placeholder="Enter task title..."
                :class="[
                  'w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
                  errors.title ? 'border-destructive' : 'border-input'
                ]"
                @input="clearError"
                ref="titleInput"
              />
              <p
                v-if="errors.title"
                v-motion
                :initial="{ opacity: 0, y: -10 }"
                :enter="{ opacity: 1, y: 0 }"
                class="text-sm text-destructive mt-1"
              >
                {{ errors.title }}
              </p>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                id="description"
                v-model="description"
                placeholder="Enter task description..."
                rows="4"
                class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button
              @click="$emit('close')"
              class="px-4 py-2 border border-input rounded-md bg-background text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleSave"
              class="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
            >
              {{ task ? 'Update Task' : 'Create Task' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

// Reactive state
const title = ref('')
const description = ref('')
const errors = ref({})
const titleInput = ref(null)

// Methods
const clearError = () => {
  if (errors.value.title) {
    errors.value = { ...errors.value, title: undefined }
  }
}

const handleSave = () => {
  const newErrors = {}

  if (!title.value.trim()) {
    newErrors.title = 'Title is required'
  }

  if (Object.keys(newErrors).length > 0) {
    errors.value = newErrors
    return
  }

  emit('save', {
    title: title.value.trim(),
    description: description.value.trim()
  })
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    handleSave()
  }
}

// Watch for modal open/close and task changes
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    // Reset form when opening
    title.value = props.task?.title || ''
    description.value = props.task?.description || ''
    errors.value = {}
    
    // Focus title input
    await nextTick()
    if (titleInput.value) {
      titleInput.value.focus()
    }
  }
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    title.value = newTask.title
    description.value = newTask.description
  } else {
    title.value = ''
    description.value = ''
  }
  errors.value = {}
})
</script>
