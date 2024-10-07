import { createRouter, createWebHistory } from 'vue-router'
import FeedView from '../views/FeedView.vue'
import { auth } from '@/services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

let userLogged = {
      uid: null,
      email: null,
      displayName: null,
      bio: null,
      photoURL: null
}

/**
 * Funcion para obtener el estado del usuario
 * @returns {Promise} user state
 */
const getUserState = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, user => {
      if (user) {
        userLogged = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          bio: user.bio,
          photoURL: user.photoURL
        };
      } else {
        userLogged = {
          uid: null,
          email: null,
          displayName: null,
          bio: null,
          photoURL: null
        };
      }
      resolve(userLogged);
    });
  });
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',              name: 'Feed',           component: FeedView,                                      meta: { requiresAuth: true } },
    { path: '/account',       name: 'Account',        component: () => import('../views/AccountView.vue'),      meta: { requiresAuth: true }},
    { path: '/account/edit',  name: 'Edit Account',   component: () => import('../views/EditAccountView.vue'),  meta: { requiresAuth: true }},
    { path: '/about',         name: 'About',          component: () => import('../views/AboutView.vue') },
    { path: '/login',         name: 'Login',          component: () => import('../views/LoginView.vue') },
    { path: '/signup',        name: 'Signup',         component: () => import('../views/SignUpView.vue') },
  ]
})

router.beforeEach(async (to, from, next) => {
  await getUserState()
  // si la ruta requiere autenticación y el usuario no está autenticado redirigir a login
  if(to.meta.requiresAuth && !userLogged.uid) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
