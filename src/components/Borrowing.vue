<template>
  <div class="container">
    <Sidebar />
    <main class="main-content">
      <h1>Empréstimos</h1>


      <!-- Filtros -->
      <div class="filters">
        <select v-model="filters.status" class="input-field">
          <option value="">Todos status</option>
          <option v-for="s in statusOptions" :key="s.id" :value="s.name">
            {{ s.name }}
          </option>
        </select>
        <input v-model="filters.search" placeholder="Livro ou ISBN" class="input-field" />
        <input type="date" v-model="filters.date" class="input-field" />
        <button @click="applyFilters" class="button">Filtrar</button>
      </div>


      <!-- Tabela de empréstimos -->
      <div class="table-wrapper">
        <table class="loans-table">
          <thead>
            <tr>
              <th>Data Empréstimo</th>
              <th>Data Devolução</th>
              <th>Usuário</th>
              <th>Bibliotecário</th>
              <th>ISBN</th>
              <th>Livro</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="loan in filteredLoans"
              :key="loan.id"
              :class="{
                'returned-row': loan.status === 'pago',
                'late-row': loan.status === 'atrasado' || loan.status === 'atrasado'
              }"
            >
              <td>{{ formatDate(loan.dateBorrowing) }}</td>
              <td>{{ formatDate(loan.expectedReturn) }}</td>
              <td>{{ loan.userName }}</td>
              <td>{{ loan.librarianName }}</td>
              <td>{{ loan.bookIsbn }}</td>
              <td>{{ loan.bookTitle }}</td>
              <td>{{ loan.status }}</td>
              <td>
                <template v-if="loan.status !== 'pago'">
                  <button
                    @click="openReturnDialog(loan)"
                    :class="['button action-button', { 'disabled-button': loan.status === 'pago' }]"
                    :disabled="loan.status === 'pago'"
                  >
                    {{ loan.isLate ? 'Pagar e Devolver' : 'Devolver' }}
                  </button>
                </template>
                <template v-else>
                  <button class="button disabled-button" disabled>Devolvido</button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      <!-- Modal de devolução -->
      <div v-if="showDialog" class="modal">
        <div class="modal-content">
          <h2>Devolver Livro</h2>
          <p>Usuário: {{ dialog.loan.userName }}</p>
          <p>Livro: {{ dialog.loan.bookTitle }}</p>
          <p>Multa: R$ {{ dialog.fine }}</p>
          <button @click="confirmReturn" class="button action-button">Confirmar</button>
          <button @click="closeDialog" class="button cancel-button">Cancelar</button>
        </div>
      </div>
    </main>
  </div>
</template>


<script>
import Sidebar from '../Sidebar.vue'
export default {
  name: 'BorrowingPage',
  components: { Sidebar },
  data() {
    return {
      loans: [],
      statusOptions: [
        { id: 1, name: 'pendente' },
        { id: 2, name: 'pago' },
        { id: 3, name: 'atrasado' }
      ],
      filters: {
        status: '',
        search: '',
        date: ''
      },
      showDialog: false,
      dialog: { loan: null, fine: 0 }
    }
  },
  computed: {
    filteredLoans() {
    return this.loans.filter(loan => {
      // 1) Status
      const matchStatus = this.filters.status
        ? loan.status === this.filters.status
        : true;


      // 2) Busca de texto
      const term = this.filters.search.toLowerCase();
      const matchSearch = term
        ? loan.bookTitle.toLowerCase().includes(term) ||
          loan.bookIsbn.includes(term)
        : true;


      // 3) Filtro de data (selecionada OU dia anterior)
      let matchDate = true;
      if (this.filters.date) {
        // parse YYYY‑MM‑DD do filtro
        const [sy, sm, sd] = this.filters.date.split('-').map(Number);
        const sel = new Date(sy, sm - 1, sd);
        const prev = new Date(sy, sm - 1, sd + 1);


        // parse YYYY‑MM‑DD do empréstimo
        const [ly, lm, ld] = loan.dateBorrowing.split('-').map(Number);
        const loanDate = new Date(ly, lm - 1, ld);




        matchDate =
          loanDate.getTime() === sel.getTime() ||
          loanDate.getTime() === prev.getTime();
      }


      return matchStatus && matchSearch && matchDate;
    });
  }
},
  methods: {
    async fetchLoans() {
  try {
    const res  = await fetch('/api/borrowings');
    const data = await res.json();
    this.loans = data.map(b => {
      // datas retornadas pelo banco
      const rawDate       = b.dateborrowing;
      // transforma em Date e soma 1 dia
      const loanDate = rawDate
        ? new Date(new Date(rawDate).getTime() + 24*60*60*1000)
        : null;
      const dateBorrowing = loanDate
        ? loanDate.toISOString().slice(0,10)
        : '';




      const rawExpected   = b.expected_return;
      const expectedReturn= rawExpected ? rawExpected.slice(0,10) : '';


      // determina status dinâmico
      let status = b.status;
      if (status === 'pendente' && expectedReturn) {
        const today = new Date().setHours(0,0,0,0);
        const due   = new Date(expectedReturn).setHours(0,0,0,0);
        if (today > due) status = 'atrasado';
      }


      return {
        id:             b.id_borrowing,
        userName:       b.user_name,
        librarianName:  b.librarian_name,
        bookIsbn:       b.book_isbn,
        bookTitle:      b.book_title,
        dateBorrowing,          // agora já incrementado
        expectedReturn,
        status,
        isLate: status === 'atrasado'
      };
    });
  } catch (err) {
    console.error('Erro ao carregar empréstimos:', err);
  }
},
    applyFilters() {},
    formatDate(d) {
      return new Date(d).toLocaleDateString('pt-BR');
    },
    openReturnDialog(loan) {
      const today = new Date();
      const expected = new Date(loan.expectedReturn);
      const diff = Math.ceil((today - expected) / (1000 * 60 * 60 * 24));
      this.dialog.loan = loan;
      this.dialog.fine = loan.isLate ? diff : 0;
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    },
    async confirmReturn() {
      await fetch(
        `/api/borrowings/${this.dialog.loan.id}/return`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fine: this.dialog.fine })
        }
      );
      this.showDialog = false;
      this.fetchLoans();
    }
  },
  created() {
    this.fetchLoans();
  }
}
</script>


<style scoped>
.container { display: flex; min-height: 100vh; margin-left: 15vw;}
.main-content { flex: 1; padding: 2rem; background: #fff; }
.filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.input-field { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; }
.button { padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; cursor: pointer; }
.table-wrapper { overflow-x: auto; }
.loans-table { width: 100%; border-collapse: collapse; }
.loans-table th, .loans-table td { padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: left; }
.filters select { background: #fff; }
.modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; padding: 2rem; border-radius: 0.5rem; }
.action-button { background: #48bb78; color: #fff; }
.disabled-button { background: #cbd5e1; color: #6b7280; cursor: not-allowed; }
.returned-row {
  background-color: #f0fff4;  /* fundo verde claro */
  color: #2f855a;             /* texto verde escuro */
  font-weight: bold;
}


.late-row {
  background-color: #fff5f5;  /* fundo vermelho claro */
  color: #c53030;             /* texto vermelho escuro */
  font-weight: bold;
}
</style>



