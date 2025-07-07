<template>
  <div :class="{ 'dark-mode': darkMode }" class="app-container">
    <!-- Botão hamburguer para telas pequenas -->
    <button v-show="!sidebarVisible" @click="toggleSidebar" class="hamburger-btn">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon hamburger" viewBox="0 0 24 24" stroke="currentColor" fill="none">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div 
      v-if="sidebarVisible && isMobile" 
      class="overlay" 
      @click="sidebarVisible = false">
    </div>

    <!-- Sidebar -->
    <aside v-show="sidebarVisible" class="sidebar">
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

    <!-- Conteúdo principal -->
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
  return {
    darkMode: false,
    sidebarVisible: true,
    isMobile: window.innerWidth < 1024
  }
},
methods: {
  toggleDarkMode() {
    this.darkMode = !this.darkMode
    localStorage.setItem('darkMode', this.darkMode)
    document.body.classList.toggle('dark-mode', this.darkMode)
  },
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible
  },
  handleResize() {
    this.isMobile = window.innerWidth < 1024
    if (!this.isMobile) {
      this.sidebarVisible = true
    }
  },
  logout() {
    localStorage.removeItem('isAuthenticated')
    this.$router.push('/')
  }
},
created() {
  const saved = localStorage.getItem('darkMode')
  this.darkMode = saved !== null
    ? saved === 'true'
    : window.matchMedia('(prefers-color-scheme: dark)').matches

  document.body.classList.toggle('dark-mode', this.darkMode)

  this.isMobile = window.innerWidth < 1024
  if (this.isMobile) this.sidebarVisible = false

  window.addEventListener('resize', this.handleResize)
},
beforeUnmount() {
  window.removeEventListener('resize', this.handleResize)
}}

</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 30;
}


.app-container {
  display: flex;
  flex-direction: row;
}

/* Botão hamburguer */
.hamburger-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50;
  background: none;
  border: none;
  cursor: pointer;
  display: none;
}
.icon.hamburger {
  width: 2rem;
  height: 2rem;
  color: inherit;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background-color: #ffffff;
  color: #1f2937;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  z-index: 40;
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

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
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

.logout-item {
  margin-top: auto;
}

/* Conteúdo */
.main-content {
  margin-left: 260px;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 100vh;
}

/* Responsivo */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    width: 260px;
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .hamburger-btn {
    display: block;
  }
}
</style>
