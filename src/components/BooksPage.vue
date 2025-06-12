<template>
  <div :class="{ 'dark-mode': darkMode }" class="container">
    <!-- Sidebar reutilizável -->
    <Sidebar :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />

    <!-- Conteúdo Principal -->
    <main class="main-content">
      <!-- Filtros de pesquisa -->
      <div class="filters">
        <h1>Livros</h1>
        <div class="filter-controls">
          <input
            type="text"
            placeholder="Nome do livro"
            class="input"
            v-model="search.title"
          />
          <input
            type="text"
            placeholder="Subcategorias"
            class="input"
            v-model="search.subcategory"
          />
          <input
            type="text"
            placeholder="Gêneros"
            class="input"
            v-model="search.genre"
          />
          <button @click="handleFilter" class="button filter-button">
            Filter
          </button>
          <button @click="handleSearch" class="button search-button">
            Pesquisar
          </button>
        </div>
      </div>
      
      <!-- Grid de livros -->
      <div class="books-grid">
        <div
          v-for="(book, index) in filteredBooks"
          :key="index"
          class="book-card"
        >
          <!-- Capa do livro -->
          <img
            :src="book.imageUrl"
            alt="Book cover"
            class="book-image"
          />
          <!-- Título e descrição -->
          <h2 class="book-title">
            {{ book.title }}
          </h2>
          <p class="book-description">
            {{ book.description }}
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
  components: {
    Sidebar
  },
  data() {
    return {
      darkMode: false,
      books: [
        {
          title: 'Educação, Tecnologia & Inovação 1',
          description: 'Descrição do livro 1',
          imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJPueYGiy4Ttp2ZzbX-sjyDeQW5D3ieLLzrA&s'
        },
        {
          title: 'Educação, Tecnologia & Inovação 2',
          description: 'Descrição do livro 2',
          imageUrl: 'https://via.placeholder.com/200x300?text=Book+Cover+2'
        },
        // Adicione mais livros conforme necessário
      ],
      search: {
        title: '',
        subcategory: '',
        genre: ''
      }
    }
  },
  computed: {
    filteredBooks() {
      return this.books.filter((book) => {
        const titleMatch = book.title
          .toLowerCase()
          .includes(this.search.title.toLowerCase())
        const subcategoryMatch =
          !this.search.subcategory ||
          book.description.toLowerCase().includes(this.search.subcategory.toLowerCase())
        const genreMatch =
          !this.search.genre ||
          book.description.toLowerCase().includes(this.search.genre.toLowerCase())
        return titleMatch && subcategoryMatch && genreMatch
      })
    }
  },
  created() {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      this.darkMode = saved === 'true'
    } else {
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  },
  methods: {
    handleFilter() {
      console.log('Filtrando com:', this.search)
    },
    handleSearch() {
      console.log('Pesquisando com:', this.search)
    }
  }
}
</script>

<style scoped>
/* Container e layout geral */
.container {
  display: flex;
  min-height: 100vh;
  color: #2d3748; /* gray-800 */
  background-color: #ffffff;
}
.dark-mode.container {
  background-color: #1a202c; /* gray-900 */
  color: #edf2f7; /* gray-100 */
}
.main-content {
  flex: 1;
  padding: 1.5rem; /* 6 */
}

/* Filtros de pesquisa */
.filters {
  margin-bottom: 1rem; /* 4 */
  display: flex;
  flex-direction: column;
}
@media (min-width: 640px) {
  .filters {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.filters h1 {
  font-size: 1.5rem; /* 2xl */
  font-weight: bold;
}
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; /* 2 */
  margin-top: 0.5rem;
}
@media (min-width: 640px) {
  .filter-controls {
    margin-top: 0;
  }
}
.input {
  padding: 0.5rem;
  width: 12rem; /* 48 */
  border: none;
  border-radius: 0.25rem;
  background-color: #f7fafc; /* gray-100 */
  color: #000000;
}
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}
.filter-button {
  background-color: #e2e8f0; /* gray-200 */
}
.filter-button:hover {
  background-color: #edf2f7; /* gray-100 */
}
.search-button {
  background-color: #3b82f6; /* blue-500 */
  color: #ffffff;
}
.search-button:hover {
  background-color: #2563eb; /* blue-600 */
}

/* Grid de livros */
.books-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem; /* 6 */
}
@media (min-width: 640px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1024px) {
  .books-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.book-card {
  border: 1px solid #e2e8f0; /* gray-200 */
  border-radius: 0.5rem; /* lg */
  padding: 1rem;
  transition: box-shadow 0.2s;
}
.book-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.book-image {
  width: 100%;
  height: 12rem; /* 48 */
  object-fit: cover;
  margin-bottom: 0.75rem; /* 3 */
}
.book-title {
  font-weight: 600;
  font-size: 1.125rem; /* lg */
  margin-bottom: 0.25rem; /* 1 */
}
.book-description {
  font-size: 0.875rem; /* sm */
  color: #718096; /* gray-600 */
}
</style>
