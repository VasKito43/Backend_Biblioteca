<template>
  <div :class="{ 'dark-mode': darkMode }" class="app-container">
    <div class="sidebar">
      <Sidebar />
    </div>
    <main class="main-content">
      <header class="header-search">
        <h1>Usuários</h1>
        <div class="search-controls">
          <input
            type="text"
            placeholder="Buscar por nome"
            v-model="searchName"
            class="input-field"
          />
          <router-link to="/users/create" class="button">
            Cadastrar
          </router-link>
        </div>
      </header>

      <!-- Cards de Usuários -->
      <section class="cards-wrapper">
        <div
          class="user-card"
          v-for="user in filteredUsers"
          :key="user.id_user"
        >
          <div class="card-row">
            <span class="label">Data:</span>
            <span class="value">{{ formatDate(user.dateBirth) }}</span>
          </div>
          <div class="card-row">
            <span class="label">Nome:</span>
            <span class="value">{{ user.name }}</span>
          </div>
          <div class="card-row">
            <span class="label">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="card-row">
            <span class="label">Telefone:</span>
            <span class="value">{{ user.phone }}</span>
          </div>
          <div class="card-row">
            <span class="label">Dias:</span>
            <span class="value">{{ user.days || '-' }}</span>
          </div>
          <div class="card-row debits-row">
            <span class="label">Débitos:</span>
            <span class="value">{{ user.debts }}</span>
            <img
              v-if="user.avatar"
              :src="user.avatar"
              alt="Avatar"
              class="avatar"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../Sidebar.vue'

export default {
  name: 'UsersPage',
  components: { Sidebar },
  data() {
    return {
      searchName: '',
      users: [],
      darkMode: localStorage.getItem('darkMode') === 'true'
    }
  },
  computed: {
    filteredUsers() {
      return this.searchName
        ? this.users.filter(user =>
            user.name.toLowerCase().includes(this.searchName.toLowerCase())
          )
        : this.users
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await fetch('/api/users')
        if (!res.ok) throw new Error('Falha ao carregar usuários')
        const raw = await res.json()
        this.users = raw.map(u => ({
          id_user:   u.id_user,
          name:      u.nome,
          dateBirth: u.datebirth,
          email:     u.email,
          phone:     u.phone,
          debts:     u.debts,
          avatar:    u.linkImg,
          days:      u.days || null
        }))
      } catch (err) {
        console.error('Erro ao buscar usuários:', err)
      }
    },
    formatDate(dateStr) {
      return dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '-'
    }
  },
  mounted() {
    this.fetchUsers()
    document.body.classList.toggle('dark-mode', this.darkMode)
  },
  watch: {
    darkMode(val) {
      localStorage.setItem('darkMode', val)
      document.body.classList.toggle('dark-mode', val)
    }
  }
}
</script>

<style scoped>
:root, html, body {
  height: 100%; margin: 0;
}
.app-container, .container {
  display: flex;
  min-height: 100vh;
}
/* .sidebar {
  background: var(--sidebar-bg, #ffffff);
  border-right: 1px solid var(--border-color, #ddd);
  padding: 20px;
} */
.main-content {
  flex: 1;
  padding: 20px;
  margin-left: 240px;
  background: var(--bg-color, #f5f5f5);
  overflow-y: auto;
  transition: background 0.3s;
}
.header-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header-search h1 {
  font-size: 1.8rem;
  color: var(--text-color, #111827);
}
.search-controls {
  display: flex;
  align-items: center;
}
.input-field {
  margin-right: 16px;
  padding: 8px 12px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  background: var(--input-bg, #ffffff);
  color: var(--text-color, #111827);
}
.button {
  padding: 8px 16px;
  background: #1976d2;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.button:hover {
  background: #1565c0;
}
body.dark-mode .button {
  background: #2563eb;
}
body.dark-mode .button:hover {
  background: #1e40af;
}
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20vw, 1fr));
  gap: 16px;
}
.user-card {
  background: var(--card-bg, #ffffff);
  color: var(--text-color, #111827);
  border: 1px solid var(--border-color, #ddd);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card-row {
  display: flex;
  justify-content: space-between;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
/* Dark mode overrides */
.dark-mode .sidebar {
  background: #111827;
  border-color: #4b5563;
}
.dark-mode .main-content {
  background: #1f2937;
}
.dark-mode .header-search h1,
.dark-mode .search-controls .input-field,
.dark-mode .user-card {
  color: #f9fafb;
}
.dark-mode .input-field {
  background: #374151;
  border-color: #4b5563;
}
.dark-mode .user-card {
  background: #374151;
  border-color: #4b5563;
}
</style>
