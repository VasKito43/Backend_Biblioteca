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
              <th>Data</th>
              <th>Usuário</th>
              <th>Gmail</th>
              <th>Telefone</th>
              <th>Dias</th>
              <th>Débitos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id_user">
              <td>{{ user.created_at }}</td>
              <td>{{ user.type }} {{ user.nome }}</td>
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
import Sidebar from '../Sidebar.vue';

export default {
  name: 'UsersPage',
  components: { Sidebar },
  data() {
    return {
      searchName: '',
      users: [],
    };
  },
  computed: {
    filteredUsers() {
      if (!this.searchName) return this.users;
      return this.users.filter(user =>
        user.nome.toLowerCase().includes(this.searchName.toLowerCase())
      );
    },
  },
  methods: {
    handleFilter() {
      // já está reativo via computed
    },
    async fetchUsers() {
    try {
    const res = await fetch('/api/users')
    if (!res.ok) throw new Error('Falha ao carregar usuários')
    this.users = await res.json()
   } catch (err) {
    console.error(err)
   }
  },

  },
  mounted() {
  this.fetchUsers()
},
};
</script>
