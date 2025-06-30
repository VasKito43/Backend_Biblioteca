<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  const darkMode = savedDarkMode === 'true' || (
    savedDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  if (darkMode) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
})
</script>



<style>
body.dark-mode {
  background-color: #111827;
  color: #f9fafb;
}

body.dark-mode .sidebar {
  background: #1f2937;
  color: #f9fafb;
}

body.dark-mode .main-content {
  background: #1f2937;
  color: #f9fafb;
}

body.dark-mode .users-table {
  background: #1f2937;
  color: #f9fafb;
}

body.dark-mode .users-table thead th {
  background: #374151;
}

body.dark-mode .users-table tbody tr:hover {
  background: #4b5563;
}
</style>

