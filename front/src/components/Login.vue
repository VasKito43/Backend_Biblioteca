<template>
  <div class="flex h-screen">
    <!-- Área para imagem (pode adicionar conteúdo se desejar) -->
    <div class="w-1/2 flex items-center justify-center bg-white">
      <!-- Exemplo: uma imagem pode ser adicionada aqui -->
    </div>

    <!-- Área do formulário -->
    <div class="w-1/2 flex flex-col items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <div class="flex justify-center mb-6">
          <UserIcon class="w-20 h-20 text-gray-500" />
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-gray-700">Usuário</label>
            <input
              type="text"
              v-model="username"
              placeholder="Ex: Thiago"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Senha</label>
            <input
              type="password"
              v-model="password"
              placeholder="Ex: 1q2w3e4r"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button type="submit" class="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
            Cadastrar
          </button>
        </form>
        <div class="flex justify-between text-sm mt-4">
          <a href="#" class="text-blue-600 hover:underline">Esqueceu a Senha?</a>
          <a href="#" class="text-blue-600 hover:underline">Cadastre-se</a>
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
      username: '',
      password: ''
    }
  },
  methods: {
    handleSubmit() {
      console.log('Usuário:', this.username, 'Senha:', this.password)
      // Redireciona para a página de livros
      this.$router.push('/books')
    }
  }
}
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>
