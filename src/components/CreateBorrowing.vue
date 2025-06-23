<template>
  <div class="container">
    <Sidebar />
    <main class="main-content">
      <button class="back-button" @click="$router.push('/borrowing')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
        </svg>
        Voltar
      </button>

      <div class="register-container">
        <h2>Cadastrar Novo Empréstimo</h2>
        <form @submit.prevent="submitForm" class="register-form">

          <!-- Usuário com busca -->
          <div class="form-group autocomplete-group">
            <label for="userSearch">Usuário</label>
            <input
              id="userSearch"
              type="text"
              v-model="userSearch"
              @input="onUserSearch"
              placeholder="Pesquise pelo nome"
              class="input-field autocomplete-input"
              autocomplete="off"
            />
            <ul v-if="showUserDropdown" class="autocomplete-list">
              <li
                v-for="user in filteredUsers"
                :key="user.id_user"
                @click="selectUser(user)"
              >
                {{ user.name }} ({{ formatDate(user.dateBirth) }})
              </li>
            </ul>
          </div>

          <!-- Livro com busca avançada -->
          <div class="form-group autocomplete-group">
            <label for="bookSearch">Livro</label>
            <input
              id="bookSearch"
              type="text"
              v-model="bookSearch"
              @input="onBookSearch"
              placeholder="Pesquise pelo título "
              class="input-field autocomplete-input"
              autocomplete="off"
            />
            <ul v-if="showBookDropdown" class="autocomplete-list book-list">
              <li
                v-for="book in filteredBooks"
                :key="book.isbn"
                @click="selectBook(book)"
                class="book-item"
              >
                <img :src="book.linkimg || getCoverUrl(book.isbn)" class="book-thumb" />
                <div class="book-info">
                  <strong>{{ book.title }}</strong>
                </div>
              </li>
            </ul>
          </div>

          <!-- Campos ocultos para ID -->
          <input type="hidden" v-model="form.userRegister" />
          <input type="hidden" v-model="form.bookIsbn" />

          <button type="submit" class="button-submit">Cadastrar Empréstimo</button>
          <p v-if="message" :class="{ 'success': success, 'error': !success }">{{ message }}</p>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from '../Sidebar.vue'

export default {
  name: 'CreateBorrowing',
  components: { Sidebar },
  data() {
    return {
      // Form IDs
      form: {
        userRegister: null,
        bookIsbn: null,
        dateBorrowing: '',
        returnDate: ''
      },
      // Users
      users: [],
      userSearch: '',
      showUserDropdown: false,
      // Books
      books: [],
      bookSearch: '',
      showBookDropdown: false,
      // Feedback
      message: '',
      success: false
    }
  },
  computed: {
    filteredUsers() {
      const term = this.userSearch.toLowerCase()
      return this.users.filter(u => u.name.toLowerCase().includes(term))
    },
    filteredBooks() {
      const term = this.bookSearch.toLowerCase()
      return this.books.filter(b =>
        b.title.toLowerCase().includes(term) ||
        b.authors.some(a => a.toLowerCase().includes(term))
      )
    }
  },
  async created() {
    // Fetch users
    try {
      const resU = await fetch('/api/users')
      this.users = await resU.json()
    } catch (e) {
      console.error('Erro ao carregar usuários', e)
    }
    // Fetch books with authors list
    try {
      const resB = await fetch('/api/books')
      const raw = await resB.json()
      // assume authors as array in API or fetch separately
      this.books = raw.map(b => ({
        ...b,
        // API deve retornar array 'authors' ou campo único 'author'
        authors: Array.isArray(b.authors)
          ? b.authors
          : b.author
          ? [b.author]
          : []
      }))
    } catch (e) {
      console.error('Erro ao carregar livros', e)
    }
  },
  methods: {
    onUserSearch() {
      this.showUserDropdown = !!this.userSearch
    },
    selectUser(user) {
      this.form.userRegister = user.id_user
      this.userSearch = user.name
      this.showUserDropdown = false
    },
    onBookSearch() {
      this.showBookDropdown = !!this.bookSearch
    },
    selectBook(book) {
      this.form.bookIsbn = book.isbn
      this.bookSearch = book.title
      this.showBookDropdown = false
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('pt-BR')
    },
    getCoverUrl(isbn) {
      return `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`
    },
    async submitForm() {
      try {
        const res = await fetch('/api/borrowings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        })
        if (!res.ok) throw new Error('Erro ao cadastrar empréstimo')
        this.message = 'Empréstimo cadastrado com sucesso!'
        this.success = true
      } catch (err) {
        console.error(err)
        this.message = err.message
        this.success = false
      }
    }
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
  padding: 2rem;
  background-color: #ffffff;
}
.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 1rem;
}
.back-button svg { margin-right: 0.5rem; }
.back-button:hover { color: #2d3748; }
.register-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
}
.autocomplete-input { width: 100%; }
.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #cbd5e1;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 0 0 0.375rem 0.375rem;
  z-index: 10;
}
.autocomplete-list li {
  padding: 0.5rem;
  cursor: pointer;
}
.autocomplete-list li:hover { background-color: #f3f4f6; }
.book-list .book-item {
  display: flex;
  align-items: center;
}
.book-thumb {
  width: 40px;
  height: 60px;
  object-fit: cover;
  margin-right: 0.5rem;
}
.book-info strong { font-size: 0.9rem; }
.book-info small { font-size: 0.75rem; color: #4a5568; display: block; margin-top: 0.25rem; }
.input-field,
.select-field {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  outline: none;
}
.button-submit {
  padding: 0.75rem;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
}
.button-submit:hover { background-color: #2563eb; }
.success { color: #2f855a; font-weight: 600; }
.error { color: #c53030; font-weight: 600; }
</style>
