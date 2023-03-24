import { lazy } from 'react'
import { Navigate, Outlet, RouteObject } from 'react-router-dom'
import BHLayout from '@/layout/index'
import Login from '@/pages/login/index'
const Task = lazy(() => import('@/pages/task/index'))
const Setting = lazy(() => import('@/pages/setting/index'))
const Script = lazy(() => import('@/pages/script/index'))

export const routes: RouteObject[] = [
  {
    path: '',
    element: <BHLayout />,
    children: [
      { path: '/', element: <Navigate to="/task" /> },
      {
        path: '/task',
        element: <Task />
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
