<template>
  <div :class="{ 'dark-mode': darkMode }" class="container">
    <Sidebar :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />

    <main class="main-content">
      <!-- Filtros de pesquisa -->
      <div class="filters">
        <h1>Livros</h1>
        <div class="filter-controls">
          <input
            v-model="search.title"
            type="text"
            placeholder="Nome do livro"
            class="input"
          />
          <input
            v-model="search.subcategory"
            type="text"
            placeholder="Subcategorias"
            class="input"
          />
          <input
            v-model="search.genre"
            type="text"
            placeholder="Gêneros"
            class="input"
          />
          <button @click="handleFilter" class="button filter-button">
            Filtrar
          </button>
          <button @click="handleSearch" class="button search-button">
            Pesquisar
          </button>
        </div>
      </div>

      <!-- Grid de livros -->
      <div class="books-grid">
        <div v-for="book in filteredBooks" :key="book.isbn" class="book-card">
          <div class="image-wrapper">
            <img
              :src="book.linkimg || getCoverUrl(book.isbn)"
              @error="onImageError($event, book)"
              alt="Capa do livro"
              class="book-image"
            />
          </div>
          <h2 class="book-title">{{ book.title }}</h2>
          <p class="book-meta">
            Edição: {{ book.edition }} | Disponível: {{ book.quantityAvailable }}
          </p>
          <p class="book-description">
            Registrado em: {{ formatDate(book.registerDate) }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from '../Sidebar.vue'

export default {
  name: 'BooksPage',
  components: { Sidebar },
  data() {
    return {
      darkMode: false,
      books: [],
      search: {
        title: '',
        subcategory: '',
        genre: ''
      }
    }
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(this.search.title.toLowerCase());
        const subMatch = !this.search.subcategory || (book.subcategory && book.subcategory.toLowerCase().includes(this.search.subcategory.toLowerCase()));
        const genreMatch = !this.search.genre || (book.genre && book.genre.toLowerCase().includes(this.search.genre.toLowerCase()));
        return titleMatch && subMatch && genreMatch;
      });
    }
  },
  async created() {
    // Inicializa o modo escuro baseado no localStorage ou preferência do sistema
    const saved = localStorage.getItem('darkMode')
    this.darkMode = saved !== null ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Busca livros da API
    try {
      const res = await fetch('/api/books');
      if (!res.ok) throw new Error('Erro ao carregar livros');
      this.books = await res.json();
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
    },
    handleFilter() {
      // O filtro é reativo via computed
    },
    handleSearch() {
      // Place holder para lógica de busca adicional
    },
    getCoverUrl(isbn) {
      return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    },
    onImageError(event, book) {
      const img = event.target;
      // Tenta fallback por ISBN, senão placeholder local
      if (img.src !== this.getCoverUrl(book.isbn)) {
        img.src = this.getCoverUrl(book.isbn);
      } else {
        img.src = '/bootstrap/img/placeholder-200x300.png';
      }
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}
.dark-mode.container {
  background-color: #2d3748;
}
.main-content {
  flex: 1;
  padding: 1.5rem;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.input {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  width: 12rem;
  background-color: #ffffff;
}
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}
.filter-button {
  background-color: #e2e8f0;
}
.search-button {
  background-color: #3b82f6;
  color: #ffffff;
}
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.book-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}
.book-card:hover {
  transform: translateY(-4px);
}
.image-wrapper {
  width: 100%;
  height: 300px;
  overflow: hidden;
}
.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.book-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0.75rem;
}
.book-meta {
  font-size: 0.875rem;
  color: #4a5568;
  padding: 0 0.75rem;
}
.book-description {
  font-size: 0.875rem;
  color: #4a5568;
  padding: 0 0.75rem 0.75rem;
  flex-grow: 1;
}
.dark-mode .book-card {
  background-color: #4a5568;
}
.dark-mode .book-meta,
.dark-mode .book-description {
  color: #e2e8f0;
}
</style>
