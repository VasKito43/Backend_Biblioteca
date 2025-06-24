<template>
  <div class="container">
    <aside class="sidebar">
      <Sidebar />
    </aside>

    <main class="main-content">
      <h1>Pagamentos de Empréstimos</h1>
      <div class="table-wrapper">
        <table class="payments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Livro</th>
              <th>Data Empréstimo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="loan in loans" :key="loan.id">
              <td>{{ loan.id }}</td>
              <td>{{ loan.userName }}</td>
              <td>{{ loan.bookTitle }}</td>
              <td>{{ formatDate(loan.dateBorrowing) }}</td>
              <td>{{ loan.statusName }}</td>
              <td>
                <button
                  v-if="loan.statusName === 'owing'"
                  @click="payLoan(loan)"
                  class="button-pay"
                >
                  Pagar
                </button>
                <span v-else class="paid-label">Pago</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from '../Sidebar.vue'

export default {
  name: 'PayBorrowings',
  components: { Sidebar },
  data() {
    return {
      loans: []
    }
  },
  methods: {
    async fetchLoans() {
      try {
        const res = await fetch('/api/borrowings');
        const raw = await res.json();
        // filtra somente empréstimos com status 'owing'
        this.loans = raw.map(b => ({
          id: b.id_borrowing,
          userName: b.user_name || b.userRegister,
          bookTitle: b.book_title || b.bookIsbn,
          dateBorrowing: b.dateBorrowing,
          statusName: b.statusName || b.statsName
        }));
      } catch (err) {
        console.error('Erro ao carregar empréstimos', err);
        this.loans = [];
      }
    },
    async payLoan(loan) {
      try {
        const res = await fetch(`/api/borrowings/${loan.id}/pay`, {
          method: 'PUT'
        });
        if (!res.ok) throw new Error('Falha ao pagar');
        this.fetchLoans();
      } catch (err) {
        console.error('Erro ao pagar empréstimo', err);
        alert('Erro ao processar o pagamento.');
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    }
  },
  created() {
    this.fetchLoans();
  }
}
</script>

<style scoped>
.container { display: flex; min-height: 100vh; }
.sidebar { width: 260px; }
.main-content { flex: 1; padding: 2rem; background: #fff; }
h1 { margin-bottom: 1.5rem; }
.table-wrapper { overflow-x: auto; }
.payments-table { width: 100%; border-collapse: collapse; }
.payments-table th,
.payments-table td { padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: left; }
.payments-table thead th { background: #f9fafb; }
.button-pay { padding: 0.5rem 1rem; background: #48bb78; color: #fff; border: none; border-radius: 0.375rem; cursor: pointer; }
.button-pay:hover { background: #38a169; }
.paid-label { color: #4a5568; font-weight: 600; }
</style>
