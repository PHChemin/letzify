import { createRouter, createWebHistory } from 'vue-router'
import { getStoredToken } from '../api/client'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('../layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'projects',
          name: 'projects',
          component: () => import('../views/ProjectsView.vue'),
        },
        {
          path: 'projects/:id',
          name: 'project-detail',
          component: () => import('../views/ProjectDetailView.vue'),
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('../views/AdminView.vue'),
          meta: { requiresAdmin: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach(async (to) => {
  const token = getStoredToken()
  const isPublic = to.meta.public === true

  if (!token && !isPublic) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (token && isPublic) {
    return { name: 'dashboard' }
  }

  if (to.meta.requiresAdmin) {
    const { useAuthStore } = await import('../stores/auth')
    const auth = useAuthStore()
    if (!auth.user) await auth.bootstrap()
    if (!auth.isAdmin) return { name: 'dashboard' }
  }

  return true
})

export default router
