<template>
  <div :class="{ 'dark-mode': darkMode }" class="app-container">
    <!-- Sidebar: sempre presente, só muda largura -->
    <aside
      :class="['sidebar', { collapsed: !sidebarVisible }]"
      @click.self="isMobile && (sidebarVisible = false)"
    >
      <div class="sidebar-header">
        <!-- Botão hamburguer: só quando a sidebar ESTIVER fechada -->
        <button
          v-show="!sidebarVisible"
          @click.stop="toggleSidebar"
          class="hamburger-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon hamburger" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Título e toggle dark mode (só quando aberta) -->
        <h1 v-show="sidebarVisible" class="sidebar-title">BIG BEG AVIARAS</h1>
        <button v-show="sidebarVisible" @click="toggleDarkMode" class="toggle-btn">
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

      <!-- Navegação (só quando aberta) -->
      <nav v-show="sidebarVisible" class="sidebar-nav">
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

    <!-- Overlay só em mobile com sidebar aberta -->
    <div 
      v-if="sidebarVisible && isMobile" 
      class="overlay" 
      @click="sidebarVisible = false"
    ></div>

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
      if (!this.isMobile) this.sidebarVisible = true
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
  }
}
</script>

<style scoped>
:root, html, body {
  height: 100%;
  margin: 0;
}

.app-container {
  display: flex;
}

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
  transition: width 0.3s ease, padding 0.3s ease;
  z-index: 40;
}

.sidebar.collapsed {
  width: 48px;
  padding: 0.5rem;
}

.dark-mode .sidebar {
  background-color: #1f2937;
  color: #f9fafb;
  border-color: #374151;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.toggle-btn,
.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}
.icon.hamburger {
  width: 2rem;
  height: 2rem;
}
.sun { color: #facc15; }
.moon { color: #4b5563; }

.sidebar-nav {
  margin-top: 2rem;
  flex: 1;
}
.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.4);
  z-index: 30;
}

.main-content {
  margin-left: 260px;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.sidebar.collapsed ~ .main-content {
  margin-left: 48px;
}

@media (max-width: 1024px) {
  .hamburger-btn {
    display: block;
  }
  .main-content {
    margin-left: 0;
  }
}
</style>
