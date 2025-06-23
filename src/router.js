// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Login            from './components/Login.vue'
import BooksPage        from './components/BooksPage.vue'
import RegisterBooks    from './components/RegisterBooks.vue'
import UpdateBooks      from './components/UpdateBooks.vue'
import UsersPage        from './components/UsersPage.vue'
import BorrowingPage    from './components/Borrowing.vue'
import CreateBorrowing  from './components/CreateBorrowing.vue'

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
    path: '/books/register',
    name: 'RegisterBooks',
    component: RegisterBooks
  },
  {
    path: '/books/:isbn',
    name: 'UpdateBooks',
    component: UpdateBooks,
    props: true
  },
  {
    path: '/users',
    name: 'UsersPage',
    component: UsersPage
  },
  {
    path: '/borrowing',
    name: 'BorrowingPage',
    component: BorrowingPage
  },
  {
    path: '/borrowing/create',
    name: 'CreateBorrowing',
    component: CreateBorrowing
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
