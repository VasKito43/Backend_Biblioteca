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
              :class="['option-item', { blocked: user.statsUserId !== 1 }]"
            >
              {{ user.name }}<br />
              <small>{{ user.email }}</small>
            </li>
          </ul>
        </div>

        <!-- Livro -->
        <div class="form-group form-group-mt">
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

        <button type="submit" class="submit-btn form-group-mt">Cadastrar Empréstimo</button>
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
      showUserDropdown: false,
      showBookDropdown: false,
      form: {
        userRegister: '',
        userRegisterId: null,
        userStatsId: null,
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
      const term = (this.form.bookQuery || '').toLowerCase().trim();
      if (!term) return [];
      return this.books.filter(book =>
        book.title.toLowerCase().includes(term) && book.quantityAvailable > 0
      );
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const raw = await res.json();
        console.log(raw)
        this.users = Array.isArray(raw)
          ? raw.map(u => ({
              id_user: u.register || u.id_user,
              name: u.nome || u.name,
              email: u.email,
              statsUserId: u.statsUserId
            }))
          : [];
      } catch (err) {
        console.error('Erro ao carregar usuários', err);
        this.users = [];
      }
    },
    async fetchBooks() {
      try {
        const res = await fetch('/api/books');
        const raw = await res.json();
        this.books = raw.map(b => ({
          isbn: b.isbn,
          title: b.title,
          author: b.author || (b.authors && b.authors.join(', ')) || '',
          linkImg: b.linkimg,
          quantityAvailable: b.quantityavailable
        }));
      } catch (err) {
        console.error('Erro ao carregar livros', err);
      }
    },
    selectUser(user) {
       this.form.userRegister    = user.name;
       this.form.userRegisterId  = user.id_user;
       this.form.userStatsId     = user.statsUserId;
       this.showUserDropdown     = false;
     },
    selectBook(book) {
      this.form.bookQuery = book.title;
      this.form.bookIsbn = book.isbn;
      this.showBookDropdown = false;
    },
    fallbackCover(isbn) {
      return `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`;
    },
    async submitForm() {
    if (this.form.userStatsId !== 2) {
       alert('Usuário não pode realizar empréstimo: pendências existentes.');
       return;
     }
    if (!this.form.userRegisterId || !this.form.bookIsbn) {
      alert('Por favor, selecione um usuário e um livro.');
      return;
    }
  
    const borrowingData = {
      user_register: this.form.userRegisterId,
      librarian_register: 1, // fixo por enquanto
      book_isbn: this.form.bookIsbn,
      date_borrowing: new Date().toISOString().split('T')[0],
      return_date: null
    };
  
    try {
      const res = await fetch('/api/borrowings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(borrowingData)
      });
    
      if (!res.ok) {
        throw new Error(`Erro ao cadastrar empréstimo: ${res.statusText}`);
      }
    
      alert('Empréstimo cadastrado com sucesso!');
      // Limpar formulário, se quiser
      this.form.userRegister = '';
      this.form.userRegisterId = '';
      this.form.bookQuery = '';
      this.form.bookIsbn = '';
    
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao cadastrar o empréstimo.');
    }
  }

  },
  created() {
    this.fetchUsers();
    this.fetchBooks();
  }
}
</script>

<!-- NO TEMPLATE: 
  - acrescente @input nos <input>
  - use showUserDropdown e showBookDropdown no v-if das <ul>
-->


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

.form-group-mt{
  margin-top: 10vh;
}

.option-item.blocked {
  color: red;
}

/* Modo Escuro */
.dark-mode .main-content {
  background-color: #1f2937;
  color: #f9fafb;
}

.dark-mode .form {
  background-color: #374151;
  color: #f9fafb;
}

.dark-mode .input-field {
  background-color: #4b5563;
  color: #f9fafb;
  border-color: #6b7280;
}

.dark-mode .input-field::placeholder {
  color: #d1d5db;
}

.dark-mode .options {
  background-color: #4b5563;
  border-color: #6b7280;
}

.dark-mode .option-item {
  background-color: #4b5563;
  color: #f9fafb;
  border-bottom: 1px solid #6b7280;
}

.dark-mode .option-item:hover {
  background-color: #374151;
}

.dark-mode .option-item small {
  color: #d1d5db;
}

.dark-mode .book-item img {
  border-color: #6b7280;
}

.dark-mode .submit-btn {
  background-color: #2563eb;
}

.dark-mode .submit-btn:hover {
  background-color: #1d4ed8;
}

.dark-mode .option-item.blocked {
  color: #f87171;
}

</style>
