<template>
  <div class="container">
    <!-- Área para imagem -->
    <div class="image-area">
      <!-- Aqui você pode adicionar uma imagem ou outro conteúdo -->
    </div>

    <!-- Área do formulário -->
    <div class="form-area">
      <div class="form-container">
        <div class="icon-wrapper">
          <UserIcon class="user-icon" />
        </div>
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="register">Registro</label>
            <input
              id="register"
              type="text"
              v-model="register"
              placeholder="Ex: 1234"
              class="input-field"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input
              id="password"
              type="password"
              v-model="password"
              placeholder="Ex: 1q2w3e4r"
              class="input-field"
              required
            />
          </div>
          <button type="submit" class="submit-button">
            Entrar
          </button>
        </form>
        <div class="links">
          <a href="#">Esqueceu a Senha?</a>
          <a href="#">Cadastre-se</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UserIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'Login',
  components: {
    UserIcon
  },
  data() {
    return {
      register: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleSubmit() {
      this.error = ''
      try {
        const res = await fetch('/api/librarians/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            register: this.register,
            password: this.password
          })
        })
        if (!res.ok) {
          const { message } = await res.json().catch(() => ({}))
          throw new Error(message || 'Registro ou senha inválidos')
        }
        // marca login bem-sucedido
        localStorage.setItem('isAuthenticated', 'true')
        // redireciona para página principal
        this.$router.push('/books')
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>

<style scoped>
/* Container geral */
.container {
  display: flex;
  height: 100vh;
}

/* Área de imagem */
.image-area {
  flex: 1;
  background-color: lightblue;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Área do formulário */
.form-area {
  flex: 1;
  background-color: #496090;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 24rem; /* 96 */
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.user-icon {
  width: 5rem;
  height: 5rem;
  color: #6b7280; /* gray-500 */
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151; /* gray-700 */
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.5rem;
  outline: none;
}

.input-field:focus {
  border-color: #60a5fa; /* blue-400 */
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}

.submit-button {
  width: 100%;
  padding: 0.5rem;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.submit-button:hover {
  background-color: #374151; /* gray-800 */
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.links a {
  color: #2563eb; /* blue-600 */
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}

.error {
  color: #c53030;
  margin-top: 0.75rem;
  text-align: center;
}
</style>
