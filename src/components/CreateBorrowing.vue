<template>
  <div class="container">
    <aside class="sidebar">
      <Sidebar />
    </aside>

    <main class="main-content">
      <h1>Novo Empréstimo</h1>
      <form @submit.prevent="submitForm" class="form">
        <!-- Usuário -->
        <div class="form-group">
          <label for="user">Usuário</label>
          <input
            id="user"
            v-model="form.userRegister"
            placeholder="Digite o nome do usuário"
            class="input-field"
          />
          <ul v-if="filteredUsers.length && form.userRegister" class="options">
            <li
              v-for="user in filteredUsers"
              :key="user.id_user"
              @click="selectUser(user)"
              class="option-item"
            >
              {{ user.name }}<br />
              <small>{{ user.email }}</small>
            </li>
          </ul>
        </div>

        <!-- Livro -->
        <div class="form-group">
          <label for="book">Livro</label>
          <input
            id="book"
            v-model="form.bookQuery"
            placeholder="Digite o título do livro"
            class="input-field"
          />
          <ul v-if="filteredBooks.length && form.bookQuery" class="options">
            <li
              v-for="book in filteredBooks"
              :key="book.isbn"
              @click="selectBook(book)"
              class="option-item book-item"
            >
              <img :src="book.linkImg || fallbackCover(book.isbn)" alt="Capa" />
              <div>
                <strong>{{ book.title }}</strong><br />
                <small>{{ book.author }}</small>
              </div>
            </li>
          </ul>
        </div>

        <button type="submit" class="submit-btn">Cadastrar Empréstimo</button>
      </form>
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
      users: [],
      books: [],
      form: {
        userRegister: '',
        userRegisterId: '',
        bookQuery: '',
        bookIsbn: ''
      }
    }
  },
  computed: {
    filteredUsers() {
      const term = (this.form.userRegister || '').toLowerCase().trim();
      if (!term) return [];
      return this.users.filter(user => {
        const name = (user.name || '').toLowerCase();
        return name.includes(term);
      });
    },
    filteredBooks() {
      const term = this.form.bookQuery.toLowerCase().trim();
      if (!term) return [];
      return this.books.filter(book =>
        book.title.toLowerCase().includes(term)
      );
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Erro ao buscar usuários');
        const raw = await res.json();
        if (!Array.isArray(raw)) {
          console.error('Resposta /api/users não é array:', raw);
          this.users = [];
          return;
        }
        this.users = raw.map(u => ({
          id_user: u.register || u.id_user,
          name: u.nome || u.name,
          email: u.email
        }));;
      } catch (err) {
        console.error('Erro ao carregar usuários', err);
        this.users = [];
      }
    },
    async fetchBooks() {
      try {
        const res = await fetch('/api/books');
        if (!res.ok) throw new Error('Erro ao buscar livros');
        const raw = await res.json();
        this.books = raw.map(b => ({
          isbn: b.isbn,
          title: b.title,
          author: b.author || (b.authors && b.authors.join(', ')) || '',
          linkImg: b.link_img  // corrige para o campo JSON correto
        }));
      } catch (err) {
        console.error('Erro ao carregar livros', err);
      }
    },
    selectUser(user) {
      this.form.userRegister = user.name;
      this.form.userRegisterId = user.id_user;
    },
    selectBook(book) {
      this.form.bookQuery = book.title;
      this.form.bookIsbn = book.isbn;
    },
    fallbackCover(isbn) {
      return `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`;
    },
    submitForm() {
      console.log({
        userRegister: this.form.userRegisterId,
        bookIsbn: this.form.bookIsbn
      });
    }
  },
  created() {
    this.fetchUsers();
    this.fetchBooks();
  }
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #ffffff;
}

h1 {
  margin-bottom: 1.5rem;
}

.form {
  max-width: 500px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
}

.options {
  position: absolute;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 0.25rem;
  z-index: 10;
}

.option-item {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
}

.option-item:hover {
  background: #f1f5f9;
}

.option-item small {
  color: #6b7280;
}

.book-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.book-item img {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
}

.submit-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.submit-btn:hover {
  background: #2563eb;
}
</style>
