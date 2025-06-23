// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Login         from './components/Login.vue'
import BooksPage     from './components/BooksPage.vue'
import UsersPage     from './components/UsersPage.vue'
import Borrowing     from './components/Borrowing.vue'
import RegisterBooks from './components/RegisterBooks.vue'
import UpdateBooks   from './components/UpdateBooks.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/books',
    name: 'BooksPage',
    component: BooksPage
  },
  {
    path: '/users',
    name: 'UsersPage',
    component: UsersPage
  },
  {
    path: '/borrowing',
    name: 'Borrowing',
    component: Borrowing
  },
  {
    path: '/register',
    name: 'RegisterBooks',
    component: RegisterBooks
  },
  {
    path: '/update/:isbn',
    name: 'UpdateBooks',
    component: UpdateBooks,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
