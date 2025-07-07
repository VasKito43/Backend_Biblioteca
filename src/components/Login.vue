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
.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
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
  width: 24rem;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.user-icon {
  width: 5rem;
  height: 5rem;
  color: #6b7280;
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
  color: #374151;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  color: #374151;
}

.input-field:focus {
  border-color: #60a5fa;
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
  background-color: #374151;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.links a {
  color: #2563eb;
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

/* RESPONSIVO: esconder imagem e ocupar 100% com fundo único */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
    background-color: #496090;
  }

  .image-area {
    display: none;
  }

  .form-area {
    flex: none;
    width: 100%;
    height: 100vh;
    background-color: #496090;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  .form-container {
    width: 90%;
    max-width: 22rem;
    margin: auto;
  }

  .user-icon {
    width: 4rem;
    height: 4rem;
  }
}


</style>
