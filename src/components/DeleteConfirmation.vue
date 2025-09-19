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
          <!-- Content -->
          <div class="p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle class="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-foreground">Delete Task</h2>
                <p class="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div class="mb-6">
              <p class="text-foreground">
                Are you sure you want to delete 
                <span class="font-medium">"{{ taskTitle }}"</span>?
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3">
             <!-- Cancel -->
              <button
                @click="$emit('close')"
                class="px-4 py-2 border border-input rounded-md bg-background text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>

              <!-- Delete -->
              <button
                v-motion
                :hover="{ scale: 1.02 }"
                :tap="{ scale: 0.98 }"
                @click="$emit('confirm')"
                ref="deleteButton"
                class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  taskTitle: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const deleteButton = ref(null)

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'Enter') {
    emit('confirm')
  }
}

// Focus delete button when modal opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    if (deleteButton.value) {
      deleteButton.value.focus()
    }
  }
})
</script>
