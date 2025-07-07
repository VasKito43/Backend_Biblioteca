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
  },
}
</script>

<style scoped>
/* Force full height */
:root, html, body {
  height: 100%;
  margin: 0;
}

/* Container e sidebar */
/* Container e sidebar */
.container {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #ddd;
  padding: 20px;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-width: 0; /* allow flex child to shrink */
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
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.button:hover {
  background: #1565c0;
}

.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
}

.users-table {
  min-width: 600px;
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}

.users-table thead th {
  background: #fafafa;
  font-weight: bold;
}

.users-table tbody tr:hover {
  background: #f0f0f0;
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
}

/* Responsividade */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
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

  .search-controls {
    width: 100%;
    gap: 8px;
  }

  .input-field {
    max-width: 100%;
  }

  .button {
    width: 100%;
    padding: 10px;
  }

  .users-table th,
  .users-table td {
    padding: 8px 6px;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .avatar {
    width: 28px;
    height: 28px;
  }
}
</style>
