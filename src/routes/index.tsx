import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'
import BHLayout from '@/layout/index'
import Login from '@/pages/login/index'
const Plan = lazy(() => import('@/pages/plan/index'))
const Setting = lazy(() => import('@/pages/setting/index'))
const Script = lazy(() => import('@/pages/script/index'))

export const routes: RouteObject[] = [
  {
    path: '',
    element: <BHLayout />,
    children: [
      { path: '/', element: <Navigate to="/plan" /> },
      {
        path: '/plan',
        element: <Plan />
      },
      {
        path: '/setting',
        element: <Setting />
      },
      {
        path: '/scripts',
        element: <Script />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]
