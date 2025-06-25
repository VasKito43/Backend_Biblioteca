<template>
  <div :class="{ 'dark-mode': darkMode }" class="app-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">BIG BEG AVIARAS</h1>
        <button @click="toggleDarkMode" class="toggle-btn">
          <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" class="icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12h-1m12.02-5.02l-.7.7M6.04 17.96l-.7.7m12.02 0l-.7-.7M6.04 6.04l-.7-.7M12 5a7 7 0 000 14 7 7 0 000-14z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon moon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          </svg>
        </button>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li><button @click="$router.push('/books')" class="nav-btn">Books</button></li>
          <li><button @click="$router.push('/users')" class="nav-btn">Users</button></li>
          <li><button @click="$router.push('/borrowing')" class="nav-btn">Borrowing</button></li>
          <li><button @click="$router.push('/borrowing/create')" class="nav-btn">Novo Empréstimo</button></li>
          <li><button @click="$router.push('/borrowings/pay')" class="nav-btn">Pagar Empréstimos</button></li>
          <li class="logout-item"><button @click="logout" class="nav-btn">Sair</button></li>
        </ul>
      </nav>
    </aside>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return { darkMode: false }
  },
  created() {
    const saved = localStorage.getItem('darkMode')
    this.darkMode = saved !== null
      ? saved === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', this.darkMode)
    },
    logout() {
      localStorage.removeItem('isAuthenticated')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}
.dark-mode {
  background-color: #111827;
  color: #f9fafb;
}

.sidebar {
  width: 260px;
  background-color: #ffffff;
  color: #1f2937;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.dark-mode .sidebar {
  background-color: #1f2937;
  color: #f9fafb;
  border-color: #374151;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.sidebar-title {
  font-size: 1.25rem;
  font-weight: bold;
}
.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
}
.icon {
  width: 1.5rem;
  height: 1.5rem;
}
.sun {
  color: #facc15;
}
.moon {
  color: #4b5563;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.nav-btn {
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: inherit;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}
.nav-btn:hover {
  background-color: #f3f4f6;
}
.dark-mode .nav-btn:hover {
  background-color: #374151;
}

/* Push logout button to bottom */
.logout-item {
  margin-top: 60vh;
}
</style>
