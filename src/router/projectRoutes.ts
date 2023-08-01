import type { RouteRecordRaw } from 'vue-router'

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: { name: 'MainDashboard' },
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
        path: '/clients',
        name: 'MainClients',
        component: () => import('@/views/Main/Clients/index.vue'),
        redirect: { name: 'MainClientsContracts' },
        children: [
          {
            path: 'contracts',
            name: 'MainClientsContracts',
            component: () => import('@/views/Main/Clients/ClientsContracts/index.vue'),
            redirect: { name: 'MainClientsContractsList' },
            children: [
              {
                path: 'list',
                name: 'MainClientsContractsList',
                meta: { title: 'ClientsContracts' },
                component: () => import('@/views/Main/Clients/ClientsContracts/List/index.vue')
              },
              {
                path: 'view/:id',
                name: 'MainClientsContractsView',
                meta: { title: 'ClientContractsView' },
                component: () => import('@/views/Main/Clients/ClientsContracts/View/index.vue')
              }
            ]
          },
          {
            path: 'coborrowers',
            name: 'MainClientsCoborrowers',
            component: () => import('@/views/Main/Clients/Coborrowers/index.vue'),
            redirect: { name: 'MainClientsCoborrowersList' },
            children: [
              {
                path: 'list',
                name: 'MainClientsCoborrowersList',
                meta: { title: 'Coborrowers' },
                component: () => import('@/views/Main/Clients/Coborrowers/List/index.vue')
              },
              {
                path: 'view/:id',
                name: 'MainClientsCoborrowersView',
                meta: { title: 'CoborrowersView' },
                component: () => import('@/views/Main/Clients/Coborrowers/View/index.vue')
              }
            ]
          },
          {
            path: 'white',
            name: 'MainClientsWhite',
            component: () => import('@/views/Main/Clients/WhiteList/index.vue'),
            redirect: { name: 'MainClientsWhiteList' },
            children: [
              {
                path: 'list',
                name: 'MainClientsWhiteList',
                meta: { title: 'WhiteList' },
                component: () => import('@/views/Main/Clients/WhiteList/List/index.vue')
              },
              {
                path: 'add',
                name: 'MainClientsWhiteAdd',
                meta: { title: 'WhiteListAdd' },
                component: () => import('@/views/Main/Clients/WhiteList/Add/index.vue')
              }
            ]
          },
          {
            path: 'add',
            name: 'MainClientsAdd',
            meta: { title: 'ClientAdd' },
            component: () => import('@/views/Main/Clients/AddClient/index.vue')
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
            path: '',
            name: 'MainImported',
            component: () => import('@/views/Main/Import/ImportedFiles/index.vue'),
            redirect: { name: 'MainImportedFiles' },
            children:[
              {
                path: "files",
                name: "MainImportedFiles",
                meta: { title: 'ImportedFiles' },
                component: () => import("@/views/Main/Import/ImportedFiles/Files/index.vue")
              },
              {
                path: "view/:id",
                name: "MainImportView",
                meta: { title: 'View' },
                component: () => import("@/views/Main/Import/ImportedFiles/View/index.vue"),
              }
            ]
          }
        ]
      },

      {
        path: 'orgs',
        name: 'MainOrgs',
        component: () => import('@/views/Main/System/index.vue'),
        redirect: { name: 'MainOrgsTerminalsList' },
        children: [
          {
            path: 'terminals',
            name: 'MainOrgsTerminals',
            component: () => import('@/views/Main/System/Terminals/index.vue'),
            redirect: { name: 'MainOrgsTerminalsList' },
            children: [
              {
                path: 'list',
                name: 'MainOrgsTerminalsList',
                meta: { title: 'Terminals' },
                component: () => import('@/views/Main/System/Terminals/List/index.vue')
              },
              {
                path: 'add',
                name: 'MainOrgsTerminalsAdd',
                meta: { title: 'TerminalAdd' },
                component: () => import('@/views/Main/System/Terminals/Add/index.vue')
              },
              {
                path: 'edit/:id',
                name: 'MainOrgsTerminalsEdit',
                meta: { title: 'TerminalEdit' },
                component: () => import('@/views/Main/System/Terminals/Edit/index.vue')
              }
            ]
          },
          {
            path: 'users',
            name: 'MainOrgsUsers',
            component: () => import('@/views/Main/System/Users/index.vue'),
            redirect: { name: 'MainOrgsUsersList' },
            children: [
              {
                path: 'list',
                name: 'MainOrgsUsersList',
                meta: { title: 'Users' },
                component: () => import('@/views/Main/System/Users/List/index.vue')
              },
              {
                path: 'add',
                name: 'MainOrgsUsersAdd',
                meta: { title: 'UserAdd' },
                component: () => import('@/views/Main/System/Users/Add/index.vue')
              },
              {
                path: 'edit/:id',
                name: 'MainOrgsUsersEdit',
                meta: { title: 'UserEdit' },
                component: () => import('@/views/Main/System/Users/Edit/index.vue')
              }
            ]
          },
          {
            path: 'roles',
            name: 'MainOrgsRoles',
            component: () => import('@/views/Main/System/Roles/index.vue'),
            redirect: { name: 'MainOrgsRolesList' },
            children: [
              {
                path: 'list',
                name: 'MainOrgsRolesList',
                meta: { title: 'Roles' },
                component: () => import('@/views/Main/System/Roles/List/index.vue')
              },
              {
                path: 'add',
                name: 'MainOrgsRolesAdd',
                meta: { title: 'RoleAdd' },
                component: () => import('@/views/Main/System/Roles/Add/index.vue')
              },
              {
                path: 'edit/:id',
                name: 'MainOrgsRolesEdit',
                meta: { title: 'RoleEdit' },
                component: () => import('@/views/Main/System/Roles/Edit/index.vue')
              }
            ]
          }
        ]
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
