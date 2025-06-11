<template>
    <div class="flex min-h-screen text-gray-800">
      <!-- Sidebar reutilizável -->
      <Sidebar />
  
      <!-- Conteúdo Principal -->
      <main class="flex-1 p-6">
        <!-- Cabeçalho e barra de busca -->
        <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 class="text-2xl font-bold">Usuário</h1>
          <div class="flex gap-2">
            <input
              type="text"
              placeholder="Nome Usuário"
              class="border rounded p-2 w-48 border-transparent bg-gray-100"
              v-model="searchName"
            />
            <button
              @click="handleFilter"
              class="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 border-transparent"
            >
              Filter
            </button>
          </div>
        </div>
  
        <!-- Tabela de Usuários -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse text-left">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="p-2">Data</th>
                <th class="p-2">Usuário</th>
                <th class="p-2">Gmail</th>
                <th class="p-2">Telefone</th>
                <th class="p-2">Dias</th>
                <th class="p-2">Débitos</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, index) in filteredUsers"
                :key="index"
                class="hover:bg-gray-50 border-b last:border-b-0"
              >
                <td class="p-2 w-32">{{ user.date }}</td>
                <td class="p-2">{{ user.type }} {{ user.name }}</td>
                <td class="p-2">{{ user.email }}</td>
                <td class="p-2">{{ user.phone }}</td>
                <td class="p-2">{{ user.days }}</td>
                <td class="p-2 flex items-center gap-2">
                  <span>{{ user.debts }}</span>
                  <img
                    v-if="user.avatar"
                    :src="user.avatar"
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
    name: 'UsersPage',
    components: {
      Sidebar
    },
    data() {
      return {
        searchName: '',
        users: [
          {
            date: '01/02/24',
            type: 'Professor',
            name: 'Roberto',
            email: 'abc@gmail.com',
            phone: '14(405850) +55 0000',
            days: '4 days',
            debts: '0',
            avatar: ''
          },
          {
            date: '01/02/24',
            type: 'Aluno',
            name: 'Vasco pta',
            email: 'abc@gmail.com',
            phone: '14(405850) +55 0000',
            days: '2 days',
            debts: '1',
            avatar: ''
          },
          // Adicione mais usuários conforme necessário
        ]
      }
    },
    computed: {
      filteredUsers() {
        if (!this.searchName) {
          return this.users
        }
        return this.users.filter((user) =>
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
  