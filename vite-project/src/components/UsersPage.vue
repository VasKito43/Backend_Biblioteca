<template>
  <div class="container">
    <!-- Sidebar reutilizável -->
    <Sidebar />

    <!-- Conteúdo Principal -->
    <main class="main-content">
      <!-- Cabeçalho e barra de busca -->
      <div class="header-search">
        <h1>Usuários</h1>
        <div class="search-controls">
          <input
            type="text"
            placeholder="Nome Usuário"
            v-model="searchName"
            class="input-field"
          />
          <button @click="handleFilter" class="button">
            Filtrar
          </button>
        </div>
      </div>

      <!-- Tabela de Usuários -->
      <div class="table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Usuário</th>
              <th>Gmail</th>
              <th>Telefone</th>
              <th>Dias</th>
              <th>Débitos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="index">
              <td>{{ user.date }}</td>
              <td>{{ user.type }} {{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.days }}</td>
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
      users: [
        { date: '01/02/24', type: 'Professor', name: 'Roberto', email: 'abc@gmail.com', phone: '14(405850) +55 0000', days: '4 days', debts: '0', avatar: '' },
        { date: '01/02/24', type: 'Aluno',    name: 'Vasco pta', email: 'abc@gmail.com', phone: '14(405850) +55 0000', days: '2 days', debts: '1', avatar: '' },
        // Adicione mais usuários conforme necessário
      ]
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchName) return this.users
      return this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchName.toLowerCase())
      )
    }
  },
  methods: {
    handleFilter() {
      console.log('Filtrando usuários por nome:', this.searchName)
    }
  }
}
</script>

<style scoped>
/* Layout geral */
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

/* Cabeçalho e busca */
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

/* Tabela */
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

/* Célula de débitos e avatar */
.debits-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.avatar {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  object-fit: cover;
}
</style>
