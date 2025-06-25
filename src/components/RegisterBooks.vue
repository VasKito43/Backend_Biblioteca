<template>
  <div>
    <!-- Botão Voltar para página anterior -->
    <button class="back-button" @click="$router.push('/books')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
      </svg>
      Voltar
    </button>

    <!-- Busca por ISBN -->
    <div class="isbn-search">
      <input v-model="searchIsbn" placeholder="Informe o ISBN" class="input-isbn" />
      <button @click="fetchBookInfo" class="button-isbn">Buscar ISBN</button>
    </div>

    <div class="register-container">
      <h2>Cadastrar Novo Livro</h2>
      <form @submit.prevent="submitForm" class="register-form">
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input id="isbn" v-model="form.isbn" type="text" readonly />
        </div>
        <div class="form-group">
          <label for="title">Título</label>
          <input id="title" v-model="form.title" type="text" required />
        </div>
        <div class="form-group">
          <label for="realeaseDate">Data de Lançamento</label>
          <input id="realeaseDate" v-model="form.realeaseDate" type="date" required />
        </div>
        <div class="form-group">
          <label for="registerDate">Data de Registro</label>
          <input id="registerDate" v-model="form.registerDate" type="date" required />
        </div>
        <div class="form-group">
          <label for="quantityAvailable">Quantidade Disponível</label>
          <input id="quantityAvailable" v-model.number="form.quantityAvailable" type="number" min="0" required />
        </div>
        <div class="form-group">
          <label for="edition">Edição</label>
          <input id="edition" v-model="form.edition" type="text" />
        </div>
        <div class="form-group">
          <label for="linkImg">URL da Capa</label>
          <input id="linkImg" v-model="form.linkImg" type="url" />
        </div>
        <button type="submit" class="button-submit">Cadastrar</button>
        <p v-if="message" :class="{'success': success, 'error': !success}">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterBooks',
  data() {
    return {
      searchIsbn: '',
      form: {
        isbn: '',
        title: '',
        realeaseDate: '',
        registerDate: '',
        quantityAvailable: 1,
        edition: '',
        linkImg: ''
      },
      message: '',
      success: false
    }
  },
  methods: {
    async fetchBookInfo() {
      if (!this.searchIsbn) return;
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${this.searchIsbn}`);
        const data = await res.json();
        if (!data.items || data.items.length === 0) throw new Error('ISBN não encontrado.');
        const info = data.items[0].volumeInfo;
        this.form.isbn = this.searchIsbn;
        this.form.title = info.title || '';
        if (info.publishedDate) {
          const date = new Date(info.publishedDate);
          this.form.realeaseDate = date.toISOString().split('T')[0];
        }
        this.form.registerDate = new Date().toISOString().split('T')[0];
        this.form.edition = info.subtitle || info.industryIdentifiers?.[0]?.type || '';
        this.form.linkImg = info.imageLinks?.thumbnail?.replace('&edge=curl', '') || '';
      } catch (err) {
        console.error(err);
        this.message = err.message;
        this.success = false;
      }
    },
    async submitForm() {
      try {
        const payload = { ...this.form };
        const res = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Erro ao cadastrar livro.');
        const created = await res.json();
        this.message = `Livro "${created.title}" cadastrado com sucesso!`;
        this.success = true;
        this.resetForm();
      } catch (err) {
        console.error(err);
        this.message = err.message || 'Erro ao cadastrar livro.';
        this.success = false;
      }
    },
    resetForm() {
      this.searchIsbn = '';
      this.form = {
        isbn: '',
        title: '',
        realeaseDate: '',
        registerDate: '',
        quantityAvailable: 1,
        edition: '',
        linkImg: ''
      };
    }
  }
}
</script>

<style scoped>
.back-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #4a5568;
}
.back-button svg {
  margin-right: 0.5rem;
}
.back-button:hover {
  color: #2d3748;
}
.isbn-search {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
}
.input-isbn {
  width: 200px;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
}
.button-isbn {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}
.button-isbn:hover {
  background-color: #2563eb;
}
.register-container {
  max-width: 600px;
  margin: auto;
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
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 0.25rem;
  font-weight: 600;
}
.form-group input {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
}
.button-submit {
  padding: 0.75rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
}
.button-submit:hover {
  background-color: #2563eb;
}
.success { color: #2f855a; font-weight: 600; }
.error { color: #c53030; font-weight: 600; }
</style>