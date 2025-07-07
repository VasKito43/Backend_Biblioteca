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
    handleFilter() {},
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
    },
  },
  mounted() {
    this.fetchUsers()
    // aplica classe dark-mode ao body
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
/* Força full height */
:root, html, body {
  height: 100%;
  margin: 0;
}

.container, .app-container {
  display: flex;
}

/* Container e sidebar */
.container {
  display: flex;
  min-height: 100vh;
  background: var(--bg-color);
}

.sidebar {
  width: 240px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  padding: 20px;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-width: 0;
  background: var(--bg-color);
}

.header-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-search h1 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-color);
}

.input-field {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  flex: 1;
  max-width: 200px;
  background: var(--input-bg);
  color: var(--text-color);
}

.button {
  padding: 8px 16px;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.button:hover {
  background: var(--primary-hover);
}

/* Grid de cards */
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.user-card {
  background: var(--card-bg);
  color: var(--text-color);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--border-color);
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-weight: 600;
}

.value {
  text-align: right;
  word-break: break-word;
}

.debits-row {
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

/* Dark mode variables */
:root {
  --bg-color: #f5f5f5;
  --sidebar-bg: #ffffff;
  --card-bg: #ffffff;
  --input-bg: #ffffff;
  --border-color: #ddd;
  --text-color: #111827;
  --primary-color: #1976d2;
  --primary-hover: #1565c0;
}

.dark-mode {
  --bg-color: #1f2937;
  --sidebar-bg: #111827;
  --card-bg: #374151;
  --input-bg: #374151;
  --border-color: #4b5563;
  --text-color: #f9fafb;
  --primary-color: #2563eb;
  --primary-hover: #1e40af;
}

/* Responsividade */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding: 10px 15px;
  }

  .main-content {
    padding: 15px 10px 30px;
  }

  .header-search {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .header-search h1 {
    font-size: 1.5rem;
  }

  .input-field {
    max-width: 100%;
  }

  .button {
    width: 100%;
    padding: 10px;
  }

  .user-card {
    padding: 12px;
  }
}
</style>
