<template>
    <div class="flex min-h-screen text-gray-800">
      <!-- Sidebar reutilizável -->
      <Sidebar />
  
      <!-- Conteúdo Principal -->
      <main class="flex-1 p-6">
        <!-- Cabeçalho e barra de busca -->
        <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 class="text-2xl font-bold">Empréstimos</h1>
          <div class="flex gap-2">
            <input
              type="text"
              placeholder="Nome do Livro"
              class="border rounded p-2 w-48  border-transparent bg-gray-100"
              v-model="searchBook"
            />
            <button
              @click="handleFilter"
              class="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 border-transparent"
            >
              Filter
            </button>
          </div>
        </div>
  
        <!-- Tabela de Empréstimos -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse text-left">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="p-2">Data</th>
                <th class="p-2">Nome Livro</th>
                <th class="p-2">Usuário</th>
                <th class="p-2">Dias</th>
                <th class="p-2">Débitos</th>
                <th class="p-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(loan, index) in filteredLoans"
                :key="index"
                class="hover:bg-gray-50 border-b last:border-b-0"
              >
                <td class="p-2 w-32">{{ loan.date }}</td>
                <td class="p-2">{{ loan.book }}</td>
                <td class="p-2">
                  <span class="px-2 py-1 bg-blue-100 rounded-full text-blue-700 text-sm">
                    {{ loan.user }}
                  </span>
                </td>
                <td class="p-2">{{ loan.days }}</td>
                <td class="p-2">{{ loan.debit }}</td>
                <td class="p-2">
                  <img
                    v-if="loan.avatar"
                    :src="loan.avatar"
                    alt="Avatar"
                    class="w-6 h-6 rounded-full object-cover"
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
    components: {
      Sidebar
    },
    data() {
      return {
        searchBook: '',
        loans: [
          {
            date: '01/02/24',
            book: 'Task 1',
            user: 'Roberto',
            days: '6 days',
            debit: '0',
            avatar: '/avatars/rob.png'
          },
          {
            date: '02/02/24',
            book: 'Task 2',
            user: 'Vasco',
            days: '4 days',
            debit: '0',
            avatar: '/avatars/vasco.png'
          },
          {
            date: '03/02/24',
            book: 'Write blog post for demo day',
            user: 'Bruno',
            days: '14 days',
            debit: '0',
            avatar: '/avatars/bruno.png'
          },
          // ... demais registros
        ]
      }
    },
    computed: {
      filteredLoans() {
        if (!this.searchBook) {
          return this.loans
        }
        return this.loans.filter(loan =>
          loan.book.toLowerCase().includes(this.searchBook.toLowerCase())
        )
      }
    },
    methods: {
      handleFilter() {
        console.log('Filtrando livros por nome:', this.searchBook)
        // aqui você pode disparar lógica de filtro avançada, modal etc.
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  