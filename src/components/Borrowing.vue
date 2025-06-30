<template>
  <div class="container">
    <!-- Sidebar reutilizável -->
    <div class="sidebar">
      <Sidebar />
    </div>

    <!-- Conteúdo Principal -->
    <main class="main-content">
      <!-- Cabeçalho e barra de busca -->
      <div class="header-search">
        <h1>Empréstimos</h1>
        <div class="search-controls">
          <input
            type="text"
            placeholder="Nome do Livro"
            v-model="searchBook"
            class="input-field"
          />
          <button @click="handleFilter" class="button">
            Filtrar
          </button>
        </div>
      </div>

      <!-- Tabela de Empréstimos -->
      <div class="table-wrapper">
        <table class="loans-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome Livro</th>
              <th>Usuário</th>
              <th>Dias</th>
              <th>Débitos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(loan, index) in filteredLoans" :key="index">
              <td>{{ loan.date }}</td>
              <td>{{ loan.book }}</td>
              <td><span class="badge">{{ loan.user }}</span></td>
              <td>{{ loan.days }}</td>
              <td>{{ loan.debit }}</td>
              <td>
                <img
                  v-if="loan.avatar"
                  :src="loan.avatar"
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
  name: 'BorrowingPage',
  components: { Sidebar },
  data() {
    return {
      searchBook: '',
      loans: [
        { date: '01/02/24', book: 'Task 1', user: 'Roberto', days: '6 days', debit: '0', avatar: '/avatars/rob.png' },
        { date: '02/02/24', book: 'Task 2', user: 'Vasco', days: '4 days', debit: '0', avatar: '/avatars/vasco.png' },
        { date: '03/02/24', book: 'Write blog post for demo day', user: 'Bruno', days: '14 days', debit: '0', avatar: '/avatars/bruno.png' },
        // ... demais registros
      ]
    }
  },
  computed: {
    filteredLoans() {
      if (!this.searchBook) return this.loans
      return this.loans.filter(loan =>
        loan.book.toLowerCase().includes(this.searchBook.toLowerCase())
      )
    }
  },
  methods: {
    handleFilter() {
      console.log('Filtrando livros por nome:', this.searchBook)
      // lógica de filtragem adicional
    }
  }
}
</script>

<style scoped>
.dark-mode .loans-table tbody tr:hover {
  background-color: #374151;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #ddd;
  padding: 20px;
  flex-shrink: 0;
}

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
.loans-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.loans-table th,
.loans-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}
.loans-table thead tr {
  border-bottom: 2px solid #cbd5e1;
}
.loans-table tbody tr:hover {
  background-color: #f0f0f0;
}

/* Badge de usuário */
.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #ebf8ff;
  color: #2b6cb0;
  border-radius: 9999px;
  font-size: 0.875rem;
}

/* Avatar */
.avatar {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  object-fit: cover;
}

.dark-mode .button {
  background-color: #4b5563;
  color: #f9fafb;
}
.dark-mode .button:hover {
  background-color: #374151;
}
</style>
