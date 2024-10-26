import useAuth from '@composables/useAuth'
import AboutView from '@views/AboutView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',                    name: 'About',            component: AboutView },
    { path: '/about',               name: 'About',            component: AboutView },
    { path: '/feed',                name: 'Feed',             component: () => import('../views/FeedView.vue'),         meta: { requiresAuth: true } },
    { path: '/account',             name: 'Account',          component: () => import('../views/AccountView.vue'),      meta: { requiresAuth: true } },
    { path: '/account/:id',         name: 'AccountDetail',    component: () => import('../views/AccountView.vue'),      meta: { requiresAuth: true } },
    { path: '/account/:id/chat',    name: 'PrivateChat',      component: () => import('../views/PrivateChatView.vue'),      meta: { requiresAuth: true } },
    { path: '/account/edit',        name: 'EditAccount',      component: () => import('../views/EditAccountView.vue'),  meta: { requiresAuth: true } },
    { path: '/login',               name: 'Login',            component: () => import('../views/LoginView.vue') },
    { path: '/signup',              name: 'Signup',           component: () => import('../views/SignUpView.vue') },
    { path: '/:catchAll(.*)',       name: 'NotFound',         component: () => import('../views/NotFoundView.vue') },
  ]
})

router.beforeEach(async (to, from, next) => {
  const { user, initAuth } = useAuth();
  if (!user.value) { await initAuth(); }
  if (to.matched.some(routeRecord => routeRecord.meta.requiresAuth)) {
    if (user.value) {
      next();
    } else {
      next({ name: 'Login' });
    }
  } else if (to.name === 'Login' && user.value) {
    next({ name: 'Feed' });
  } else {
    next();
  }
});

export default router;