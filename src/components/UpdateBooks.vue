<template>
  <div>
    <!-- botão voltar -->
    <button class="back-button" @click="$router.push('/books')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
           viewBox="0 0 16 16">
        <path fill-rule="evenodd"
              d="M15 8a.5.5 0 0 1-.5.5H2.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 
                 0 0 1 0-.708l5-5a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
      </svg>
      Voltar
    </button>

    <div class="register-container">
      <h2>Atualizar / Excluir Livro</h2>
      <form @submit.prevent="updateBook" class="register-form">
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input id="isbn" v-model="form.isbn" type="text" disabled />
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

        <div class="actions">
          <button type="submit" class="button-update">Atualizar</button>
          <button type="button" class="button-delete" @click="deleteBook">Excluir</button>
        </div>

        <p v-if="message" :class="{'success': success, 'error': !success}">
          {{ message }}
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateBooks',
  props: ['isbn'],
  data() {
    return {
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
    };
  },
  async created() {
    await this.fetchBook();
  },
  methods: {
    async fetchBook() {
      try {
        let book;
        const resSingle = await fetch(`/api/books/${this.isbn}`);
        if (resSingle.ok) {
          book = await resSingle.json();
        } else {
          const resAll = await fetch('/api/books');
          const all = await resAll.json();
          book = all.find(b => b.isbn === this.isbn);
        }
        if (!book) throw new Error('Livro não encontrado.');
        this.form = {
          isbn: book.isbn || '',
          title: book.title || '',
          // usa slice apenas se string definida
          realeaseDate: book.realeaseDate ? book.realeaseDate.slice(0, 10) : '',
          registerDate: book.registerDate ? book.registerDate.slice(0, 10) : '',
          quantityAvailable: book.quantityAvailable ?? 1,
          edition: book.edition || '',
          linkImg: book.linkImg || ''
        };
      } catch (err) {
        console.error(err);
        this.message = err.message;
        this.success = false;
      }
    },
    async updateBook() {
      try {
        const { isbn, ...payload } = this.form;
        const res = await fetch(`/api/books/${isbn}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Falha ao atualizar livro.');
        const updated = await res.json();
        this.message = `Livro "${updated.title}" atualizado com sucesso!`;
        this.success = true;
      } catch (err) {
        console.error(err);
        this.message = err.message;
        this.success = false;
      }
    },
    async deleteBook() {
      if (!confirm('Confirma exclusão deste livro?')) return;
      try {
        await fetch(`/api/books/${this.form.isbn}`, { method: 'DELETE' });
        this.$router.push('/books');
      } catch (err) {
        console.error(err);
        this.message = 'Erro ao excluir livro.';
        this.success = false;
      }
    }
  }
};
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
.back-button svg { margin-right: 0.5rem; }
.back-button:hover { color: #2d3748; }

.register-container {
  max-width: 600px;
  margin: 4rem auto 2rem;
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
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.button-update {
  flex: 1;
  padding: 0.75rem;
  background-color: #ecc94b;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #1a202c;
}
.button-update:hover {
  background-color: #d6bc21;
}
.button-delete {
  flex: 1;
  padding: 0.75rem;
  background-color: #f56565;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #fff;
}
.button-delete:hover {
  background-color: #c53030;
}
.success {
  color: #2f855a;
  font-weight: 600;
}
.error {
  color: #c53030;
  font-weight: 600;
}
</style>
