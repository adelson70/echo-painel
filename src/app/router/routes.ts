import AuthLayout from '@/app/layouts/AuthLayout.vue'
import MainLayout from '@/app/layouts/MainLayout.vue'

const authRoutes = [
    {
        path: '/login',
        component: AuthLayout,
        children: [
            {
                path: '',
                name: 'Login',
                component: () => import('@/features/login/views/LoginView.vue'),
            }
        ]
    }
]

const dashboardRoutes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('@/features/dashboard/views/DashboardView.vue'),
            }
        ]
    }
]

const regrasRoutes = [
    {
        path: '/regras',
        component: MainLayout,
        children: [
            {
                path: 'entrada',
                name: 'Entrada',
                component: () => import('@/features/regras/entrada/views/RegraEntradaView.vue'),
            },
            {
                path: 'saida',
                name: 'Saída',
                component: () => import('@/features/regras/saida/views/RegraSaidaView.vue'),
            },
            {
                path: 'ura',
                name: 'URA',
                component: () => import('@/features/regras/ura/views/UraView.vue'),
            },
        ]
    }
]

const relatoriosRoutes = [
    {
        path: '/relatorios',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Relatorios',
                component: () => import('@/features/relatorios/views/RelatoriosView.vue'),
            }
        ]
    }
]

const sistemaRoutes = [
    {
        path: '/sistema',
        component: MainLayout,
        children: [
            {
                path: 'usuarios',
                name: 'Usuarios',
                component: () => import('@/features/sistema/usuarios/views/UsuariosView.vue'),
            },
            {
                path: 'perfis',
                name: 'Perfis',
                component: () => import('@/features/sistema/perfis/views/PerfisView.vue'),
            },
            {
                path: 'logs',
                name: 'Logs',
                component: () => import('@/features/sistema/logs/views/LogsView.vue'),
            }
        ]
    }
]

const telefoniaRoutes = [
        {
        path: '/telefonia',
        component: MainLayout,
        children: [
            {
                path: 'filas',
                name: 'Filas',
                component: () => import('@/features/telefonia/filas/views/FilaView.vue'),
            },
            {
                path: 'grupos-de-captura',
                name: 'Grupos de Captura',
                component: () => import('@/features/telefonia/grupos-de-captura/views/GrupoCapturaView.vue'),
            },
            {
                path: 'ramais',
                name: 'Ramais',
                component: () => import('@/features/telefonia/ramais/views/RamalView.vue'),
            },
            {
                path: 'troncos',
                name: 'Troncos',
                component: () => import('@/features/telefonia/troncos/views/TroncoView.vue'),
            }
        ]
    }
]

export const routes = [
    ...authRoutes,
    ...dashboardRoutes,
    ...regrasRoutes,
    ...relatoriosRoutes,
    ...sistemaRoutes,
    ...telefoniaRoutes,
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/features/not-found/NotFoundView.vue'),
    }
]