import { createRouter, createWebHistory } from 'vue-router'

import Login            from './components/Login.vue'
import BooksPage        from './components/BooksPage.vue'
import RegisterBooks    from './components/RegisterBooks.vue'
import UpdateBooks      from './components/UpdateBooks.vue'
import UsersPage        from './components/UsersPage.vue'
import BorrowingPage    from './components/Borrowing.vue'
import CreateBorrowing  from './components/CreateBorrowing.vue'
import PayBorrowings    from './components/PayBorrowings.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/books',
    name: 'BooksPage',
    component: BooksPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/books/register',
    name: 'RegisterBooks',
    component: RegisterBooks,
    meta: { requiresAuth: true }
  },
  {
    path: '/books/:isbn',
    name: 'UpdateBooks',
    component: UpdateBooks,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'UsersPage',
    component: UsersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/borrowing',
    name: 'BorrowingPage',
    component: BorrowingPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/borrowing/create',
    name: 'CreateBorrowing',
    component: CreateBorrowing,
    meta: { requiresAuth: true }
  },
  {
    path: '/borrowings/pay',
    name: 'PayBorrowings',
    component: PayBorrowings,
    meta: { requiresAuth: true }
  },
  {
    path: '/update/:isbn',
    name: 'UpdateBooks',
    component: UpdateBooks,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'RegisterBooks',
    component: RegisterBooks,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true'
  console.log(isAuth)
  if (to.meta.requiresAuth && !isAuth) {
    return next({ name: 'Login' })
  }
  
  next()
})

export default router
