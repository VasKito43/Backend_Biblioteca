<template>
  <div :class="{ 'dark-mode': darkMode }" class="min-h-screen flex">
    <aside class="sidebar">
      <div class="header">
        <h1>BIG BEG AVIARAS</h1>
        <button @click="toggleDarkMode" class="toggle-btn">
          <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <!-- Sun icon -->
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12h-1m12.02-5.02l-.7.7M6.04 17.96l-.7.7m12.02 0l-.7-.7M6.04 6.04l-.7-.7M12 5a7 7 0 000 14 7 7 0 000-14z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <!-- Moon icon -->
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          </svg>
        </button>

      </div>
      <nav>
        <ul>
          <li>
            <button @click="$router.push('/books')" class="nav-btn">Books</button>
          </li>
          <li>
            <button @click="$router.push('/users')" class="nav-btn">Users</button>
          </li>
          <li>
            <button @click="$router.push('/borrowing')" class="nav-btn">Borrowing</button>
          </li>
        </ul>
      </nav>

    </aside>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      darkMode: false
    }
  },
  created() {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      this.darkMode = saved === 'true'
    } else {
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', this.darkMode)
    }
  }
}
</script>

<style>
/* Estilos gerais */
body {
  margin: 0;
  font-family: sans-serif;
}

.sidebar {
  width: 260px;
  background-color: #ffffff;
  color: #000000;
  border-right: 1px solid #e5e7eb;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

/* Dark mode */
.dark-mode .sidebar {
  background-color: #1f2937;
  color: #ffffff;
  border-color: #374151;
}

.dark-mode {
  background-color: white;
  color: #ffffff;
}

.dark-mode a {
  color: #ffffff;
}

/* Links */
a {
  display: block;
  padding: 0.5rem 0;
  text-decoration: none;
  color: #1f2937;
}

a:hover {
  text-decoration: underline;
}

.dark-mode a:hover {
  text-decoration: underline;
}
.nav-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: inherit;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-btn:hover {
  background-color: #f3f4f6; /* cinza claro */
  border-radius: 5px;
}

.dark-mode .nav-btn:hover {
  background-color: #374151; /* cinza escuro */
}

</style>
