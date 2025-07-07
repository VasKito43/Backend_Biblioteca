<template>
  <div class="container">
    <Sidebar class="sidebar"/>
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
                'late-row': loan.status === 'atrasado'
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
                    v-if="loan.status !== 'pago'"
                    @click="openReturnDialog(loan)"
                    class="button action-button"
                    :disabled="returnLoading && currentReturnId === loan.id"
                  >
                    <span v-if="!(returnLoading && currentReturnId === loan.id)">
                      {{ loan.isLate ? 'Pagar e Devolver' : 'Devolver' }}
                    </span>
                    <span v-else>Processando...</span>
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
      returnLoading: false,
      currentReturnId: null,
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
        const matchStatus = this.filters.status
          ? loan.status === this.filters.status
          : true

        const term = this.filters.search.toLowerCase()
        const matchSearch = term
          ? loan.bookTitle.toLowerCase().includes(term) ||
            loan.bookIsbn.includes(term)
          : true

        let matchDate = true
        if (this.filters.date) {
          const [sy, sm, sd] = this.filters.date.split('-').map(Number)
          const sel = new Date(sy, sm - 1, sd)
          const prev = new Date(sy, sm - 1, sd + 1)

          const [ly, lm, ld] = loan.dateBorrowing.split('-').map(Number)
          const loanDate = new Date(ly, lm - 1, ld)

          matchDate =
            loanDate.getTime() === sel.getTime() ||
            loanDate.getTime() === prev.getTime()
        }

        return matchStatus && matchSearch && matchDate
      })
    }
  },
  methods: {
    async fetchLoans() {
      try {
        const res = await fetch('/api/borrowings')
        const data = await res.json()
        this.loans = data.map(b => {
          const rawDate = b.dateborrowing
          const loanDate = rawDate
            ? new Date(new Date(rawDate).getTime() + 24 * 60 * 60 * 1000)
            : null
          const dateBorrowing = loanDate
            ? loanDate.toISOString().slice(0, 10)
            : ''

          const rawExpected = b.expected_return
          const expectedReturn = rawExpected ? rawExpected.slice(0, 10) : ''

          let status = b.status
          if (status === 'pendente' && expectedReturn) {
            const today = new Date().setHours(0, 0, 0, 0)
            const due = new Date(expectedReturn).setHours(0, 0, 0, 0)
            if (today > due) status = 'atrasado'
          }

          return {
            id: b.id_borrowing,
            userName: b.user_name,
            librarianName: b.librarian_name,
            bookIsbn: b.book_isbn,
            bookTitle: b.book_title,
            dateBorrowing,
            expectedReturn,
            status,
            isLate: status === 'atrasado'
          }
        })
      } catch (err) {
        console.error('Erro ao carregar empréstimos:', err)
      }
    },
    applyFilters() {},
    formatDate(d) {
      return new Date(d).toLocaleDateString('pt-BR')
    },
    openReturnDialog(loan) {
      const today = new Date()
      const expected = new Date(loan.expectedReturn)
      const diff = Math.ceil((today - expected) / (1000 * 60 * 60 * 24))
      this.dialog.loan = loan
      this.dialog.fine = loan.isLate ? diff : 0
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    },
    async confirmReturn() {
      // ativa loading e marca qual empréstimo está sendo processado
      this.returnLoading = true
      this.currentReturnId = this.dialog.loan.id
      try {
        await fetch(
          `/api/borrowings/${this.currentReturnId}/return`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fine: this.dialog.fine })
          }
        )
        this.fetchLoans()
      } catch (err) {
        console.error('Erro ao devolver empréstimo:', err)
      } finally {
        // desativa loading, limpa estado e fecha diálogo
        this.returnLoading = false
        this.currentReturnId = null
        this.showDialog = false
      }
    }
  },
  async created() {
    await fetch('/api/users/recalculate-debts', { method: 'POST' });
    this.fetchLoans()
  }
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  padding-left: 260px; /* Largura fixa da Sidebar */
  background: #f9fafb;
  color: #1f2937;
  transition: background 0.3s, color 0.3s;
}

body.dark-mode .main-content {
  background: #1f2937;
  color: #f9fafb;
}

/* Sidebar fixa */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px; /* mesmo valor do padding-left */
  height: 100%;
  background: #1f2937;
  color: #f9fafb;
  z-index: 1000;
}

body.dark-mode .sidebar {
  background: #111827;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input-field {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: #ffffff;
  color: #1f2937;
}

body.dark-mode .input-field {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.table-wrapper {
  overflow-x: auto;
}

.loans-table {
  width: 100%;
  border-collapse: collapse;
}

.loans-table th,
.loans-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

body.dark-mode .loans-table th,
body.dark-mode .loans-table td {
  border-color: #4b5563;
}

.filters select {
  background: #fff;
}

body.dark-mode .filters select {
  background: #374151;
  color: #f9fafb;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
}

body.dark-mode .modal-content {
  background: #1f2937;
  color: #f9fafb;
}

.action-button {
  background: #48bb78;
  color: #fff;
}

.disabled-button {
  background: #cbd5e1;
  color: #6b7280;
  cursor: not-allowed;
}

.returned-row {
  background-color: #f0fff4;
  color: #2f855a;
  font-weight: bold;
}

.late-row {
  background-color: #fff5f5;
  color: #c53030;
  font-weight: bold;
}

body.dark-mode .returned-row {
  background-color: #22543d;
  color: #9ae6b4;
}

body.dark-mode .late-row {
  background-color: #742a2a;
  color: #feb2b2;
}
</style>
