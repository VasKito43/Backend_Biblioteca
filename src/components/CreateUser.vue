<template>
  <div>
    <!-- Botão Voltar -->
    <button class="back-button" @click="$router.push('/users')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
      </svg>
      Voltar
    </button>

    <div class="register-container">
      <h1>Cadastrar Usuário</h1>

      <form @submit.prevent="submitForm" class="register-form">
        <!-- Dados do Usuário -->
        <div class="form-group">
          <label for="name">Nome</label>
          <input id="name" v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
          <label for="dateBirth">Data de Nascimento</label>
          <input id="dateBirth" v-model="form.dateBirth" type="date" required />
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label for="phone">Telefone</label>
          <input id="phone" v-model="form.phone" type="tel" required />
        </div>

        <!-- Tipo de Usuário -->
        <div class="form-group">
          <label for="typeId">Tipo de Usuário</label>
          <select id="typeId" v-model.number="form.typeId">
            <option :value="1">Estudante</option>
            <option :value="2">Professor</option>
            <option :value="3">Bibliotecário</option>
          </select>
        </div>

        <!-- Endereço -->
        <fieldset>
          <legend>Endereço</legend>

          <div class="form-group">
            <label for="cep">CEP</label>
            <input id="cep" v-model="address.cep" type="text" required />
          </div>
          <div class="form-group">
            <label for="houseNumber">Número</label>
            <input id="houseNumber" v-model="address.houseNumber" type="text" required />
          </div>
          <div class="form-group">
            <label for="complement">Complemento</label>
            <input id="complement" v-model="address.complement" type="text" />
          </div>
        </fieldset>

        <!-- Status fixo -->
        <input type="hidden" v-model.number="form.statsUserId" />

        <button type="submit" class="button-submit">Cadastrar</button>

        <p v-if="message" :class="{'success': success, 'error': !success}">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateUser',
  data() {
    return {
      form: {
        name: '',
        dateBirth: '',
        email: '',
        phone: '',
        typeId: 1,      // 1: Estudante, 2: Professor, 3: Bibliotecário
        statsUserId: 1, // sempre ativo
        debts: 0,       // inicializa dívida em zero
        linkImg: null   // sem imagem
      },
      address: {
        cep: '',
        houseNumber: '',
        complement: ''
      },
      message: '',
      success: false
    };
  },
  methods: {
    async submitForm() {
      this.message = '';
      try {
        // 1) Cadastrar endereço
        const addrRes = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.address)
        });
        if (!addrRes.ok) throw new Error('Erro ao cadastrar endereço.');
        const addrCreated = await addrRes.json();
        const addressId = addrCreated.idAddress;
        if (!addressId) throw new Error('ID do endereço não retornado pelo servidor.');

        // 2) Montar payload de usuário
        const payload = {
          name:        this.form.name,
          dateBirth:   this.form.dateBirth,
          email:       this.form.email,
          phone:       this.form.phone,
          addressId,                       // importante
          typeId:      this.form.typeId,
          statsUserId: this.form.statsUserId,
          debts:       this.form.debts,
          linkImg:     this.form.linkImg
        };

        // 3) Cadastrar usuário
        const userRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!userRes.ok) {
          const err = await userRes.json();
          throw new Error(err.error || 'Erro ao cadastrar usuário.');
        }
        const userCreated = await userRes.json();

        this.message = `Usuário "${userCreated.name}" cadastrado com sucesso!`;
        this.success = true;
        this.resetForm();
      } catch (err) {
        console.error(err);
        this.message = err.message;
        this.success = false;
      }
    },
    resetForm() {
      this.form = {
        name: '',
        dateBirth: '',
        email: '',
        phone: '',
        typeId: 1,
        statsUserId: 1,
        debts: 0,
        linkImg: null
      };
      this.address = {
        cep: '',
        houseNumber: '',
        complement: ''
      };
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
.back-button svg {
  margin-right: 0.5rem;
}
.back-button:hover {
  color: #2d3748;
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
.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
}
fieldset {
  border: 1px solid #e2e8f0;
  padding: 1rem;
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
.error   { color: #c53030; font-weight: 600; }
</style>
