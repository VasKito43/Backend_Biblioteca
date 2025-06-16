<template>
  <div class="container">
    <Sidebar />
    <main class="main-content">
      <div class="header-search">
        <h1>Usuários</h1>
        <div class="search-controls">
          <input
            type="text"
            placeholder="Nome Usuário"
            v-model="searchName"
            class="input-field"
          />
          <button @click="handleFilter" class="button">Filtrar</button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <!-- <th>Dias</th> -->
              <th>Débitos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id_user">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone || '-' }}</td>
              <!-- <td>{{ user.days || '-' }}</td> -->
              <td>{{ user.debts || '0' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
        user.nome.toLowerCase().includes(this.searchName.toLowerCase())
      )
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await fetch('/api/users')
        if (!res.ok) throw new Error('Falha ao carregar usuários')
        const data = await res.json()
        this.users = data
      } catch (err) {
        console.error(err)
      }
    },
    handleFilter() {
      // filtro reativo já aplicado via computed
    }
  },
  mounted() {
    this.fetchUsers()
  }
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 1.5rem;
  background-color: #ffffff;
  color: #2d3748;
}
.header-search {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
@media (min-width: 640px) {
  .header-search {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.header-search h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
@media (min-width: 640px) {
  .header-search h1 {
    margin-bottom: 0;
  }
}
.search-controls {
  display: flex;
  gap: 0.5rem;
}
.input-field {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  width: 12rem;
  outline: none;
}
.input-field:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}
.button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  background-color: #f3f4f6;
  cursor: pointer;
}
.button:hover {
  background-color: #e5e7eb;
}
.table-wrapper {
  overflow-x: auto;
}
.users-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.users-table th,
.users-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}
.users-table thead tr {
  border-bottom: 2px solid #cbd5e1;
}
.users-table tbody tr:hover {
  background-color: #f9fafb;
}
</style>
