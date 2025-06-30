<template>
  <div class="container">

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
          <button @click="handleFilter" class="button">Filtrar</button>
        </div>
      </header>

      <section class="table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Dias</th>
              <th>Débitos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id_user">
              <td>{{ formatDate(user.dateBirth) }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.days || '-' }}</td>
              <td class="debits-cell">
                <span>{{ user.debts }}</span>
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  alt="Avatar"
                  class="avatar"
                />
              </td>
            </tr>
          </tbody>
        </table>
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
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchName) return this.users
      return this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchName.toLowerCase())
      )
    },
  },
  methods: {
    handleFilter() {
      // filtro reativo via computed
    },
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
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleDateString('pt-BR')
    },
  },
  mounted() {
    this.fetchUsers()
  },
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  color: #333;
  background-color: #f5f5f5;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #ddd;
  padding: 20px;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.header-search {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-search h1 {
  margin: 0;
  font-size: 1.8rem;
}

.search-controls {
  display: flex;
  gap: 10px;
}

.input-field {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  max-width: 200px;
}

.button {
  padding: 8px 16px;
  background-color: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #1565c0;
}

.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table thead th {
  background-color: #fafafa;
  font-weight: bold;
  font-size: 0.95rem;
}

.users-table tbody tr:hover {
  background-color: #f0f0f0;
}

.debits-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
}
</style>
