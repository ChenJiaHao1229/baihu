import { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'
import { routes as routeList } from '@/routes/index'
import '@/styles/reset.less'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import eventBus from '@/utils/eventBus'

function App() {
  const navigate = useNavigate()
  useEffect(() => {
    // 在事件总线上添加方法
    eventBus.$on('navigate', navigate)
  }, [])
  const routes = useRoutes(routeList)
  return <ConfigProvider locale={zhCN}>{routes}</ConfigProvider>
}

export default App
