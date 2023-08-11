import type { RouteRecordRaw } from 'vue-router'

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: { name: 'MainStudents' },
    meta: { private: true },
    children: [
      /* ================= Main Side ================= */

      {
        path: '/profile',
        name: 'MainProfile',
        meta: { title: 'Profile' },
        component: () => import('@/views/Main/Profile/index.vue')
      },

      {
        path: '/dashboard',
        name: 'MainDashboard',
        meta: { title: 'Dashboard' },
        component: () => import('@/views/Main/Dashboard/index.vue')
      },

      {
        path: '/students',
        name: 'MainStudents',
        component: () => import('@/views/Main/Students/index.vue'),
        redirect: { name: 'MainStudentsContracts' },
        children: [
          {
            path: 'contracts',
            name: 'MainStudentsContracts',
            component: () => import('@/views/Main/Students/ClientsContracts/index.vue'),
            redirect: { name: 'MainStudentsContractsList' },
            children: [
              {
                path: 'list',
                name: 'MainStudentsContractsList',
                meta: { title: 'StudentsContracts' },
                component: () => import('@/views/Main/Students/ClientsContracts/List/index.vue')
              },
              {
                path: 'view/:id',
                name: 'MainStudentsContractsView',
                meta: { title: 'StudentContractView' },
                component: () => import('@/views/Main/Students/ClientsContracts/View/index.vue')
              }
            ]
          },
          {
            path: 'add',
            name: 'MainStudentsAdd',
            meta: { title: 'ClientAdd' },
            component: () => import('@/views/Main/Students/AddClient/index.vue')
          }
        ]
      },

      {
        path: 'cards',
        name: 'MainCards',
        component: () => import('@/views/Main/Cards/index.vue'),
        redirect: { name: 'MainCardsList' },
        children: [
          {
            path: 'list',
            name: 'MainCardsList',
            meta: { title: 'Cards' },
            component: () => import('@/views/Main/Cards/List/index.vue')
          },
          {
            path: 'view/:id',
            name: 'MainCardsView',
            meta: { title: 'CardView' },
            component: () => import('@/views/Main/Cards/View/index.vue')
          }
        ]
      },

      {
        path: 'import',
        name: 'MainImport',
        component: () => import('@/views/Main/Import/index.vue'),
        redirect: { name: 'MainImportData' },
        children: [
          {
            path: 'data',
            name: 'MainImportData',
            meta: { title: 'Import' },
            component: () => import('@/views/Main/Import/ImportData/index.vue')
          },
          {
            path: "view/:id",
            name: "MainImportView",
            meta: { title: 'View' },
            component: () => import("@/views/Main/Import/View/index.vue"),
          }
        ]
      },
      {
        path: 'integration',
        name: 'MainIntegration',
        component: () => import('@/views/Main/Integration/index.vue'),
        redirect: { name: 'MainIntegrationList' },
        children: [
          {
            path: 'list',
            name: 'MainIntegrationList',
            meta: { title: 'Integration' },
            component: () => import('@/views/Main/Integration/List/index.vue')
          },
          {
            path: 'edit/:id',
            name: 'MainIntegrationEdit',
            meta: { title: 'IntegrationEdit' },
            component: () => import('@/views/Main/Integration/Edit/index.vue')
          }
        ]
      },
      {
        path: 'users',
        name: 'MainUsers',
        component: () => import('@/views/Main/Users/index.vue'),
        redirect: { name: 'MainUsersList' },
        children: [
          {
            path: 'list',
            name: 'MainUsersList',
            meta: { title: 'Users' },
            component: () => import('@/views/Main/Users/List/index.vue')
          },
          {
            path: 'add',
            name: 'MainUsersAdd',
            meta: { title: 'UserAdd' },
            component: () => import('@/views/Main/Users/Add/index.vue')
          },
          {
            path: 'edit/:id',
            name: 'MainUsersEdit',
            meta: { title: 'UserEdit' },
            component: () => import('@/views/Main/Users/Edit/index.vue')
          }
        ]
      },
      {
        path: 'system',
        name: 'MainSystem',
        component: () => import('@/views/Main/System/index.vue'),
        meta: { title: 'System' }
      }
    ]
  },
  {
    path: '/',
    name: 'BaseAuth',
    redirect: { name: 'BaseLogin' },
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { auth: true },
    children: [
      {
        path: '/login',
        name: 'BaseLogin',
        meta: { title: 'Login' },
        component: () => import('@/views/Authorization/Login/login-index.vue')
      }
    ]
  }
]
