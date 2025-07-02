<template>
  <RouterView />
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Ativa o dark-mode salvo ao abrir o app
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  const darkMode = savedDarkMode === 'true' ||
    (savedDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (darkMode) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
})

// Sempre que mudar de rota, se for login => remove dark-mode
watch(
  () => router.currentRoute.value.path,
  (path) => {
    if (path === '/login') {
      localStorage.removeItem('darkMode')
      document.body.classList.remove('dark-mode')
    }
  },
  { immediate: true } // já aplica na primeira carga também
)
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
  